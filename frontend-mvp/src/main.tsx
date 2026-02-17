import React from "react";
// 🔥 CAMBIO CRÍTICO: React 18 requiere importar desde 'react-dom/client'
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // Asegúrate de tener este archivo o borra esta línea si no usas estilos globales aún

// Validación de seguridad para TypeScript (el signo '!')
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento root en el HTML");
}

// 🔥 Renderizado modo React 18
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
