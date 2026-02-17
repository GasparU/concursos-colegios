import { Clock, Calendar, FileText } from "lucide-react";

interface ExamCardProps {
  exam: {
    id: string;
    title: string;
    description?: string;
    type: "FECHA_LIMITE" | "DURACION_FIJA";
    deadline?: string;
    durationMinutes?: number;
    questionsCount: number;
  };
  onStart: () => void;
}

export default function ExamCard({ exam, onStart }: ExamCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("es-PE");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
        {exam.description && (
          <p className="text-gray-600 mt-1 text-sm">{exam.description}</p>
        )}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <FileText size={16} className="mr-2" />
            <span>{exam.questionsCount} preguntas</span>
          </div>
          {exam.type === "DURACION_FIJA" && exam.durationMinutes && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-2" />
              <span>Duración: {exam.durationMinutes} minutos</span>
            </div>
          )}
          {exam.type === "FECHA_LIMITE" && exam.deadline && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={16} className="mr-2" />
              <span>Límite: {formatDate(exam.deadline)}</span>
            </div>
          )}
        </div>
        <button
          onClick={onStart}
          className="mt-5 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Iniciar Examen
        </button>
      </div>
    </div>
  );
}
