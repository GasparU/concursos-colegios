import axios from "axios";

// 🔥 REEMPLAZA ESTO: Aplicamos inyección de dependencia para el entorno.
// Si existe la variable en Vercel, la usa. Si no (entorno local), usa localhost.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 AÑADE ESTO PARA DEBUGEAR EL 404
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;