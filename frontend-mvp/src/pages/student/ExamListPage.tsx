import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExamCard from "../../components/exam/ExamCard";
import api from "../../services/api";

interface Exam {
  id: string;
  title: string;
  description?: string;
  type: "FECHA_LIMITE" | "DURACION_FIJA";
  deadline?: string;
  durationMinutes?: number;
  questionsCount: number;
}

export default function ExamListPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/exams") // 👈 antes era "/student/exams" (el backend debe filtrar por rol)
      .then((res) => setExams(res.data))
      .catch((err) => console.error("Error cargando exámenes:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async (examId: string) => {
    try {
      await api.post(`/exams/${examId}/start`); // 👈 antes era "/student/exams/${examId}/start"
      navigate(`/student/exam/${examId}`);
    } catch (error) {
      alert("No se pudo iniciar el examen");
    }
  };

  if (loading) return <div className="p-4">Cargando exámenes...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mis Exámenes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onStart={() => handleStart(exam.id)}
          />
        ))}
      </div>
    </div>
  );
}
