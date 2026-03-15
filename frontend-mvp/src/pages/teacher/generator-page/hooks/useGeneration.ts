import { useRef } from "react";
import { useProblemGenerator } from "../../../../hooks/useProblemGenerator";
import { toast } from "sonner";
import api from "../../../../services/api";

type Grade = "3ro" | "4to" | "5to" | "6to";
type Stage = "clasificatoria" | "final";

// Ponla justo aquí, antes del hook useGeneration
export const generarOpcionesAE = (respuesta: number) => {
  const res = Number(respuesta);
  if (isNaN(res)) {
    return {
      options: { A: "Falta dato", B: "0", C: "1", D: "2", E: "3" },
      correcta: "A",
    };
  }

  // Usamos un Set para almacenar los números únicos
  const poolSet = new Set<number>();
  poolSet.add(res);

  // Bucle infinito de seguridad: No para hasta tener 5 elementos ÚNICOS
  let variacion = 1;
  while (poolSet.size < 5) {
    const distractores = [
      res + (Math.random() > 0.5 ? 2 * variacion : -5 * variacion),
      res + (Math.random() > 0.5 ? 10 : -3 * variacion),
      res * (Math.random() > 0.5 ? 2 : 0.5),
      Math.abs(res - 4) + variacion,
    ].map((n) => Math.round(n * 10) / 10);

    // Agregamos los distractores al Set (los duplicados se ignoran solos)
    distractores.forEach((d) => poolSet.add(d));
    variacion++; // Si hubo duplicados, aumentamos la variación para no repetir números
  }

  // Cortamos a 5 elementos exactos y los ordenamos de menor a mayor
  const pool = Array.from(poolSet)
    .slice(0, 5)
    .sort((a, b) => a - b);

  const letras = ["A", "B", "C", "D", "E"];
  const options: Record<string, any> = {};
  let correcta = "A";

  // Asignamos las letras
  pool.forEach((val, i) => {
    // Si necesitas que se vea bonito en pantalla (ej. "24" en lugar de solo 24), le agregamos el $ de LaTeX
    // Si tu sistema anterior solo enviaba el número pelado, quítale el `$${val}$` y deja solo `val`
    options[letras[i]] = `$${val}$`;
    if (val === res) correcta = letras[i];
  });

  return { options, correcta };
};

interface UseGenerationProps {
  topic: string;
  config: {
    grade: Grade;
    stage: Stage;
    difficulty: string;
    model: "deepseek" | "gemini";
    quantity: number;
  };
  problems: any[];
  setProblems: React.Dispatch<React.SetStateAction<any[]>>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setGlobalProblem: (problem: any) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  topicOptions: string[];
}

export const useGeneration = ({
  topic,
  config,
  setProblems,
  setIsGenerating,
  setProgress,
  setGlobalProblem,
  topicOptions,
}: UseGenerationProps) => {
  const { generate } = useProblemGenerator();
  const abortControllerRef = useRef(false);

  const handleGenerate = async () => {
    abortControllerRef.current = false;
    if (!topic) return;

    setProblems([]);
    setIsGenerating(true);
    setProgress(0);

    // 🔥 EL PARCHE MAESTRO: Limpiamos la dificultad antes de empezar el bucle
    let dificultadParaIA = config.difficulty
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Si es mixto o concurso, para la llamada inicial usamos "intermedio" como base
    // o deja que el Smart Matcher del backend lo maneje si quitas el filtro.
    if (dificultadParaIA === "mixto" || dificultadParaIA === "concurso") {
      dificultadParaIA = "mixto"; // Asegúrate de que tu backend entienda "mixto" o mándale "" para que no filtre
    }

    const totalToGenerate = config.quantity;
    let successCount = 0;
    const MAX_SAFETY_ATTEMPTS = totalToGenerate * 30;
    let generatedCount = 0;
    let safetyAttempts = 0;

    while (
      generatedCount < totalToGenerate &&
      safetyAttempts < MAX_SAFETY_ATTEMPTS
    ) {
      if (abortControllerRef.current) {
        console.log("🛑 Generación abortada por el usuario");
        setIsGenerating(false);
        break;
      }

      safetyAttempts++;
      try {
        const randomTotal = Math.floor(Math.random() * (250 - 30) + 60);
        const forbiddenCoef = [2, 3, 5][Math.floor(Math.random() * 3)];
        const newCoef = Math.floor(Math.random() * 7) + 4;
        const variable = ["x", "y", "m", "k", "a"][
          Math.floor(Math.random() * 5)
        ];

        const chaosInstruction = `
            VARIACIÓN OBLIGATORIA ${generatedCount + 1}:
            - Usa la variable '${variable}' como incógnita.
            - El valor TOTAL o resultado final debe rondar: ${randomTotal}.
            - PROHIBIDO usar el coeficiente ${forbiddenCoef}x. Usa otros como ${newCoef}${variable}.
            - Asegura que la respuesta sea un número entero o decimal simple.
        `;

        const result = await generate(
          topic,
          config.grade,
          config.stage,
          dificultadParaIA,
          config.model,
          1,
          chaosInstruction,
        );

        if (result) {
          const rawData = (result as any).data || result;
          let newProblem = Array.isArray(rawData) ? rawData[0] : rawData;

          if (newProblem) {
            // 🛡️ EL ESCUDO DE LAS 5 ALTERNATIVAS
            // Si el problema no tiene 5 opciones (venga de IA o de Plantilla), las re-generamos.
            const numOpciones = Object.keys(newProblem.options).length;

            if (numOpciones !== 5) {
              console.log(
                "⚠️ Corrigiendo alternativas para Pregunta",
                generatedCount + 1,
              );
              // Intentamos sacar el valor numérico de la respuesta correcta
              const valorCorrecto =
                newProblem.options[newProblem.correct_answer];
              const numLimpio = Number(
                valorCorrecto.toString().replace(/[^0-9.-]/g, ""),
              );

              const { options, correcta } = generarOpcionesAE(
                isNaN(numLimpio) ? 10 : numLimpio,
              );
              newProblem.options = options;
              newProblem.correct_answer = correcta;
            }

            setProblems((prev) => {
              if (prev.length === 0) setGlobalProblem(newProblem);
              return [...prev, newProblem];
            });
            successCount++;
            generatedCount++;
          }
        }
      } catch (e) {
        console.error("Error en generación:", e);
        toast.error(
          "No se pudo generar un problema válido. Intenta con otros parámetros.",
        );
      }

      const porcentaje = Math.round((generatedCount / totalToGenerate) * 100);
      setProgress(porcentaje);
    }

    setIsGenerating(false);
    if (successCount === 0) {
      toast.error("No se pudo generar ningún problema. Intenta con otro tema.");
    } else {
      toast.success(`¡Examen listo! ${successCount} problemas generados.`);
    }
  };

  const regenerateOne = async (index: number, currentProblem: any) => {
    const toastId = toast.loading(`Regenerando problema ${index + 1}...`);

    const esParametrico = !!currentProblem.plantillaId;

    try {
      let newProblem;

      // =========================================================
      // INTENTO 1: RUTA PARAMÉTRICA (La Prioridad)
      // =========================================================
      try {
        // 🔥 EL EXTERMINADOR DE TILDES: Convierte "Básico" -> "basico"
        let dificultadReal = config.difficulty
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        // Atrapamos mixto y concurso
        if (dificultadReal === "mixto" || dificultadReal === "concurso") {
          const opciones = ["basico", "intermedio", "avanzado", "experto"];
          dificultadReal =
            opciones[Math.floor(Math.random() * opciones.length)];
        }
        const res = await api.post("/parametric/generar", {
          // Ojo: verifica que tu ruta sea la correcta (ej. /parametric-generator/generar)
          topic: currentProblem.topic || topic,
          grado: config.grade,
          dificultad: dificultadReal,
          // Si tenía plantilla, pedimos la misma. Si era IA infiltrada, mandamos undefined para que elija una al azar.
          plantillaId: esParametrico ? currentProblem.plantillaId : undefined,
        });

        if (!res || !res.data) throw new Error("Empty response");

        const data = res.data;
        const { options, correcta } = generarOpcionesAE(data.respuesta);

        let enunciadoFinal = data.enunciado;
        try {
          const aiResponse = await api.post("/ai/restyle", {
            baseText: data.enunciado,
            topic: currentProblem.topic || topic,
            grade: config.grade,
            model: config.model,
          });
          enunciadoFinal = aiResponse.data?.styledText || data.enunciado;
        } catch (e) {
          console.warn("Fallo IA narrativa, usando original.");
        }

        newProblem = {
          plantillaId: data.plantillaId,
          question_markdown: enunciadoFinal,
          options,
          correct_answer: correcta,
          solution_markdown: "Nueva solución paramétrica.",
          visual_data: data.visual_data,
          math_data: data.valores,
          topic: data.tema || topic,
        };
      } catch (parametricError) {
        // 🔥 EL CANDADO DEFINITIVO (TypeScript a prueba de balas) 🔥
        const err = parametricError as any; // Obligamos a TS a no molestar
        const errorMsg = err?.response?.data?.message || err?.message || "";

        // SOLO llamamos a la IA si el backend grita explícitamente "TEMA_IA_PURA"
        if (typeof errorMsg === "string" && errorMsg.includes("TEMA_IA_PURA")) {
          console.log("Tema sin plantillas confirmado. Usando IA Pura...");
          const result = await generate(
            currentProblem.topic || topic,
            config.grade,
            config.stage,
            config.difficulty,
            config.model,
            1,
            `VARIACIÓN ÚNICA: Regeneración. Debe ser distinto al anterior.`,
          );

          if (!result)
            throw new Error("La IA no devolvió ningún problema válido");
          const rawData = (result as any).data || result;
          newProblem = Array.isArray(rawData) ? rawData[0] : rawData;
        } else {
          // Si falló por cálculo matemático (los 200 intentos), NO LLAMAMOS A LA IA.
          throw new Error(
            "La plantilla se atascó generando los números. Vuelve a intentar.",
          );
        }
      }

      // =========================================================
      // ACTUALIZACIÓN DE UI
      // =========================================================
      if (newProblem) {
        setProblems((prev) => {
          const updated = [...prev];
          updated[index] = newProblem;
          return updated;
        });
        toast.dismiss(toastId);
        toast.success(`Problema ${index + 1} actualizado.`);
      }
    } catch (e) {
      toast.dismiss(toastId);
      toast.error("Error al regenerar. Intenta de nuevo.");
      console.error("Detalle crítico al regenerar:", e);
    }
  };

  const handleSimulacro = async () => {
    setProblems([]);
    setIsGenerating(true);
    setIsGenerating(false);

    if (topicOptions.length === 0) {
      console.warn("No hay temas para el grado y etapa seleccionados");
      return;
    }

    const shuffledTopics = [...topicOptions].sort(() => Math.random() - 0.5);
    const topicsToUse = shuffledTopics.slice(0, 20);

    for (let i = 0; i < topicsToUse.length; i++) {
      const currentTopic = topicsToUse[i];
      try {
        const randomTotal = Math.floor(Math.random() * (120 - 30) + 30);
        const variable = ["x", "n", "y", "z"][Math.floor(Math.random() * 4)];

        const chaosInstruction = `
    PREGUNTA ${i + 1} DEL SIMULACRO (${currentTopic}):
    - Usa la variable '${variable}'.
    - Usa valores numéricos cercanos a ${randomTotal}.
    - Evita repetir estructuras de preguntas anteriores.
    `;

        const result = await generate(
          currentTopic,
          config.grade,
          config.stage,
          config.stage === "final" ? "Avanzado" : "Intermedio",
          config.model,
          1,
          chaosInstruction,
        );

        if (result) {
          const newProblems = Array.isArray(result) ? result : [result];
          setProblems((prev) => {
            if (prev.length === 0 && newProblems.length > 0)
              setGlobalProblem(newProblems[0]);
            return [...prev, ...newProblems];
          });

          setTimeout(
            () =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              }),
            100,
          );
        }
      } catch (e) {
        console.error(`Error en pregunta ${i + 1} del simulacro:`, e);
      }
      await new Promise((r) => setTimeout(r, 50));
    }
    setIsGenerating(false);
  };

  return {
    handleGenerate,
    regenerateOne,
    handleSimulacro,
    abortControllerRef,
  };
};
