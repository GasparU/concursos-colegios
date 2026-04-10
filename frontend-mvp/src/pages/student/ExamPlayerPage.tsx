import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MafsGeometryRenderer } from "../../components/canvas/renderers/MafsGeometryRenderer";
import Latex from "react-latex-next";
import api from "../../services/api";
import Timer from "./Timer";
import { ChevronRight, ChevronLeft, Send, Plus, Minus } from "lucide-react";
import { useTimerStore } from "../../hooks/useTimerStore";

const cardColors: Record<string, string> = {
  emerald: "border-l-[12px] border-emerald-400 bg-emerald-50/20",
  amber: "border-l-[12px] border-amber-400 bg-amber-50/20",
  rose: "border-l-[12px] border-rose-300 bg-rose-50/20",
  violet: "border-l-[12px] border-violet-400 bg-violet-50/20",
  slate: "border-l-[12px] border-slate-200 bg-white dark:bg-slate-900",
};

const badgeColors: Record<string, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-400",
  violet: "bg-violet-500",
  slate: "bg-indigo-600",
};

const levelTextColors: Record<string, string> = {
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  rose: "text-rose-500",
  violet: "text-violet-600",
  slate: "text-indigo-600",
};

const levelNames: Record<string, string> = {
  emerald: "Básico",
  amber: "Intermedio",
  rose: "Avanzado",
  violet: "Experto",
  slate: "Estándar",
};

export default function ExamPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontSize, setFontSize] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [timings, setTimings] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState(Date.now());
  const { initTimer, startQuestion, totalUsed, totalIdeal, stopTimer } =
    useTimerStore();

  useEffect(() => {
    if (exam && exam.questions) {
      // Calculamos el tiempo ideal total (Suma de 2, 3 y 4 min)
      const ideal = exam.questions.reduce((acc: number, q: any) => {
        const t =
          q.difficulty === "basico"
            ? 120
            : q.difficulty === "intermedio"
              ? 180
              : 240;
        return acc + t;
      }, 0);

      initTimer(ideal);

      // Iniciamos el tiempo de la PRIMERA pregunta
      const firstTime = exam.questions[0].difficulty === "basico" ? 120 : 180; // etc
      startQuestion(firstTime);
    }
  }, [exam]);

  useEffect(() => {
    const saved = localStorage.getItem(`progress_${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 🔥 Recuperamos respuestas y el índice exacto de la pregunta
        if (parsed.answers) {
          setAnswers(parsed.answers);
          if (parsed.currentIndex !== undefined)
            setCurrentIndex(parsed.currentIndex);
        } else {
          setAnswers(parsed);
        }
      } catch (e) {
        console.error("Error al recuperar progreso", e);
      }
    }
  }, [id]);

  useEffect(() => {
    // 🔥 Guardamos tanto las respuestas como el índice actual
    const progressData = { answers, currentIndex };
    if (Object.keys(answers).length > 0 || currentIndex > 0) {
      localStorage.setItem(`progress_${id}`, JSON.stringify(progressData));
    }
  }, [answers, currentIndex, id]);

  useEffect(() => {
    api.get(`/exams/${id}/check`).then((res) => {
      if (res.data.finished) navigate(`/student/results/${id}`);
    });
    api.get(`/exams/${id}`).then((res) => setExam(res.data));
  }, [id, navigate]);

  if (!exam || !exam.questions || exam.questions.length === 0) return null;

  const question = exam.questions[currentIndex];
  // 🔥 DESANIDADO: Si la data viene como { visualData: { theme... } }, la sacamos de su caja
  const visual = (() => {
  // 1. Tomamos la data venga de donde venga
  let raw = question.visualData || question.visual_data;
  if (!raw) return null;

  try {
    // 2. Parseamos si es string
    let data = typeof raw === "string" ? JSON.parse(raw) : raw;

    // 3. CASO 1: Viene anidado en data.visualData.visualData (Error común de doble envoltura)
    if (data.visualData?.visualData) {
        return {
            ...data.visualData.visualData,
            difficultyColor: data.difficultyColor || "slate"
        };
    }

    // 4. CASO 2: Viene anidado en data.visualData
    if (data.visualData && (data.visualData.theme || data.visualData.type)) {
      return {
        ...data.visualData,
        difficultyColor: data.difficultyColor || "slate",
      };
    }

    // 5. CASO 3: Viene directo
    return data;
  } catch (e) {
    console.error("Error parseando data visual:", e);
    return null;
  }
})();
  const diffColor = visual?.difficultyColor || "slate";

  // 🔥 FUNCIÓN MAESTRA PARA GUARDAR TIEMPO (Acumulativa y sin 0s)
  const updateTiming = () => {
    const now = Date.now();
    // Usamos Math.ceil para que 0.1s cuente como 1s (mínimo garantizado)
    const spent = Math.max(1, Math.ceil((now - startTime) / 1000));

    setTimings((prev) => ({
      ...prev,
      // IMPORTANTE: Sumamos el tiempo nuevo al que ya tenía esa pregunta
      [question.id]: (prev[question.id] || 0) + spent,
    }));
    setStartTime(now);
    return spent;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    // 🔥 Detenemos el motor del Timer
    stopTimer();

    const now = Date.now();
    const lastSpent = Math.max(1, Math.ceil((now - startTime) / 1000));
    const finalTimings = {
      ...timings,
      [question.id]: (timings[question.id] || 0) + lastSpent,
    };

    try {
      // 🔥 Añadimos timeUsedSeconds e idealTimeSeconds para la DB
      await api.post(`/exams/${id}/submit`, {
        answers,
        timings: finalTimings,
        timeUsedSeconds: totalUsed,
        idealTimeSeconds: totalIdeal,
      });

      localStorage.removeItem(`progress_${id}`);
      navigate(`/student/results/${id}?show=summary`);
    } catch (error) {
      alert("Error al enviar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <header className="h-12 md:h-14 border-b dark:border-slate-800 flex items-center justify-between px-1.5 md:px-6 bg-white dark:bg-slate-900 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-1 md:gap-3">
          <div
            className={`text-white px-2 md:px-3 py-0.5 md:py-1 rounded-lg font-black text-[9px] md:text-sm shadow-sm whitespace-nowrap ${badgeColors[diffColor]}`}
          >
            {currentIndex + 1} / {exam.questions.length}
          </div>
          <span className="text-[10px] md:text-sm font-bold text-slate-500 truncate max-w-[80px] md:max-w-[200px]">
            {exam.title}
          </span>
        </div>

        <div className="flex items-center gap-1 md:gap-4 scale-90 md:scale-100 origin-right whitespace-nowrap">
          <Timer />
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 shadow-inner">
            <button
              onClick={() => setFontSize((s) => Math.max(16, s - 2))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <Minus size={16} className="text-slate-500" />
            </button>
            <span className="px-1.5 font-black text-slate-400 text-[9px] uppercase">
              Aa
            </span>
            <button
              onClick={() => setFontSize((s) => Math.min(36, s + 2))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <Plus size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-1.5 pb-16 md:p-4 flex justify-center scrollbar-thin">
        <div className="w-full max-w-5xl flex flex-col gap-1.5 md:gap-4">
          <section
            className={`p-3 md:p-5 flex flex-col gap-2 rounded-xl md:rounded-[1.5rem] shadow-sm transition-all duration-500 ${cardColors[diffColor]}`}
          >
            <div className="hidden md:flex flex-col border-b border-black/5 pb-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                Misión de {exam.grade}
              </span>
              <span
                className={`text-[11px] font-black uppercase ${levelTextColors[diffColor]}`}
              >
                Nivel {levelNames[diffColor]}
              </span>
            </div>

            <div
              className="leading-snug text-slate-800 dark:text-slate-100 font-bold mb-2 md:mb-0"
              style={{ fontSize: `${fontSize}px` }}
            >
              <Latex>{question.questionMarkdown}</Latex>
            </div>
          </section>

          {visual && (visual.theme || visual.type) && (
            <div className="bg-white dark:bg-slate-900 rounded-lg lg:rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 p-1 lg:p-1.5 my-0 flex justify-center shadow-sm shrink-0">
              <div className="w-full max-w-sm md:max-w-2xl lg:max-w-5xl min-h-[450px] md:min-h-[500px] aspect-square md:aspect-video bg-slate-50 dark:bg-slate-950 rounded-lg lg:rounded-2xl overflow-visible p-2 md:p-4">
                <MafsGeometryRenderer visualData={visual} />
              </div>
            </div>
          )}

          {/* 🔥 CONTENEDOR ULTRA-COMPACTO: De columna a fila de 5 */}
          <div className="grid grid-cols-5 gap-2 mt-2 md:mt-2 pb-8 md:pb-2">
            {Object.entries(question.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setAnswers({ ...answers, [question.id]: key })}
                className={`py-2 px-1 rounded-xl border-2 transition-all active:scale-[0.95] flex flex-col items-center justify-center gap-1 group relative ${
                  answers[question.id] === key
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md translate-y-[-2px]"
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-300 shadow-sm"
                }`}
              >
                {/* Letra A, B, C... (Más pequeña) */}
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full font-black text-[10px] transition-colors ${
                    answers[question.id] === key 
                      ? "bg-white/20 text-white" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {key}
                </div>

                {/* Valor matemático (Centrado) */}
                <div className="font-black text-sm md:text-lg">
                  <Latex>{String(value)}</Latex>
                </div>

                {/* Punto indicador inferior */}
                {answers[question.id] === key && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="h-12 md:h-16 bg-white dark:bg-slate-900 md:border-t dark:border-slate-800 md:border-slate-100 px-4 md:px-8 flex items-center justify-between shrink-0 z-10 rounded-none shadow-none">
        <button
          onClick={() => {
            updateTiming(); // Tu lógica de historial

            // 🔥 Lógica de Deuda para el botón Anterior
            const prevQ = exam.questions[currentIndex - 1];
            if (prevQ) {
              const prevTime =
                prevQ.difficulty === "basico"
                  ? 120
                  : prevQ.difficulty === "intermedio"
                    ? 180
                    : 240;
              startQuestion(prevTime);
            }

            setCurrentIndex((i) => Math.max(0, i - 1));
          }}
          disabled={currentIndex === 0}
          className="text-slate-400 font-black flex items-center gap-1.5 scale-90 md:scale-100 md:gap-2 disabled:opacity-0 hover:text-slate-600 transition-colors uppercase text-[9px] md:text-[10px] tracking-widest"
        >
          <ChevronLeft size={14} /> Anterior
        </button>

        <div className="flex gap-1 md:gap-1.5 scale-90 md:scale-100">
          {exam.questions.map((_: any, i: number) => (
            <div
              key={i}
              className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "bg-indigo-500 w-5 md:w-6" : "bg-slate-200 dark:bg-slate-800 w-1 md:w-1.5"}`}
            />
          ))}
        </div>

        {currentIndex === exam.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-emerald-500 text-white px-3 py-1.5 md:px-8 md:py-3 rounded-lg md:rounded-xl font-black flex items-center gap-2 scale-90 md:scale-100 hover:bg-emerald-600 transition-all shadow-md uppercase tracking-widest text-[9px] md:text-[10px]"
          >
            Terminar <Send size={14} />
          </button>
        ) : (
          <button
            onClick={() => {
              updateTiming(); // Tu lógica de historial

              // 🔥 Lógica de Deuda para el botón Siguiente
              const nextQ = exam.questions[currentIndex + 1];
              if (nextQ) {
                // 1. Detectamos por color (Mat) o por string directo (Letras)
                const color = nextQ.visualData?.difficultyColor;
                const diffString =
                  nextQ.difficulty?.toLowerCase() ||
                  nextQ.dificultad_generada?.toLowerCase();

                // 2. Mapeo inteligente de tiempo
                let nextTime = 240; // Default: Avanzado (4 min)

                if (color === "emerald" || diffString === "basico") {
                  nextTime = 120; // 2 min
                } else if (color === "amber" || diffString === "intermedio") {
                  nextTime = 180; // 3 min
                }

                startQuestion(nextTime);
              }

              setCurrentIndex((i) => i + 1);
            }}
            className="bg-slate-900 dark:bg-indigo-500 text-white px-3 py-1.5 md:px-8 md:py-3 rounded-lg md:rounded-xl font-black flex items-center gap-2 scale-90 md:scale-100 hover:opacity-90 transition-all uppercase tracking-widest text-[9px] md:text-[10px]"
          >
            Siguiente <ChevronRight size={14} />
          </button>
        )}
      </footer>
    </div>
  );
}
