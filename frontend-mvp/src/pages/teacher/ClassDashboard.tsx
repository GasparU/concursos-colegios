import { useState, useEffect } from "react";
import { 
  BrainCircuit, Target, Trophy, Clock, CheckCircle2, XCircle, Eye, X, Star, FileText 
} from "lucide-react";
import clsx from "clsx";
import api from "../../services/api"; // 🔥 CONEXIÓN A TU BACKEND
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface ExamRecord {
  id: string;
  title: string;
  type: "CLASE" | "TAREA" | "SIMULACRO";
  status: "COMPLETADO" | "PENDIENTE";
  dateCompleted?: string; 
  score?: number;
  totalQuestions: number;
  timeSpentStr?: string; 
  details: { 
    basico: { correct: number, total: number, avgTimeStr: string };
    intermedio: { correct: number, total: number, avgTimeStr: string };
    avanzado: { correct: number, total: number, avgTimeStr: string };
  }
}

export default function ClassDashboard() {
  const [activeFilter, setActiveFilter] = useState<"TODOS" | "CLASE" | "TAREA" | "SIMULACRO">("TODOS");
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamRecord | null>(null);

  const { studentId } = useParams()
  const { user } = useAuthStore();


  useEffect(() => {
    setLoading(true);

    api.get("/exams/student/list")
      .then((res) => {

        const examenesReales: ExamRecord[] = res.data.map((exam: any) => {
          const status = exam.isCompleted ? "COMPLETADO" : "PENDIENTE";
          
          // 🛡️ Búsqueda PROFUNDA de la NOTA
          let score = exam.score ?? exam.studentScore ?? exam.correctAnswers ?? exam.nota ?? exam.puntos;
          
          // 🔥 NUEVO: Si la nota está escondida en una relación de Prisma (ej. studentExams o attempts)
          if (score === undefined || score === null) {
            if (exam.studentExams && exam.studentExams.length > 0) {
              score = exam.studentExams[0].score ?? exam.studentExams[0].correctAnswers;
            } else if (exam.attempts && exam.attempts.length > 0) {
              score = exam.attempts[0].score ?? exam.attempts[0].correctAnswers;
            }
          }
          score = score ?? 0; // Si definitivamente no lo encuentra, pone 0
          
          const dateCompleted = exam.dateCompleted || exam.completedAt || exam.updatedAt || exam.createdAt || null;

          const detailsSeguro = exam.examResults?.[0]?.details || {
            basico: { correct: 0, total: 0, avgTimeStr: "--" },
            intermedio: { correct: 0, total: 0, avgTimeStr: "--" },
            avanzado: { correct: 0, total: 0, avgTimeStr: "--" }
          };

          return {
            id: exam.id,
            title: exam.title,
            type: exam.type || "TAREA",
            totalQuestions: exam.questionsCount || exam.totalQuestions || 0,
            status: status,
            score: score,
            timeSpentStr: exam.timeSpentStr,
            dateCompleted: dateCompleted,
            details: detailsSeguro
          };
        });
        
        setRecords(examenesReales);
      })
      .catch((err) => console.error("Error cargando analíticas:", err))
      .finally(() => setLoading(false));
  }, [studentId, user?.id]);

  const filteredRecords = records.filter(r => activeFilter === "TODOS" || r.type === activeFilter);
  const completedExams = filteredRecords.filter(r => r.status === "COMPLETADO");
  const accuracy = completedExams.length > 0 
    ? Math.round((completedExams.reduce((acc, curr) => acc + ((curr.score || 0) / curr.totalQuestions), 0) / completedExams.length) * 100) 
    : 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 pt-20">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="font-bold text-slate-500 animate-pulse uppercase tracking-widest text-sm">Sincronizando Misiones...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* HEADER Y FILTROS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <BrainCircuit className="text-indigo-600 dark:text-indigo-400" size={32} />
              Mi Progreso
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
              Misiones completadas y pendientes de Ariana.
            </p>
          </div>

          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto w-full md:w-auto">
            {["TODOS", "CLASE", "TAREA", "SIMULACRO"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f as any)}
                className={clsx(
                  "px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap",
                  activeFilter === f 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs SUPERIORES (Se quedan vacíos si no hay exámenes completados) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <Target size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Precisión Global</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {completedExams.length > 0 ? `${accuracy}%` : "--"}
              </h2>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Misiones Completadas</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {completedExams.length} <span className="text-slate-400 text-base font-medium">/ {filteredRecords.length}</span>
              </h2>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tiempo Promedio</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {completedExams.length > 0 ? "Calculando..." : "--"}
              </h2>
            </div>
          </div>
        </div>

        {/* TABLA MAESTRA */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b dark:border-slate-700">Misión (Tema)</th>
                  <th className="p-4 border-b dark:border-slate-700">Tipo</th>
                  <th className="p-4 border-b dark:border-slate-700">Estado / Fecha</th>
                  <th className="p-4 border-b dark:border-slate-700">Aciertos / Nota</th>
                  <th className="p-4 border-b dark:border-slate-700">Tiempo</th>
                  <th className="p-4 border-b dark:border-slate-700 text-center">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <FileText size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="text-slate-500 font-medium">No hay misiones asignadas en esta categoría.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((res) => {
                    const isCompleted = res.status === "COMPLETADO";
                    const isPerfect = isCompleted && res.score === res.totalQuestions;

                    return (
                      <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {isPerfect && <Star size={16} className="text-amber-500 fill-amber-500 shrink-0" />}
                            <span className={clsx("font-bold", isCompleted ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300")}>
                              {res.title}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={clsx(
                            "px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md",
                            res.type === "TAREA" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                            res.type === "CLASE" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          )}>
                            {res.type}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-medium">
                          {isCompleted ? (
                            <span className="text-slate-700 dark:text-slate-300">
                              {res.dateCompleted 
                                ? new Date(res.dateCompleted).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) 
                                : "Completado"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                              <Clock size={12} /> Pendiente
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {isCompleted ? (
                            <div className="flex items-center gap-3 font-bold text-sm">
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={16} /> {res.score}
                              </span>
                              <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
                                <XCircle size={16} /> {res.totalQuestions - res.score!}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600 font-mono text-sm">-- / {res.totalQuestions}</span>
                          )}
                        </td>
                        <td className="p-4 text-sm font-medium text-slate-400 dark:text-slate-600">
                          {isCompleted ? res.timeSpentStr : "--"}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => isCompleted && setSelectedExam(res)}
                            disabled={!isCompleted}
                            title={isCompleted ? "Ver Detalles" : "Misión no completada aún"}
                            className={clsx(
                              "p-2 rounded-lg transition-all",
                              isCompleted 
                                ? "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30" 
                                : "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50"
                            )}
                          >
                            <Eye size={20} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 👁️ MODAL DE DETALLE (EL "OJITO") */}
      {selectedExam && selectedExam.details && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onPointerDown={() => setSelectedExam(null)} // 🔥 1. Cierra al hacer clic en el fondo oscuro
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200"
            onPointerDown={(e) => e.stopPropagation()} // 🔥 2. Evita que se cierre si haces clic DENTRO de la tarjeta
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight pr-8">{selectedExam.title}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Desglose de Rendimiento</p>
              </div>
              <button onClick={() => setSelectedExam(null)} className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Nivel Básico (Teal/Menta) */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm font-black text-teal-600 dark:text-teal-400 uppercase tracking-wide">Nivel Básico</span>
                    <p className="text-xs text-slate-500 font-medium">⏱️ {selectedExam.details.basico.avgTimeStr} / preg</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {selectedExam.details.basico.correct}/{selectedExam.details.basico.total}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${(selectedExam.details.basico.correct / selectedExam.details.basico.total) * 100}%` }} />
                </div>
              </div>
              {/* Nivel Intermedio (Índigo) */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Nivel Intermedio</span>
                    <p className="text-xs text-slate-500 font-medium">⏱️ {selectedExam.details.intermedio.avgTimeStr} / preg</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {selectedExam.details.intermedio.correct}/{selectedExam.details.intermedio.total}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${(selectedExam.details.intermedio.correct / selectedExam.details.intermedio.total) * 100}%` }} />
                </div>
              </div>
              {/* Nivel Avanzado (Coral/Naranja) */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm font-black text-orange-500 dark:text-orange-400 uppercase tracking-wide">Nivel Avanzado</span>
                    <p className="text-xs text-slate-500 font-medium">⏱️ {selectedExam.details.avanzado.avgTimeStr} / preg</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {selectedExam.details.avanzado.correct}/{selectedExam.details.avanzado.total}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full transition-all" style={{ width: `${(selectedExam.details.avanzado.correct / selectedExam.details.avanzado.total) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-100 dark:border-slate-700 text-center">
               <p className="text-xs text-slate-500 font-medium">
                 Tiempo Total de Misión: <span className="font-bold text-slate-700 dark:text-slate-300">{selectedExam.timeSpentStr}</span>
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}