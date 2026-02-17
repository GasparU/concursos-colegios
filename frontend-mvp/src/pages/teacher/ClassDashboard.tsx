// src/pages/teacher/ClassDashboard.tsx (versión azul)
import { useState } from "react";
import {
  BookOpen,
  Pencil,
  Ruler,
  Calculator,
  ChevronRight,
  Star,
} from "lucide-react";

export default function ClassDashboard() {
  const [lessons] = useState([
    { id: 1, title: "Upcoming unit: lesson 1", completed: false },
    { id: 2, title: "Upcoming unit: lesson 2", completed: false },
    { id: 3, title: "Upcoming unit: lesson 3", completed: true },
  ]);

  const [equipment] = useState([
    "Book",
    "Note",
    "Pencil/Pen",
    "Eraser",
    "Ruler",
    "Calculator",
  ]);

  const [opinions] = useState([
    {
      rating: 9.5,
      name: "Student Name",
      comment: "hendi squam velias dolidt aliqu omni mpso sus nis",
    },
    {
      rating: 8.7,
      name: "Student Name",
      comment: "hendi squam velias dolidt aliqu omni mpso sos nis",
    },
    {
      rating: 8.5,
      name: "Student Name",
      comment: "hendi squam velias dolidt aliqu omni mpso sus nis",
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-sans relative">
      {/* Fondo cuadriculado más suave */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
          linear-gradient(to right, #a5b4fc 1px, transparent 1px),
          linear-gradient(to bottom, #a5b4fc 1px, transparent 1px)
        `,
          backgroundSize: "24px 24px",
          opacity: 0.2,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Cabecera tipo pizarra azul */}
        <div className="mb-8 bg-indigo-800 text-white p-6 rounded-lg shadow-md border-l-8 border-indigo-400">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="text-indigo-300" /> Welcome to Class!
          </h1>
          <p className="text-indigo-200 mt-2">
            Today's lesson plan and resources
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecciones */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-200 overflow-hidden">
              <div className="bg-indigo-100 px-4 py-2 border-b border-indigo-200 flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                <span className="text-sm font-semibold text-indigo-800">
                  📋 Today's Lessons
                </span>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex items-center gap-3 text-indigo-900"
                    >
                      <input
                        type="checkbox"
                        checked={lesson.completed}
                        readOnly
                        className="w-4 h-4 accent-indigo-600"
                      />
                      <span
                        className={
                          lesson.completed ? "line-through text-indigo-400" : ""
                        }
                      >
                        {lesson.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tabla de fórmulas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-200 overflow-hidden">
              <div className="bg-indigo-100 px-4 py-2 border-b border-indigo-200">
                <span className="text-sm font-semibold text-indigo-800">
                  📐 Learn Formula From Math
                </span>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-indigo-200">
                      <th className="text-left py-2 text-indigo-800">Title</th>
                      <th className="text-left py-2 text-indigo-800">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 font-semibold">Obt Cuboid Unit</td>
                      <td>Obt cuboid unit</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">
                        mosa rindri ande alti autat.
                      </td>
                      <td>mossa rindri ande alti autat.</td>
                    </tr>
                    {/* más filas... */}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Historia */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-200 overflow-hidden">
              <div className="bg-indigo-100 px-4 py-2 border-b border-indigo-200">
                <span className="text-sm font-semibold text-indigo-800">
                  ⏳ History of Algebra
                </span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xl font-bold text-indigo-700">2020</div>
                  <p className="text-xs text-indigo-600">
                    Cibi quibudant miss amosa...
                  </p>
                </div>
                <div>
                  <div className="text-xl font-bold text-indigo-700">2021</div>
                  <p className="text-xs text-indigo-600">
                    Cibi quibudant miss amosa...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha (1/3) */}
          <div className="space-y-6">
            {/* Perfil profesor */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-200 overflow-hidden">
              <div className="bg-indigo-100 px-4 py-2 border-b border-indigo-200">
                <span className="text-sm font-semibold text-indigo-800">
                  👨‍🏫 Today's Teacher
                </span>
              </div>
              <div className="p-4 text-center">
                <div className="w-20 h-20 bg-indigo-200 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl font-bold text-indigo-700">
                  JS
                </div>
                <h3 className="font-bold text-indigo-900">Teacher Name</h3>
                <p className="text-xs text-indigo-500">Mathematics</p>
                <p className="text-xs text-indigo-600 mt-2 italic">
                  "A little explanation about math."
                </p>
              </div>
            </div>

            {/* Equipo */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-200 overflow-hidden">
              <div className="bg-indigo-100 px-4 py-2 border-b border-indigo-200">
                <span className="text-sm font-semibold text-indigo-800">
                  ✏️ Equipment Needed
                </span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {equipment.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1 text-xs text-indigo-700"
                  >
                    {item === "Book" && <BookOpen size={12} />}
                    {item === "Note" && <Pencil size={12} />}
                    {item === "Ruler" && <Ruler size={12} />}
                    {item === "Calculator" && <Calculator size={12} />}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opiniones */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-200 overflow-hidden">
              <div className="bg-indigo-100 px-4 py-2 border-b border-indigo-200">
                <span className="text-sm font-semibold text-indigo-800">
                  💬 Students Opinion
                </span>
              </div>
              <div className="p-4 space-y-3">
                {opinions.map((op, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 border-b border-indigo-100 pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm">
                      <Star size={12} fill="currentColor" /> {op.rating}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-indigo-900">
                        {op.name}
                      </p>
                      <p className="text-xs text-indigo-600">{op.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-indigo-400 border-t border-indigo-200 pt-4">
          <p>A little explanation about math. © 2026 Class Dashboard</p>
        </div>
      </div>
    </div>
  );
}
