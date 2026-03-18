import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExamStore } from "../../../store/examStore";
import { useUiStore } from "../../../store/uiStore";
import { Toaster, toast } from "sonner";
import { useGeneration } from "./hooks/useGeneration";
import Toolbar from "./components/Toolbar";
import ProblemCard from "./components/ProblemCard";
import GenerationProgress from "./components/GenerationProgress"; // 🔥 AQUÍ ESTÁ LA VENTANA FLOTANTE
import SaveExamModal from "./components/SaveExamModal"; // 🔥 NUEVO MODAL
import api from "../../../services/api";
import { getTopicsByGrade } from "../../../lib/topics";


type Grade = "3ro" | "4to" | "5to" | "6to";
type Stage = "clasificatoria" | "final";

export const GeneratorPage = () => {
  const {
    fontSize,
    theme,
    increaseFont,
    decreaseFont,
    sidebarOpen,
    toggleSidebar,
  } = useUiStore();
  const navigate = useNavigate();
  const setGlobalProblem = useExamStore((state) => state.setProblem);

  // Estados principales
  const [topic, setTopic] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

    // 🔥 1. RESTAURAMOS TU FUNCIÓN FUERA DEL COMPONENTE
  const generarOpcionesAE = (respuesta: number, prefix = "", suffix = "") => {
    const res = Number(respuesta);
    if (isNaN(res)) return { options: { A: "1", B: "2", C: "3", D: "4", E: "5" }, correcta: "A" };
    
    const distractores = [
      res + (Math.random() > 0.5 ? 2 : -5),
      res + (Math.random() > 0.5 ? 10 : -3),
      res * 2,
      Math.abs(res - 4) + 1
    ].map(n => Math.round(n * 10) / 10);

    const pool = [...new Set([res, ...distractores])].slice(0, 5).sort((a, b) => a - b);
    const letras = ["A", "B", "C", "D", "E"];
    const options: Record<string, any> = {};
    let correcta = "A";

    pool.forEach((val, i) => {
      // 🔥 Armamos la cadena con el formato deseado
      options[letras[i]] = `${prefix}${val}${suffix}`;
      if (val === res) correcta = letras[i];
    });

    return { options, correcta };
  };

  // Estado para el modal de guardado
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Estados para la ventana flotante (Drag & Drop)
  const [dragPos, setDragPos] = useState({
    x: window.innerWidth / 2 - 160,
    y: 100,
  });
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [config, setConfig] = useState({
    grade: "5to" as Grade,
    stage: "clasificatoria" as Stage,
    difficulty: "Concurso",
    model: "deepseek" as "deepseek",
    quantity: 1,
  });

  const topicOptions = getTopicsByGrade(config.grade);

  // --- Lógica del Drag & Drop para la ventana de progreso ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingPanel) {
        setDragPos({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }
    };
    const handleMouseUp = () => setIsDraggingPanel(false);

    if (isDraggingPanel) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingPanel]);

  const startDrag = (e: React.MouseEvent) => {
    setIsDraggingPanel(true);
    dragOffset.current = { x: e.clientX - dragPos.x, y: e.clientY - dragPos.y };
  };

  // --- Hook de Generación (Lógica de IA) ---
  const {  regenerateOne, handleSimulacro, abortControllerRef } =
    useGeneration({
      topic,
      config,
      problems,
      setProblems,
      setIsGenerating,
      setProgress,
      setGlobalProblem,
      sidebarOpen,
      toggleSidebar,
      topicOptions,
    });

   const handleGenerateParametrico = async (append = false, cantidadExtra = 1) => {
    abortControllerRef.current = false; // Reiniciamos el seguro
    setIsGenerating(true);
    
    // Si NO estamos agregando extras, limpiamos la pantalla
    if (!append) {
      setProblems([]); 
      setProgress(0);
    }

    const temaABuscar = topic;
    const cantidad = append ? cantidadExtra : (config.quantity || 1);
    const variacionInicial = append ? problems.length : 0; // Para que no repita variables

    // =======================================================
    // 🔥 SEMÁFORO GLOBAL (BASADO EN EL TEMARIO OFICIAL)
    // =======================================================
    const palabrasLetras = ["comunicación", "lenguaje", "verbal", "lectura", "literatura", "historia", "letras", "oraciones", "verbos"];
    const esLetras = palabrasLetras.some(kw => topic.toLowerCase().includes(kw));
    const modeloAUsar = esLetras ? 'gemini' : 'deepseek';

    for (let i = 0; i < cantidad; i++) {
      // 🛑 EL ESCUDO ANTI-FANTASMAS: Si el usuario canceló, cortamos el bucle de raíz
      if (abortControllerRef.current) {
        console.log("🛑 Generación abortada. Deteniendo peticiones restantes.");
        break; 
      }

      let problemExitoso = null;
      const variacionActual = variacionInicial + i; // Índice correcto para el backend

      try {
        // 1. Petición Matemática
        const paramRes = await api.post("/parametric/generar", {
          topic: temaABuscar,             
          grado: config.grade,      
          dificultad: config.difficulty,
          variacion: variacionActual, 
          model: modeloAUsar 
        });
        
        const data = paramRes.data;
        let enunciadoFinal = data.enunciado;
        const tieneGrafico = data.visual_data || data.visualData;
        if (!tieneGrafico) {
          try {
            const aiRes = await api.post("/ai/restyle", { 
              baseText: data.enunciado, 
              topic: topic, 
              grade: config.grade, 
              model: modeloAUsar, 
              isSimulacro: false
            });
            enunciadoFinal = aiRes.data.styledText || data.enunciado;
          } catch (e) { /* ignorar fallo de restyle */ }
        }

        let opcionesArmadas = data.options || (Array.isArray(data.opciones) ? null : data.opciones);
        let letraCorrecta = data.correctAnswer || data.correct_answer || data.correcta_letra || data.correcta;
        const tiene5Opciones = opcionesArmadas && Object.keys(opcionesArmadas).length === 5;

        if (!tiene5Opciones) {
            const valorRespuesta = data.correcta_valor || data.correcta || (data.valores ? Object.values(data.valores).pop() : 0);
            
            // 🔥 AHORA LE PASAMOS EL PREFIJO Y SUFIJO DESDE EL BACKEND
            const prefijo = data.metadata?.prefijo_opciones || "";
            const sufijo = data.metadata?.sufijo_opciones || "";
            
            const generadas = generarOpcionesAE(valorRespuesta as number, prefijo, sufijo);
            opcionesArmadas = generadas.options;
            letraCorrecta = generadas.correcta;
        }

        problemExitoso = {
          plantillaId: data.plantillaId,
          question_markdown: enunciadoFinal,
          options: opcionesArmadas,
          correct_answer: letraCorrecta,
          visual_data: data.visual_data || data.visualData || null, 
          math_data: data.valores,
          topic: topic,
          dificultad_generada: data.dificultad || config.difficulty 
        };

      } catch (error) {
        // 3. IA PURA (Si no hay plantilla)
        console.warn(`Plantilla no encontrada para "${topic}". Generando vía IA Pura...`);
        try {
          const aiResponse = await api.post("/ai/generar", { 
            topic: topic, 
            grado: config.grade, 
            dificultad: config.difficulty, 
            model: modeloAUsar 
          });
          const aiData = aiResponse.data;
          
          problemExitoso = {
            plantillaId: "ia_pura",
            question_markdown: aiData.pregunta || aiData.question_markdown || aiData.enunciado,
            options: aiData.opciones || aiData.options,
            correct_answer: aiData.correcta || aiData.correct_answer,
            visual_data: aiData.visual_data || null,
            topic: topic,
            dificultad_generada: config.difficulty
          };
        } catch (iaError: any) {
          console.error(`❌ Error crítico en IA Pura:`, iaError.message);
        }
      }

      // 3. 🔥 EFECTO STREAMING
      if (problemExitoso) {
        setProblems(prev => [...prev, problemExitoso]);
      }

      // Progreso visual
      setProgress(Math.round(((i + 1) / cantidad) * 100));
      
      // Espera entre peticiones (solo si no se ha abortado)
      if (i < cantidad - 1 && !abortControllerRef.current) {
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    }

    setIsGenerating(false);
    if (!abortControllerRef.current) {
       toast.success("¡Generación completada!");
    }
  };

  // 1. Abrir Modal
  const handleOpenSaveModal = () => {
    if (problems.length === 0) {
      toast.error("Genera al menos un problema antes de guardar.");
      return;
    }
    setIsSaveModalOpen(true);
  };

  // 2. Guardado Real (Conectado a Backend actualizado)
  const handleConfirmSave = async (examData: {
    title: string;
    type: "CLASE" | "TAREA" | "SIMULACRO";
    deadline?: string;
    duration?: number;
  }) => {
    setIsSaveModalOpen(false);
    setIsSaving(true);
    const toastId = toast.loading("Guardando examen en base de datos...");

    try {
      // Preparamos el payload según el tipo
      const payload = {
        title: examData.title,
        // 🔥 AGREGAMOS ESTA LÍNEA (Es la que Prisma está reclamando)
        type: examData.type, 
        
        questionsCount: problems.length,
        grade: config.grade,
        stage: config.stage,
        difficulty: config.difficulty,
        deadline:
          examData.type === "TAREA" && examData.deadline
            ? new Date(examData.deadline).toISOString()
            : null,
        durationMinutes:
          examData.type === "SIMULACRO" ? Number(examData.duration) : null,

        // Array de preguntas
        questions: problems.map((p) => ({
          question_markdown: p.question_markdown,
          options: p.options,
          correct_answer: p.correct_answer,
          solution_markdown: p.solution_markdown,
          hint: p.hint || null,
          math_data: p.math_data || p.mathData,
          visual_data: p.visual_data || p.visualData,
          difficulty: p.dificultad_generada || 'basico'
          
        })),
      };
     

      await api.post("/exams", payload);

      toast.dismiss(toastId);
      toast.success("¡Examen guardado correctamente! 🎉");

      // Limpieza final
      setTimeout(() => {
        setProblems([]);
        setTopic("");
        navigate("/teacher/exams");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Error al guardar. Verifica la conexión.");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Edición Manual
  const handleUpdateProblem = (index: number, newText: string) => {
    setProblems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], question_markdown: newText };
      return updated;
    });
    toast.success("Pregunta editada.");
  };

  // 3.5 Eliminar un problema defectuoso
  const handleDeleteProblem = (index: number) => {
    setProblems((prev) => prev.filter((_, i) => i !== index));
    toast.success("Problema eliminado.");
  };

  // 4. Cancelar Generación (Pausa Real)
  const handleCancelGeneration = () => {
    abortControllerRef.current = true; // Dispara la señal de parada
    setIsGenerating(false);
    // Ya no hacemos setProblems([]) para no borrar lo que está en pantalla
    toast.info("Generación pausada. Lo que ya cargó se mantiene en pantalla.");
  };

  const fontSizes = {
    0: "text-xs",
    1: "text-sm",
    2: "text-base",
    3: "text-lg",
    4: "text-xl",
    5: "text-2xl",
  };
  const currentFont =
    fontSizes[fontSize as keyof typeof fontSizes] || "text-base";

  return (
    <div
      className={`h-full flex flex-col overflow-hidden font-sans transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      <Toolbar
        config={config}
        setConfig={setConfig}
        topic={topic}
        setTopic={setTopic}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        topicOptions={topicOptions}
        isGenerating={isGenerating}
        onGenerate={() => handleGenerateParametrico(false)}
        onSimulacro={handleSimulacro}
        onSave={handleOpenSaveModal} // Abre el modal
        isSaving={isSaving}
        onZoomIn={increaseFont}
        onZoomOut={decreaseFont}
        theme={theme}
        problems={problems}
        onClear={() => setProblems([])}
      />

      <div
        className={`flex-1 overflow-y-auto p-4 scrollbar-thin relative ${theme === "dark" ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div className="w-full px-2 mx-auto flex flex-col gap-3 pb-20">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
           {problems.map((prob, index) => (
              // 🔥 AQUÍ ENVOLVEMOS EL PROBLEMCARD
              <div key={index} className="relative w-full h-full">
                
                {/* 🔥 ETIQUETA FLOTANTE (Solo sale si es avanzado) */}
                {prob.dificultad_generada === 'avanzado' && (
                  <div className="absolute top-3 right-4 z-10 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-sm border border-red-200 dark:border-red-800">
                    🔥 Reto Avanzado
                  </div>
                )}

                <ProblemCard
                  problem={prob}
                  index={index}
                  theme={theme}
                  currentFont={currentFont}
                  onRegenerate={() => regenerateOne(index, prob)}
                  onUpdate={(newText) => handleUpdateProblem(index, newText)}
                  onDelete={() => handleDeleteProblem(index)}
                />
              </div>
            ))}
          </div>
          {/* 🔥 NUEVO BOTÓN: AGREGAR MÁS (Solo se ve si hay problemas y no está generando) */}
          {problems.length > 0 && !isGenerating && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => handleGenerateParametrico(true, 1)} // Llama a la función en modo "append"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar 1 problema más
              </button>
            </div>
          )}
        </div>

        {/* 🔥 VENTANA FLOTANTE DE PROGRESO */}
        {isGenerating && (
          <GenerationProgress
            progress={progress}
            isGenerating={isGenerating}
            onCancel={handleCancelGeneration} // Conectado a la limpieza
            dragPos={dragPos}
            onMouseDown={startDrag}
            problemsLength={problems.length}
            quantity={config.quantity}
          />
        )}
      </div>

      {/* MODAL DE GUARDADO */}
      <SaveExamModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        defaultTitle={`${topic || "Examen Personalizado"} - ${new Date().toLocaleDateString()}`}
      />

      <Toaster
        richColors
        position="top-center"
        closeButton
        duration={2000}
        theme={theme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};
