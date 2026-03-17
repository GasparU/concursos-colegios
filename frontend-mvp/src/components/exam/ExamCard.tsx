import { Clock, Calendar, FileText, CheckCircle, PlayCircle, Eye } from "lucide-react";

interface ExamCardProps {
  exam: {
    id: string;
    title: string;
    description?: string;
    type: string;
    deadline?: string;
    durationMinutes?: number;
    questionsCount: number;
    isCompleted?: boolean;
  };
  onAction: (id: string, isCompleted: boolean) => void;
}

export default function ExamCard({ exam, onAction }: ExamCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("es-PE");
  };

  const isDone = !!exam.isCompleted;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border flex flex-col hover:shadow-md transition-all overflow-hidden ${isDone ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/10' : 'border-slate-200 dark:border-slate-800'}`}>
      <div className="p-4 flex flex-col h-full gap-3">
        
        {/* Etiqueta y Estado */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border dark:border-slate-700 tracking-tighter">
            {exam.type?.replace('_', ' ') || 'EXAMEN'}
          </span>
          {isDone && (
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
              <CheckCircle size={12} /> Completado
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">
          {exam.title}
        </h3>

        {/* Info */}
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-auto pt-2">
          <div className="flex items-center">
            <FileText size={12} className="mr-2 text-indigo-500 opacity-80" />
            <span>{exam.questionsCount} preguntas</span>
          </div>
          {exam.durationMinutes && (
            <div className="flex items-center">
              <Clock size={12} className="mr-2 text-amber-500 opacity-80" />
              <span>{exam.durationMinutes} min</span>
            </div>
          )}
          {exam.deadline && (
            <div className="flex items-center">
              <Calendar size={12} className="mr-2 text-rose-500 opacity-80" />
              <span>Límite: {formatDate(exam.deadline)}</span>
            </div>
          )}
        </div>

        {/* Botón Inteligente: Empezar vs Resultados */}
        <button
          onClick={() => onAction(exam.id, isDone)}
          className={`w-full py-2.5 mt-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
            ${isDone 
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400" 
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            }`}
        >
          {isDone ? <><Eye size={16}/> Ver Resultados</> : <><PlayCircle size={16}/> Empezar Prueba</>}
        </button>
      </div>
    </div>
  );
}