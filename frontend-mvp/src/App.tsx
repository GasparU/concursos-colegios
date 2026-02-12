import { RouterProvider } from 'react-router-dom';
import { router } from './router';

// 🔥 App limpia: Solo provee el enrutamiento.
// La lógica está en los componentes de página.
export default function App() {
  return <RouterProvider router={router} />;
}