import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Clock, ShieldAlert, CheckCircle, Award } from "lucide-react";
import api from "../../services/api";

export default function ExamPrestart() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Intentamos cargar el examen y ver si el alumno ya tiene un resultado guardado
        const [examRes, resultRes] = await Promise.all([
          api.get(`/exams/${id}`),
          api.get(`/exams/${id}/results`).catch(() => ({ data: null })) 
        ]);
        
        setExam(examRes.data);
        
        // Si resultRes tiene datos, significa que ya terminó la prueba antes
        if (resultRes.data && resultRes.data.score !== undefined) {
          setAlreadyDone(true);
        }
      } catch (err) {
        console.error("Error cargando prestart:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black text-indigo-600 animate-pulse">PREPARANDO TU PRUEBA...</div>;
  if (!exam) return <div className="p-10 text-center text-slate-500">No se encontró el examen solicitado.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-4 md:mt-12 p-5 md:p-8 bg-white rounded-3xl md:rounded-[2rem] shadow-xl border border-slate-100">
      <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 md:mb-2">{exam.title}</h1>
      <p className="text-slate-400 mb-4 md:mb-8 font-medium uppercase text-[10px] md:text-xs tracking-widest">{exam.grade} • {exam.difficulty}</p>

      <div className="space-y-3 md:space-y-6">
        {/* Card de Duración */}
        <div className="flex gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <Clock className="text-blue-600 shrink-0" />
          <div>
            <p className="font-bold text-blue-900">Duración</p>
            <p className="text-blue-700 text-sm">
              {exam.durationMinutes ? `${exam.durationMinutes} minutos para todo el examen.` : "Sin tiempo límite (Modo Práctica)."}
            </p>
          </div>
        </div>

        {/* Card de Navegación */}
        <div className="flex gap-4 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
          <ShieldAlert className="text-indigo-600 shrink-0" />
          <div>
            <p className="font-bold text-indigo-900">Reglas de navegación</p>
            <p className="text-indigo-700 text-sm">Puedes revisar tus respuestas antes de entregar. Una vez finalizado, no hay marcha atrás.</p>
          </div>
        </div>

        {/* Card de Advertencia de Entrega */}
        <div className="flex gap-4 p-5 bg-red-50 rounded-2xl border border-red-100">
          <CheckCircle className="text-red-600 shrink-0" />
          <div>
            <p className="font-bold text-red-900">Un solo intento</p>
            <p className="text-red-700 text-sm">Al hacer clic en <b>Finalizar</b> dentro del examen, tu nota se guardará y el acceso se cerrará.</p>
          </div>
        </div>
      </div>

      {alreadyDone ? (
        <div className="mt-10 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-[2rem] text-center shadow-inner">
          <Award className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <p className="text-emerald-700 font-black text-xl mb-4">¡Ya completaste esta prueba!</p>
          <button
            onClick={() => navigate(`/student/results/${id}`)}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-lg"
          >
            VER MIS RESULTADOS
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate(`/student/exam/${id}`)}
          className="mt-10 w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
        >
          <Play size={24} fill="white" /> ¡EMPEZAR AHORA!
        </button>
      )}
    </div>
  );
}