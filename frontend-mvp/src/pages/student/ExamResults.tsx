import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, XCircle, Clock, Tag } from "lucide-react";
import api from "../../services/api"; // Importación corregida
import Latex from "react-latex-next";

// Definimos la interfaz para evitar el error de 'any'
interface QuestionResult {
  id: string;
  questionMarkdown: string;
  correctAnswer: string;
  solutionMarkdown: string;
  subtipo?: string; // Tema
  timeSpent?: number; // Tiempo guardado en la DB
}

interface Result {
  score: number;
  total: number;
  answers: Record<string, string>;
  timings: Record<string, number>; // 🔥 Nuevo campo de tiempos
  questions: QuestionResult[];
}

export default function ResultsPage() {
  const { id } = useParams();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    // Tipamos la respuesta de Axios para que 'res' no sea 'any'
    api.get<Result>(`/exams/${id}/results`).then((res) => {
      setResult(res.data);
    });
  }, [id]);

  if (!result) return <div className="p-10 text-center">Analizando resultados...</div>;

  const score20 = ((result.score / result.total) * 20).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-slate-900 text-white rounded-3xl p-10 mb-10 shadow-2xl flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black mb-2">¡Buen trabajo!</h1>
          <p className="opacity-70 text-lg">Has completado la evaluación de {result.total} preguntas.</p>
        </div>
        <div className="text-right">
          <span className="text-6xl font-black text-blue-400">{score20}</span>
          <span className="block text-sm opacity-50 font-bold">Puntaje Vigesimal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {result.questions.map((q, idx) => {
          const userAns = result.answers[q.id];
          const isCorrect = userAns === q.correctAnswer;
          const time = result.timings?.[q.id] || 0; // Sacamos el tiempo del objeto timings

          return (
            <div key={q.id} className="bg-white rounded-3xl p-6 border-2 border-slate-100 flex gap-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {isCorrect ? <CheckCircle /> : <XCircle />}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-slate-400 text-sm uppercase">Pregunta {idx + 1}</span>
                  <div className="flex gap-2">
                     {/* Métrica de tiempo por pregunta */}
                    <span className="flex items-center text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-full">
                      <Clock size={12} className="mr-1"/> {Math.floor(time / 60)}m {time % 60}s
                    </span>
                    {/* Tema de la pregunta */}
                    <span className="flex items-center text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase">
                      <Tag size={12} className="mr-1"/> {q.subtipo || "General"}
                    </span>
                  </div>
                </div>

                <div className="text-lg mb-4">
                  <Latex>{q.questionMarkdown}</Latex>
                </div>

                <div className="flex gap-4 text-sm font-bold">
                  <div className={`px-4 py-2 rounded-lg ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    Tu respuesta: {userAns || "Vacia"}
                  </div>
                  {!isCorrect && (
                    <div className="px-4 py-2 rounded-lg bg-green-50 text-green-700">
                      Correcta: {q.correctAnswer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}