import { useState, useEffect } from "react";

import { Search } from "lucide-react";
import api from "../../services/api";

interface Student {
  id: string;
  nombre: string;
  email: string;
  totalExams: number;
  completedExams: number;
  averageScore: number;
}

export default function StudentsListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/teacher/students").then((res) => setStudents(res.data));
  }, []);

  const filtered = students.filter(
    (s) =>
      s.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Estudiantes</h1>

      <div className="mb-4 flex items-center gap-2 bg-white rounded-lg shadow p-2">
        <Search size={20} className="text-gray-400 ml-2" />
        <input
          type="text"
          placeholder="Buscar estudiante..."
          className="flex-1 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Exámenes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Completados
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Promedio
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {s.nombre || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{s.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.totalExams}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {s.completedExams}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      s.averageScore >= 70
                        ? "bg-green-100 text-green-800"
                        : s.averageScore >= 40
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {s.averageScore.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
