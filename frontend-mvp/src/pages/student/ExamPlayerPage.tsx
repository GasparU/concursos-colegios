import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExamStore } from "../../store/examStore";
import { MafsGeometryRenderer } from "../../components/canvas/renderers/MafsGeometryRenderer";
import ReactMarkdown from "react-markdown";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import api from "../../services/api";
import Timer from "./Timer";

interface Question {
  id: string;
  questionMarkdown: string;
  options: Record<string, string>; // 👈 importante: options es objeto con valores string
}

interface ExamData {
  id: string;
  title: string;
  type: "FECHA_LIMITE" | "DURACION_FIJA";
  deadline?: string;
  durationMinutes?: number;
  questions: Question[];
  difficulty?: string;
  startTime?: string;
}

export default function ExamPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const problem = useExamStore((state) => state.currentProblem);

  useEffect(() => {
  api
    .get<ExamData>(`/exams/${id}`) // 👈 tipado genérico
    .then((res) => setExam(res.data))
    .catch((err) => console.error("Error cargando examen:", err));
}, [id]);

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await api.post(`/exams/${id}/submit`, { answers }); // 👈 antes era "/student/exams/${id}/submit"
      navigate(`/student/results/${id}`);
    } catch (error) {
      alert("Error al enviar el examen");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeEnd = () => {
    handleSubmit();
  };

  if (!exam) return <div className="p-4">Cargando examen...</div>;

  const question = exam.questions?.[currentIndex];
  if (!question) return <div>No hay preguntas</div>;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-12 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50">
        <span className="font-bold text-slate-700">Modo Examen</span>
        <Timer
          type={exam.type}
          deadline={exam.deadline}
          durationMinutes={exam.durationMinutes}
          startTime={exam.startTime}
          onEnd={handleTimeEnd}
        />
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">
          {exam.difficulty || "Intermedio"}
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 border-r border-slate-200">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <MafsGeometryRenderer visualData={problem?.visual_data} />
          </div>
        </div>

        <div className="w-[400px] p-8 flex flex-col overflow-y-auto bg-white">
          <div className="prose prose-slate max-w-none mb-8">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-lg leading-relaxed mb-4">
                    <Latex>{String(children)}</Latex>
                  </p>
                ),
              }}
            >
              {question.questionMarkdown}
            </ReactMarkdown>
          </div>

          <div className="space-y-3 mb-6">
            {Object.entries(question.options).map(([key, value]) => (
              <label
                key={key}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  answers[question.id] === key
                    ? "bg-blue-50 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={key}
                  checked={answers[question.id] === key}
                  onChange={() => handleAnswer(question.id, key)}
                  className="mr-3"
                />
                <span className="font-medium mr-2">{key}:</span>
                <span>{value as string}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-auto pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Anterior
            </button>
            {currentIndex === exam.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Finalizar"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Siguiente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
