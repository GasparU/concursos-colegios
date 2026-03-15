import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import ExamDetail from "../pages/teacher/ExamDetail";
import ExamResults from "../pages/student/ExamResults";

import StudentLayout from "../layout/StudentLayout";

import Login from "../pages/Login";
import DocenteLayout from "../layout/DocenteLayout";
import ExamListPage from "../pages/teacher/ExamListPage";
import { GeneratorPage } from "../pages/teacher/generator-page";
import ExamPlayerPage from "../pages/student/ExamPlayerPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/login" /> },
      { path: "login", element: <Login /> },
      {
        path: "teacher",
        element: <DocenteLayout />,
        children: [
          { index: true, element: <Navigate to="/teacher/exams" /> },
          { path: "exams", element: <ExamListPage /> },
          { path: "exam/:id", element: <GeneratorPage /> }, // Editar/crear
          { path: "exam/:id/students", element: <ExamDetail /> },
          {
            path: "students",
            element: <div>Lista de estudiantes (pendiente)</div>,
          },
        ],
      },
      {
        path: "student",
        element: <StudentLayout />, // Necesitarás crear este layout
        children: [
          { index: true, element: <Navigate to="/student/exams" /> },
          { path: "exams", element: <ExamListPage /> },
          { path: "exam/:id", element: <ExamPlayerPage /> },
          { path: "results/:id", element: <ExamResults /> },
        ],
      },
    ],
  },
]);
