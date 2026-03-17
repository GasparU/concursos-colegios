import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Minus, Plus, Type, Sparkles, Loader2, Bot } from "lucide-react";
import { MafsGeometryRenderer } from "../../components/canvas/renderers/MafsGeometryRenderer";
import api from "../../services/api";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

export default function ResultsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  
  const [fontSize, setFontSize] = useState(16);
  const [loading, setLoading] = useState(true);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const isSummaryOnly = searchParams.get("show") === "summary";

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const fetchResults = async () => {
      try {
        const res = await api.get(`/exams/${id}/results`);
        if (res.data.processing) {
          setIsProcessingAI(true);
          setLoading(false);
        } else {
          setIsProcessingAI(false);
          setResult(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchResults();

    if (isProcessingAI) {
      intervalId = setInterval(() => fetchResults(), 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, isProcessingAI]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center dark:bg-slate-950 dark:text-white font-black text-xl tracking-widest uppercase">Cargando...</div>;
  
  if (isProcessingAI) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-full border border-indigo-100 dark:border-indigo-900/50 shadow-xl relative animate-bounce">
          <Bot size={64} className="text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">
          Analizando tus respuestas
        </h2>
        <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto flex items-center justify-center gap-2">
          <Loader2 size={20} className="animate-spin text-indigo-500" />
          El Profe IA está preparando tus trucos...
        </p>
      </div>
    </div>
  );

  if (!result || !result.questions) return <div className="p-10 w-full text-center font-bold">No se encontraron resultados.</div>;

  const grade = ((result.score / result.total) * 20).toFixed(1);

  const getVisualParams = (visualDataRaw: any, qId: string) => {
    if (!visualDataRaw) return null;
    try {
      let data = typeof visualDataRaw === 'string' ? JSON.parse(visualDataRaw) : visualDataRaw;
      if (data.visualData) data = data.visualData;
      if (!data || Object.keys(data).length === 0) return null;
      return data;
    } catch (e) {
      return null;
    }
  };

  const safeAnswers = result.answers || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex flex-col w-full m-0 p-0 overflow-x-hidden relative">
      
      {/* 🔥 BANNER PRINCIPAL STICKY CON CONTROLES INTEGRADOS Y ULTRA COMPACTO */}
      <div className="sticky top-0 z-[100] bg-indigo-600 dark:bg-indigo-800 py-3 px-4 md:px-6 text-white w-full flex flex-wrap md:flex-nowrap items-center justify-between border-b-4 border-indigo-700 shadow-md backdrop-blur-md">
        
        {/* Lado Izquierdo */}
        <div className="flex items-center gap-3 w-full md:w-auto mb-3 md:mb-0">
          <button onClick={() => navigate("/student/exams")} className="text-[10px] md:text-xs font-black bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors uppercase border border-white/20 shrink-0">
            Volver
          </button>
          <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter truncate">
            ¡Entrenamiento Finalizado!
          </h2>
        </div>

        {/* Lado Derecho (Controles + Notas) */}
        <div className="flex gap-3 items-center justify-between w-full md:w-auto">
          
          {/* 🔥 CONTROLES DE ZOOM EN LA MISMA LÍNEA */}
          <div className="flex items-center bg-black/20 border border-white/10 rounded-full p-0.5">
            <button onClick={() => setFontSize(s => Math.max(14, s-2))} className="p-1.5 hover:bg-white/10 rounded-full transition-colors" title="Reducir letra">
              <Minus size={16} className="text-white"/>
            </button>
            <div className="flex items-center gap-1 mx-1 text-white font-black">
              <Type size={14} />
              <span className="text-sm w-6 text-center">{fontSize}</span>
            </div>
            <button onClick={() => setFontSize(s => Math.min(40, s+2))} className="p-1.5 hover:bg-white/10 rounded-full transition-colors" title="Aumentar letra">
              <Plus size={16} className="text-white"/>
            </button>
          </div>

          <div className="flex gap-3 items-center bg-black/30 px-4 py-1.5 rounded-lg border border-white/10 shadow-inner">
            <div className="text-center flex flex-col items-center">
              <span className="block text-xl font-black leading-none">{grade}</span>
              <span className="text-[8px] uppercase font-bold opacity-70 tracking-widest mt-0.5">Nota</span>
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div className="text-center flex flex-col items-center">
              <span className="block text-xl font-black leading-none">{result.score}/{result.total}</span>
              <span className="text-[8px] uppercase font-bold opacity-70 tracking-widest mt-0.5">Aciertos</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-1 w-full m-0 p-0 ${isSummaryOnly ? 'flex items-center justify-center' : ''}`}>
        {!isSummaryOnly && (
          <div className="w-full flex flex-col m-0 p-0">
            {result.questions.map((q: any, idx: number) => {
              
              const userAnsKey = safeAnswers[q.id] || "";
              const isCorrect = userAnsKey.toUpperCase() === String(q.correctAnswer).toUpperCase();
              const options = q.options || {};
              const visual = getVisualParams(q.visualData, q.id);

              // 🔥 DETECTA SI ES SEGMENTO PARA APLASTAR EL LIENZO
              const isSegment = visual && (visual.type === 'segmentos' || visual.theme === 'segmentos');

              return (
                <div key={q.id} className={`w-full border-b dark:border-slate-800 p-5 md:p-8 bg-white dark:bg-slate-900 ${!isCorrect ? "border-l-8 border-l-red-500" : "border-l-8 border-l-emerald-500"}`}>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-sm ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>{idx + 1}</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isCorrect ? "Correcto" : "Fallaste"}
                    </span>
                  </div>

                  <div className="text-slate-900 dark:text-slate-100 font-bold leading-relaxed mb-4 transition-all duration-200" style={{ fontSize: `${fontSize}px` }}>
                    <Latex>{q.questionMarkdown}</Latex>
                  </div>

                  {/* 🔥 EL DIBUJO CON ALTURA INTELIGENTE (Segmentos = h-32 en lugar de un bloque enorme) */}
                  {visual && (
                    <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 my-4 overflow-hidden shadow-sm flex items-center justify-center">
                      <div className={`w-full flex items-center justify-center ${isSegment ? 'h-32 md:h-40' : 'aspect-[21/6]'}`}>
                         <MafsGeometryRenderer visualData={visual} />
                      </div>
                    </div>
                  )}

                  {/* 🔥 OPCIONES EN LÍNEA: A) y su respuesta en la misma fila y achatados */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3 mb-4 w-full">
                    {['A', 'B', 'C', 'D', 'E'].map((letter) => {
                      const val = options[letter] ?? options[letter.toLowerCase()];
                      if (val === undefined || val === null) return null; 

                      const isUserChoice = userAnsKey.toUpperCase() === letter;
                      const isCorrectChoice = String(q.correctAnswer).toUpperCase() === letter;

                      return (
                        <div key={letter} className={`px-3 py-2 rounded-lg border-2 flex flex-row items-center gap-3 transition-all ${
                          isUserChoice 
                            ? (isCorrect ? 'bg-emerald-50 border-emerald-400 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'bg-red-50 border-red-400 dark:bg-red-900/30 text-red-800 dark:text-red-300 shadow-sm') 
                            : (isCorrectChoice ? 'bg-emerald-50 border-emerald-400 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400')
                        }`}>
                          <span className="font-black opacity-50 text-sm shrink-0">{letter})</span>
                          <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: `${Math.max(14, fontSize - 2)}px` }}><Latex>{String(val)}</Latex></span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 🔥 EXPLICACIÓN DE IA CON SALTOS DE LÍNEA (Listas y pasos hacia abajo) */}
                  {!isCorrect && (
                    <div className="mt-4 p-5 bg-indigo-50/80 dark:bg-indigo-900/10 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/30 shadow-inner">
                      <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                        <Sparkles size={16} /> Profe Atiana 🤖
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed transition-all duration-200 whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>
                        <Latex>{q.solutionMarkdown}</Latex>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}