import { useRef } from "react";
import { useProblemGenerator } from "../../../../hooks/useProblemGenerator";
import { toast } from "sonner";

type Grade = "3ro" | "4to" | "5to" | "6to";
type Stage = "clasificatoria" | "final";

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
  sidebarOpen,
  toggleSidebar,
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
          config.difficulty,
          config.model,
          1,
          chaosInstruction,
        );

        if (result) {
          const rawData = (result as any).data || result;
          const newProblem = Array.isArray(rawData) ? rawData[0] : rawData;

          if (newProblem) {
            setProblems((prev) => {
              if (prev.length === 0) setGlobalProblem(newProblem);
              return [...prev, newProblem];
            });
            successCount++;
            generatedCount++;
          }

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
    toast.loading(`Regenerando problema ${index + 1}...`);
    try {
      const result = await generate(
        topic,
        config.grade,
        config.stage,
        config.difficulty,
        config.model,
        1,
        `VARIACIÓN ÚNICA: Regeneración del problema ${index + 1}. Usa valores diferentes.`,
      );

      if (result) {
        const rawData = (result as any).data || result;
        const newProblem = Array.isArray(rawData) ? rawData[0] : rawData;
        if (newProblem) {
          setProblems((prev) => {
            const updated = [...prev];
            updated[index] = newProblem;
            return updated;
          });
          toast.dismiss();
          toast.success(`Problema ${index + 1} actualizado.`);
        }
      }
    } catch (e) {
      toast.error("Error al regenerar.");
      console.error(e);
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
