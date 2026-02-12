import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import { GeneratorPage } from '../pages/teacher/GeneratorPage';
import { ExamPlayerPage } from '../pages/student/ExamPlayerPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />, // El marco con el sidebar
    children: [
      {
        index: true,
        element: <GeneratorPage />, // Página por defecto: Profesor
      },
      {
        path: 'student/exam',
        element: <ExamPlayerPage />, // Página de examen
      },
      {
        path: 'progress',
        element: <div className="p-8 text-slate-400">Próximamente: Gráficas de Progreso</div>
      }
    ],
  },
]);