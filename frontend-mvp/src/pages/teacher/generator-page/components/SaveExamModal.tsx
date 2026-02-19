import { useState } from "react";
import {
  X,
  Save,
  FileText,
  Calendar,
  Timer,
  Presentation,
  BookOpen,
  AlertCircle,
} from "lucide-react";

// 1. Definimos los tipos permitidos explícitamente
type ExamMode = "CLASE" | "TAREA" | "SIMULACRO";

interface SaveExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Actualizamos la firma de onConfirm para aceptar los nuevos datos
  onConfirm: (data: {
    title: string;
    type: ExamMode;
    deadline?: string;
    duration?: number;
  }) => void;
  defaultTitle: string;
}

export default function SaveExamModal({
  isOpen,
  onClose,
  onConfirm,
  defaultTitle,
}: SaveExamModalProps) {
  const [title, setTitle] = useState(defaultTitle);

  // 🔥 AQUÍ ESTABA EL ERROR: Ahora permitimos los 3 tipos nuevos
  const [type, setType] = useState<ExamMode>("TAREA");

  const [deadline, setDeadline] = useState("");
  const [duration, setDuration] = useState(60);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({
      title,
      type,
      deadline: type === "TAREA" ? deadline : undefined,
      duration: type === "SIMULACRO" ? duration : undefined,
    });
  };

  const isFormValid = () => {
    if (!title.trim()) return false;
    if (type === "TAREA" && !deadline) return false;
    if (type === "SIMULACRO" && (duration <= 0 || !duration)) return false;
    return true;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Save size={20} />
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
              Guardar Examen
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1 hover:bg-rose-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* 1. TÍTULO */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Título del Material
            </label>
            <div className="relative">
              <FileText
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="Ej: Polinomios - Práctica de Clase"
              />
            </div>
          </div>

          {/* 2. SELECTOR DE TIPO (VISUAL) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              ¿Para qué usarás este material?
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setType("CLASE")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  type === "CLASE"
                    ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "hover:bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                }`}
              >
                <Presentation size={24} />
                <span className="text-[10px] font-bold">CLASE</span>
              </button>

              <button
                onClick={() => setType("TAREA")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  type === "TAREA"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                    : "hover:bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                }`}
              >
                <BookOpen size={24} />
                <span className="text-[10px] font-bold">TAREA</span>
              </button>

              <button
                onClick={() => setType("SIMULACRO")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  type === "SIMULACRO"
                    ? "bg-orange-50 border-orange-500 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                    : "hover:bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                }`}
              >
                <Timer size={24} />
                <span className="text-[10px] font-bold">SIMULACRO</span>
              </button>
            </div>
          </div>

          {/* 3. CONFIGURACIÓN DINÁMICA SEGÚN TIPO */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700 min-h-[80px] flex items-center justify-center transition-all">
            {type === "CLASE" && (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center flex gap-2 items-center">
                <Presentation size={16} />
                Se guardará en "Mis Clases". Sin límites de tiempo. Ideal para
                proyectar.
              </p>
            )}

            {type === "TAREA" && (
              <div className="w-full animate-in fade-in">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                  FECHA LÍMITE DE ENTREGA
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                  <AlertCircle size={10} /> Los alumnos verán la solución
                  después de entregar.
                </p>
              </div>
            )}

            {type === "SIMULACRO" && (
              <div className="w-full flex flex-col gap-2 animate-in fade-in">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                  DURACIÓN DEL EXAMEN
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-24 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    minutos
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> Cronómetro estricto. Se cierra
                  automáticamente.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isFormValid()}
            className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px]"
          >
            <Save size={16} />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
