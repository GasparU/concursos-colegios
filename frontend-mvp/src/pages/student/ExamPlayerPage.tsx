import { useExamStore } from '../../store/examStore';
import { MafsGeometryRenderer } from '../../components/canvas/renderers/MafsGeometryRenderer';
import ReactMarkdown from 'react-markdown';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export const ExamPlayerPage = () => {
  const problem = useExamStore((state) => state.currentProblem);

  if (!problem) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <h2 className="text-xl font-bold mb-2">No hay examen activo</h2>
            <p>Pídele a papá que genere uno desde el Panel de Profesor.</p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Barra de estado del examen */}
      <div className="h-12 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50">
        <span className="font-bold text-slate-700">Modo Examen</span>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">
            {problem.difficulty}
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 1. Lado Izquierdo: El Gráfico (Prioridad Visual para niños) */}
        <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 border-r border-slate-200">
           <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <MafsGeometryRenderer visualData={problem.visual_data} />
           </div>
        </div>

        {/* 2. Lado Derecho: La Pregunta y Respuesta */}
        <div className="w-[400px] p-8 flex flex-col overflow-y-auto bg-white">
            <div className="prose prose-slate max-w-none mb-8">
                <ReactMarkdown components={{ p: ({children}) => <p className="text-lg leading-relaxed mb-4"><Latex>{String(children)}</Latex></p> }}>
                    {problem.question_markdown}
                </ReactMarkdown>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-2">Tu Respuesta:</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none mb-4" placeholder="Escribe aquí..." />
                <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-sm">
                    Enviar Respuesta
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};