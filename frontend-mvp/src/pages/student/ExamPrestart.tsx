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
          api.get(`/exams/${id}/results`).catch(() => ({ data: null })),
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

  if (loading)
    return (
      <div className="p-20 text-center font-black text-indigo-600 animate-pulse">
        PREPARANDO TU PRUEBA...
      </div>
    );
  if (!exam)
    return (
      <div className="p-10 text-center text-slate-500">
        No se encontró el examen solicitado.
      </div>
    );

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-slate-50 p-2 md:p-4 overflow-hidden">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-4 md:p-5 flex flex-col max-h-[98vh] border border-slate-100 overflow-y-auto scrollbar-hide">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
          {exam.title}
        </h1>
        <p className="text-slate-400 mb-3 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">
          {exam.grade} • {exam.difficulty}
        </p>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
            <Clock className="text-blue-600 shrink-0 w-5 h-5" />
            <div className="leading-tight">
              <p className="font-bold text-xs text-blue-900 uppercase tracking-wide">
                Duración
              </p>
              <p className="text-blue-700 text-[13px]">
                {exam.durationMinutes
                  ? `${exam.durationMinutes} minutos.`
                  : "Sin tiempo límite."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <ShieldAlert className="text-indigo-600 shrink-0 w-5 h-5" />
            <div className="leading-tight">
              <p className="font-bold text-xs text-indigo-900 uppercase tracking-wide">
                Reglas
              </p>
              <p className="text-indigo-700 text-[13px]">
                Puedes revisar antes de entregar. Sin marcha atrás.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-rose-50/50 rounded-xl border border-rose-100">
            <CheckCircle className="text-rose-600 shrink-0 w-5 h-5" />
            <div className="leading-tight">
              <p className="font-bold text-xs text-rose-900 uppercase tracking-wide">
                Finalización
              </p>
              <p className="text-rose-700 text-[13px]">
                Al finalizar se guarda la nota y se cierra el acceso.
              </p>
            </div>
          </div>
        </div>

        {alreadyDone ? (
          <div className="mt-10 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-[2rem] text-center shadow-inner">
            <Award className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <p className="text-emerald-700 font-black text-xl mb-4">
              ¡Ya completaste esta prueba!
            </p>
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
            className="mt-5 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
          >
            <Play size={20} fill="white" /> ¡EMPEZAR AHORA!
          </button>
        )}
      </div>
    </div>
  );
}
