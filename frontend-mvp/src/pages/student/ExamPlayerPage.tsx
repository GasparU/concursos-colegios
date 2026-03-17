import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MafsGeometryRenderer } from "../../components/canvas/renderers/MafsGeometryRenderer";
import Latex from "react-latex-next";
import api from "../../services/api";
import Timer from "./Timer";
import { ChevronRight, ChevronLeft, Send, Plus, Minus } from "lucide-react";

export default function ExamPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontSize, setFontSize] = useState(22); // Fuente grande para niños
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/exams/${id}/check`).then((res) => {
      if (res.data.finished) {
        // Si ya terminó, la mandamos a los resultados de una
        navigate(`/student/results/${id}`);
      }
    });

    // 2. Cargar el examen normal
    api.get(`/exams/${id}`).then((res) => setExam(res.data));
  }, [id, navigate]);

  if (!exam) return null;
  const question = exam.questions[currentIndex];

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await api.post(`/exams/${id}/submit`, { answers });
      // 🔥 Añadimos ?show=summary para que no se vea el repaso de inmediato
      navigate(`/student/results/${id}?show=summary`);
    } catch (error) {
      alert("Error al enviar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* HEADER AMIGABLE Y DINÁMICO */}
      <header className="h-16 border-b dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl px-4 items-center gap-3 border border-indigo-100 dark:border-indigo-800">
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
              {exam.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 shadow-inner">
            <button
              onClick={() => setFontSize((s) => Math.max(16, s - 2))}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              <Minus size={20} className="text-slate-500" />
            </button>
            <span className="px-3 font-black text-slate-400 text-sm">Aa</span>
            <button
              onClick={() => setFontSize((s) => Math.min(36, s + 2))}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              <Plus size={20} className="text-slate-500" />
            </button>
          </div>
          <Timer
            type={exam.type}
            durationMinutes={exam.durationMinutes}
            onEnd={handleSubmit}
          />
        </div>
      </header>

      {/* ÁREA DE PREGUNTAS: Una sola columna centrada y limpia */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {/* Pregunta */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-200 dark:shadow-none">
                {currentIndex + 1}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Pregunta de {exam.grade}
              </span>
            </div>

            <div
              className="leading-snug text-slate-800 dark:text-slate-100 font-semibold"
              style={{ fontSize: `${fontSize}px` }}
            >
              <Latex>{question.questionMarkdown}</Latex>
            </div>
          </section>

          {/* Imagen (Si no hay, desaparece el espacio) */}
          {question.visualData &&
            Object.keys(question.visualData).length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 p-6 flex justify-center shadow-sm">
                <div className="w-full max-w-md aspect-square bg-slate-50 dark:bg-slate-950 rounded-3xl overflow-hidden border border-dashed border-slate-200 dark:border-slate-700">
                  <MafsGeometryRenderer
                    type={question.visualData.theme || question.visualData.type}
                    params={question.visualData.params}
                  />
                </div>
              </div>
            )}

          {/* Alternativas: Botones grandes y fáciles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
            {Object.entries(question.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setAnswers({ ...answers, [question.id]: key })}
                className={`p-6 rounded-[1.5rem] border-2 text-left transition-all active:scale-95 flex items-center gap-4 ${
                  answers[question.id] === key
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none"
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-300"
                }`}
              >
                <span
                  className={`text-2xl font-black ${answers[question.id] === key ? "text-indigo-200" : "text-slate-300"}`}
                >
                  {key}
                </span>
                <span className="font-bold text-lg leading-tight">
                  <Latex>{String(value)}</Latex>
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER NAVEGACIÓN */}
      <footer className="h-20 bg-white dark:bg-slate-900 border-t dark:border-slate-800 px-8 flex items-center justify-between shrink-0">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="text-slate-400 font-black flex items-center gap-2 disabled:opacity-0 hover:text-slate-600"
        >
          <ChevronLeft /> ANTERIOR
        </button>

        <div className="flex gap-2">
          {exam.questions.map((_: any, i: number) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${i === currentIndex ? "bg-indigo-500 w-10" : "bg-slate-200 dark:bg-slate-700 w-2"}`}
            />
          ))}
        </div>

        {currentIndex === exam.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
          >
            TERMINAR <Send size={20} />
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="bg-slate-900 dark:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:opacity-90 transition-all"
          >
            SIGUIENTE <ChevronRight />
          </button>
        )}
      </footer>
    </div>
  );
}
