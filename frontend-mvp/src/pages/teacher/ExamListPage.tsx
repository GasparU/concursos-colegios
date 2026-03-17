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
  Trash2,
  AlertTriangle // 🔥 Nuevo ícono para la alerta
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
  complexity?: "Baja" | "Media" | "Alta"; 
}

export default function ExamListPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 ESTADO PARA EL MODAL DE ELIMINACIÓN
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/exams").then((res) => {
      setExams(res.data);
      setLoading(false);
    });
  }, []);

  const handleCreate = () => {
    navigate("/teacher/exam/new");
  };

  // 🔥 LÓGICA DE BORRADO ACTUALIZADA
  const confirmDelete = async () => {
    if (!examToDelete) return;
    try {
      await api.delete(`/exams/${examToDelete}`);
      setExams(exams.filter(exam => exam.id !== examToDelete));
      setExamToDelete(null); // Cerramos el modal
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Hubo un error al eliminar. Verifica tu conexión o consola.");
    }
  };

  const formatDate = (dateStr?: string) => {
    const today = new Date().toLocaleDateString("es-PE");
    if (!dateStr) return today;
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime()) || date.getFullYear() === 1969 || date.getFullYear() === 1970) {
      return today;
    }
    return date.toLocaleDateString("es-PE");
  };

  if (loading) return (
    <div className="p-20 text-center font-black text-blue-600 animate-pulse uppercase tracking-widest">
      Cargando panel...
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      
      {/* 🔥 MODAL BONITO DE ELIMINACIÓN */}
      {examToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
                ¿Eliminar examen?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                Esta acción no se puede deshacer. Se borrará permanentemente de tu base de datos.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setExamToDelete(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-black uppercase text-xs tracking-widest rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-colors shadow-md"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cabecera */}
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Cuerpo de la tarjeta */}
              <div className="p-5 flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 line-clamp-2 leading-tight">
                  {exam.title}
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    {exam.type === "DURACION_FIJA" ? (
                      <>
                        <Clock size={16} className="text-blue-500" />
                        <span>Duración: {exam.durationMinutes} min</span>
                      </>
                    ) : (
                      <>
                        <Calendar size={16} className="text-purple-500" />
                        <span>Límite: {formatDate(exam.deadline)}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FileText size={16} className="text-indigo-500" />
                    <span>{exam.questionsCount} preguntas</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users size={16} className="text-emerald-500" />
                    <span>{exam.studentsCount} estudiantes</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center gap-2">
                <Link
                  to={`/teacher/exam/${exam.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition"
                  title="Editar"
                >
                  <Edit size={18} />
                </Link>
                <Link
                  to={`/teacher/exam/${exam.id}/results`}
                  className="p-2 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition"
                  title="Ver resultados"
                >
                  <Eye size={18} />
                </Link>
                <Link
                  to={`/teacher/exam/${exam.id}/students`}
                  className="p-2 text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition"
                  title="Progreso estudiantes"
                >
                  <Users size={18} />
                </Link>
                
                {/* 🔥 BOTÓN QUE ABRE EL MODAL BONITO */}
                <button
                  onClick={() => setExamToDelete(exam.id)}
                  className="ml-auto p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition"
                  title="Eliminar examen"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}