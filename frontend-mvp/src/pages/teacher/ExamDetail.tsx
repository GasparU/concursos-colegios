import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

interface StudentProgress {
  studentId: string;
  nombre: string;
  email: string;
  startTime?: string;
  endTime?: string;
  score?: number;
  total: number;
}

export default function ExamDetail() {
  const { id } = useParams();
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [examTitle, setExamTitle] = useState("");

  useEffect(() => {
    api
      .get(`/exams/${id}/students`) // 👈 antes era "/teacher/exams/${id}/students"
      .then((res) => {
        setStudents(res.data.students);
        setExamTitle(res.data.title);
      })
      .catch((err) => console.error("Error cargando progreso:", err));
  }, [id]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{examTitle} - Progreso</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estudiante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Inicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Puntaje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((s) => (
              <tr key={s.studentId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {s.nombre || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{s.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {s.startTime ? new Date(s.startTime).toLocaleString() : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {s.endTime ? new Date(s.endTime).toLocaleString() : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {s.score !== undefined ? `${s.score}/${s.total}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
