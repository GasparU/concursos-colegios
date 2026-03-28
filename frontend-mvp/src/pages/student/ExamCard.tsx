import { Clock, Calendar, FileText, Trash2} from "lucide-react";

interface ExamCardProps {
  exam: any; // Usamos any para evitar cualquier conflicto con tus datos
  onStart?: () => void;
  onAction?: (id: string, isCompleted: boolean) => void;
  onDelete?: (id: string) => void; // 🔥 AQUÍ DECLARAMOS EL BORRADO
}

export default function ExamCard({ exam, onStart,  onDelete }: ExamCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Sin límite";
    return new Date(dateStr).toLocaleDateString("es-PE", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all flex flex-col">
      
      {/* 🗑️ EL PUTO TACHITO DE BASURA ROJO */}
      {onDelete && (
        <button 
          onClick={() => onDelete(exam.id)}
          className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-900/20 dark:hover:bg-red-600 rounded-md transition-colors z-10"
          title="Eliminar esta prueba"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* CONTENIDO COMPACTO */}
      <div className="p-4 flex flex-col h-full gap-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight pr-8">
          {exam.title || "Examen sin título"}
        </h3>
        
        {exam.description && (
          <p className="text-[10px] text-slate-500 line-clamp-2">{exam.description}</p>
        )}

        <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-2 mb-4">
          <div className="flex items-center">
            <FileText size={12} className="mr-1.5 text-indigo-500" />
            <span>{exam.questionsCount || 0} preguntas</span>
          </div>
          {exam.durationMinutes && (
            <div className="flex items-center">
              <Clock size={12} className="mr-1.5 text-amber-500" />
              <span>{exam.durationMinutes} minutos</span>
            </div>
          )}
          {exam.deadline && (
            <div className="flex items-center">
              <Calendar size={12} className="mr-1.5 text-rose-500" />
              <span>{formatDate(exam.deadline)}</span>
            </div>
          )}
        </div>

        {/* Si pasas onStart (como tenías antes), renderiza este botón */}
        {onStart && (
          <button
            onClick={onStart}
            className="mt-auto w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white py-2 rounded text-xs font-bold transition-colors"
          >
            Iniciar Examen
          </button>
        )}
      </div>
    </div>
  );
}