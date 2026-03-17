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
  
  // 🔥 TAMAÑO BASE MÁS GRANDE PARA PC
  const [fontSize, setFontSize] = useState(18);
  
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

  const getVisualParams = (visualDataRaw: any) => {
    if (!visualDataRaw) return null;
    let data = visualDataRaw;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { return null; }
    }
    if (data?.params && Object.keys(data.params).length > 0) return data;
    if (data?.visualData?.params && Object.keys(data.visualData.params).length > 0) return data.visualData;
    if (Object.keys(data).length > 0 && !data.params) return { type: data.type || 'segmentos', params: data };
    return null;
  };

  const safeAnswers = result.answers || {};

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors flex flex-col w-full m-0 p-0 overflow-x-hidden relative">
      
      {/* 🔥 CONTROLES STICKY GIGANTES PARA PC (Sin botón de salir, pegado al techo) */}
      <div className="sticky top-0 z-50 w-full flex justify-end p-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-md gap-2">
          <button 
            onClick={() => setFontSize(s => Math.max(14, s-2))} 
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Minus size={24} className="text-slate-600 dark:text-slate-300"/>
          </button>
          <div className="flex items-center gap-2 mx-2 text-slate-600 dark:text-slate-300 font-black">
            <Type size={24} />
            <span className="text-xl w-8 text-center">{fontSize}</span>
          </div>
          <button 
            onClick={() => setFontSize(s => Math.min(36, s+2))} 
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Plus size={24} className="text-slate-600 dark:text-slate-300"/>
          </button>
        </div>
      </div>

      <div className={`flex-1 w-full overflow-y-auto m-0 p-0 ${isSummaryOnly ? 'flex items-center justify-center' : ''}`}>
        
        {/* BANNER RESULTADOS */}
        <div className={`bg-indigo-600 dark:bg-indigo-800 p-6 text-white w-full flex items-center justify-between border-b-4 border-indigo-700 ${isSummaryOnly ? 'flex-col text-center gap-6 h-full justify-center' : ''}`}>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">¡Entrenamiento Finalizado!</h2>
          </div>
          <div className="flex gap-6 items-center bg-black/20 px-6 py-3 rounded-xl border border-white/10 shadow-inner">
            <div className="text-center">
              <span className="block text-4xl font-black leading-none">{grade}</span>
              <span className="text-xs uppercase font-bold opacity-70 tracking-widest">Nota</span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <span className="block text-4xl font-black leading-none">{result.score}/{result.total}</span>
              <span className="text-xs uppercase font-bold opacity-70 tracking-widest">Aciertos</span>
            </div>
          </div>
        </div>

        {!isSummaryOnly && (
          <div className="w-full flex flex-col m-0 p-0">
            {result.questions.map((q: any, idx: number) => {
              
              const userAnsKey = safeAnswers[q.id] || "";
              const isCorrect = userAnsKey.toUpperCase() === String(q.correctAnswer).toUpperCase();
              const options = q.options || {};
              const visual = getVisualParams(q.visualData);

              return (
                <div key={q.id} className={`w-full border-b dark:border-slate-800 p-6 md:p-8 bg-white dark:bg-slate-900 ${!isCorrect ? "border-l-8 border-l-red-500" : "border-l-8 border-l-emerald-500"}`}>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white shadow-sm ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>{idx + 1}</span>
                    <span className={`text-sm font-black uppercase tracking-widest ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isCorrect ? "Correcto" : "Fallaste"}
                    </span>
                  </div>

                  {/* PREGUNTA QUE RESPONDE AL TAMAÑO DE FUENTE */}
                  <div className="text-slate-900 dark:text-slate-100 font-bold leading-relaxed mb-6 transition-all duration-200" style={{ fontSize: `${fontSize}px` }}>
                    <Latex>{q.questionMarkdown}</Latex>
                  </div>

                  {/* 🔥 EL DIBUJO ESTÁ ARREGLADO AQUÍ: SE MANDA COMO visualData */}
                  {visual && (
                    <div className="w-full max-w-5xl bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 my-6 overflow-hidden shadow-sm">
                      <div className="w-full aspect-[21/6]">
                         <MafsGeometryRenderer visualData={visual} />
                      </div>
                    </div>
                  )}

                  {/* ALTERNATIVAS */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 w-full">
                    {['A', 'B', 'C', 'D', 'E'].map((letter) => {
                      const val = options[letter] ?? options[letter.toLowerCase()];
                      if (val === undefined || val === null) return null; 

                      const isUserChoice = userAnsKey.toUpperCase() === letter;
                      const isCorrectChoice = String(q.correctAnswer).toUpperCase() === letter;

                      return (
                        <div key={letter} className={`p-4 rounded-xl border-2 flex flex-col transition-all ${
                          isUserChoice 
                            ? (isCorrect ? 'bg-emerald-50 border-emerald-400 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'bg-red-50 border-red-400 dark:bg-red-900/30 text-red-800 dark:text-red-300 shadow-sm') 
                            : (isCorrectChoice ? 'bg-emerald-50 border-emerald-400 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400')
                        }`}>
                          <span className="font-black opacity-40 mb-1 text-sm">{letter})</span>
                          <span className="font-bold" style={{ fontSize: `${Math.max(14, fontSize - 4)}px` }}><Latex>{String(val)}</Latex></span>
                        </div>
                      );
                    })}
                  </div>

                  {/* SOLUCIÓN DE LA IA QUE RESPONDE AL TAMAÑO DE FUENTE */}
                  {!isCorrect && (
                    <div className="mt-6 p-6 bg-indigo-50/80 dark:bg-indigo-900/10 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/30 shadow-inner">
                      <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                        <Sparkles size={16} /> Profe Atiana 🤖
                      </div>
                      {/* 🔥 IA AUMENTA DE TAMAÑO */}
                      <div className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed transition-all duration-200" style={{ fontSize: `${fontSize}px` }}>
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