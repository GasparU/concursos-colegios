import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";


// Teacher pages (importaciones con nombres exactos)
import ExamListPage from "./pages/teacher/ExamListPage";
import ExamDetail from "./pages/teacher/ExamDetail";

// Student pages (importaciones con nombres exactos)
import StudentExamList from "./pages/student/ExamListPage";

import ResultsPage from "./pages/student/ResultsPage";

// Layouts (asumo que existen, si no, créalos)
import DocenteLayout from "./layout/DocenteLayout";
import StudentLayout from "./layout/StudentLayout";
import Login from "./pages/Login";

import ExamPlayerPage from "./pages/student/ExamPlayerPage";
import ClassDashboard from "./pages/teacher/ClassDashboard";
import { GeneratorPage } from "./pages/teacher/generator-page";
import ParametricTestPage from "./pages/teacher/ParametricTestPage";
import SimpleTestPage from "./pages/teacher/SimpleTestPage";

function App() {
  const { user, loading, checkAuth } = useAuthStore();


  useEffect(() => {
    console.log("Ejecutando checkAuth...");
    checkAuth().finally(() => console.log("checkAuth finalizado"));
  }, []);

  if (loading) return <div className="p-4">Cargando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {user ? (
          user.role === "DOCENTE" ? (
            <Route element={<DocenteLayout />}>
              <Route path="/teacher" element={<ClassDashboard />} />{" "}
              {/* 👈 ahora sí es la primera */}
              <Route path="/teacher/dashboard" element={<ClassDashboard />} />
              <Route
                path="/teacher/parametric-test"
                element={<ParametricTestPage />}
              />
              <Route path="/teacher/simple-test" element={<SimpleTestPage />} />
              <Route path="/teacher/exams" element={<ExamListPage />} />
              <Route path="/teacher/exam/:id" element={<GeneratorPage />} />
              <Route
                path="/teacher/exam/:id/students"
                element={<ExamDetail />}
              />
              {/* <Route path="/teacher/students" element={<StudentsListPage />} /> */}
              <Route path="*" element={<Navigate to="/teacher" />} />
            </Route>
          ) : (
            <Route element={<StudentLayout />}>
              <Route path="/student" element={<StudentExamList />} />
              <Route path="/student/exams" element={<StudentExamList />} />
              <Route path="/student/exam/:id" element={<ExamPlayerPage />} />
              <Route path="/student/results/:id" element={<ResultsPage />} />
              <Route path="*" element={<Navigate to="/student" />} />
            </Route>
          )
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
