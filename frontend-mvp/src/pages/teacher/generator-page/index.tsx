import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExamStore } from "../../../store/examStore";
import { useUiStore } from "../../../store/uiStore";
import { getTopicsByGrade } from "../../../lib/topics";
import { Toaster, toast } from "sonner";
import { useGeneration } from "./hooks/useGeneration";
import Toolbar from "./components/Toolbar";
import ProblemCard from "./components/ProblemCard";
import GenerationProgress from "./components/GenerationProgress"; // 🔥 AQUÍ ESTÁ LA VENTANA FLOTANTE
import SaveExamModal from "./components/SaveExamModal"; // 🔥 NUEVO MODAL
import api from "../../../services/api";

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
    grade: "6to" as Grade,
    stage: "clasificatoria" as Stage,
    difficulty: "Intermedio",
    model: "deepseek" as "deepseek" | "gemini",
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
  const { handleGenerate, regenerateOne, handleSimulacro, abortControllerRef } =
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

  // --- Funciones de Interacción ---

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

  // 4. Cancelar Generación (Botón Rojo de la ventanita)
  const handleCancelGeneration = () => {
    abortControllerRef.current = true; // Detiene el bucle en useGeneration
    setIsGenerating(false);
    setProgress(0);
    setProblems([]); // 🔥 Limpia todo si cancelas
    toast.info("Generación cancelada y limpiada.");
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
        problems={problems}
        onGenerate={handleGenerate}
        onSimulacro={handleSimulacro}
        onSave={handleOpenSaveModal} // Abre el modal
        isSaving={isSaving}
        onZoomIn={increaseFont}
        onZoomOut={decreaseFont}
        theme={theme}
      />

      <div
        className={`flex-1 overflow-y-auto p-4 scrollbar-thin relative ${theme === "dark" ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div className="w-full px-2 mx-auto flex flex-col gap-3 pb-20">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {problems.map((prob, index) => (
              <ProblemCard
                key={index}
                problem={prob}
                index={index}
                theme={theme}
                currentFont={currentFont}
                onRegenerate={() => regenerateOne(index, prob)}
                onUpdate={(newText) => handleUpdateProblem(index, newText)}
              />
            ))}
          </div>
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
        theme={theme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};
