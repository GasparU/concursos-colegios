import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import api from "../../services/api";

interface Result {
  id: string;
  score: number;
  total: number;
  answers: Record<string, string>;
  questions: Array<{
    id: string;
    questionMarkdown: string;
    options: Record<string, string>;
    correctAnswer: string;
    solutionMarkdown: string;
  }>;
}

export default function ResultsPage() {
  const { id } = useParams();
  const [result, setResult] = useState<Result | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api
      .get(`/exams/${id}/results`) // 👈 antes era "/student/exams/${id}/results"
      .then((res) => setResult(res.data))
      .catch((err) => console.error("Error cargando resultados:", err));
  }, [id]);

  if (!result) return <div className="p-4">Cargando resultados...</div>;

  const toggleQuestion = (qId: string) => {
    setExpanded((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Resultados</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-lg">
          Calificación:{" "}
          <span className="font-bold">
            {result.score} / {result.total}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          {((result.score / result.total) * 100).toFixed(1)}% de aciertos
        </p>
      </div>

      <div className="space-y-4">
        {result.questions.map((q, idx) => {
          const userAnswer = result.answers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;
          const isExpanded = expanded[q.id];

          return (
            <div
              key={q.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div
                className={`p-4 cursor-pointer flex items-start justify-between ${
                  isCorrect ? "bg-green-50" : "bg-red-50"
                }`}
                onClick={() => toggleQuestion(q.id)}
              >
                <div className="flex items-start flex-1">
                  {isCorrect ? (
                    <CheckCircle
                      className="text-green-600 mr-3 flex-shrink-0"
                      size={20}
                    />
                  ) : (
                    <XCircle
                      className="text-red-600 mr-3 flex-shrink-0"
                      size={20}
                    />
                  )}
                  <div>
                    <p className="font-medium">Pregunta {idx + 1}</p>
                    <p className="text-sm mt-1">
                      Tu respuesta: {userAnswer || "No respondida"}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-700">
                        Correcta: {q.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
              {isExpanded && (
                <div className="p-4 border-t">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: q.solutionMarkdown }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
