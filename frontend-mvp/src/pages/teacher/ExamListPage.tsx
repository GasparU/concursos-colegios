// src/pages/teacher/ExamListPage.tsx (diseño renovado)
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Eye,
  Users,
  Clock,
  Calendar,
  FileText,
} from "lucide-react";
import api from "../../services/api";

interface Exam {
  id: string;
  title: string;
  type: "FECHA_LIMITE" | "DURACION_FIJA";
  deadline?: string;
  durationMinutes?: number;
  questionsCount: number;
  studentsCount: number;
  complexity?: "Baja" | "Media" | "Alta"; // opcional para el diseño
}

export default function ExamListPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/exams").then((res) => setExams(res.data));
  }, []);

  const handleCreate = () => {
   navigate("/teacher/exam/new");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabecera con título y botón */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mis Exámenes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus evaluaciones y sigue el progreso de los estudiantes.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
        >
          <Plus size={20} />
          Nuevo Examen
        </button>
      </div>

      {/* Grid de tarjetas */}
      {exams.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            No hay exámenes creados
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Haz clic en "Nuevo Examen" para comenzar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Cabecera de la tarjeta con ID y complejidad (simulada) */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-xs font-mono text-blue-700 dark:text-blue-300">
                  ID: #{exam.id.slice(0, 8)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    exam.complexity === "Alta"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : exam.complexity === "Media"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  }`}
                >
                  {exam.complexity || "Media"}
                </span>
              </div>

              {/* Cuerpo de la tarjeta */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {exam.title}
                </h3>

                {/* Detalles */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    {exam.type === "DURACION_FIJA" ? (
                      <>
                        <Clock size={16} className="text-blue-500" />
                        <span>Duración: {exam.durationMinutes} min</span>
                      </>
                    ) : (
                      <>
                        <Calendar size={16} className="text-purple-500" />
                        <span>
                          Límite:{" "}
                          {new Date(exam.deadline!).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FileText size={16} className="text-indigo-500" />
                    <span>{exam.questionsCount} preguntas</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users size={16} className="text-green-500" />
                    <span>{exam.studentsCount} estudiantes</span>
                  </div>
                </div>
              </div>

              {/* Acciones (botones) */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                <Link
                  to={`/teacher/exam/${exam.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition"
                  title="Editar"
                >
                  <Edit size={18} />
                </Link>
                <Link
                  to={`/teacher/exam/${exam.id}/results`}
                  className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition"
                  title="Ver resultados"
                >
                  <Eye size={18} />
                </Link>
                <Link
                  to={`/teacher/exam/${exam.id}/students`}
                  className="p-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition"
                  title="Progreso estudiantes"
                >
                  <Users size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
