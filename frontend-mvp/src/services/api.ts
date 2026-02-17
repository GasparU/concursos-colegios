import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
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
  // Esto imprimirá en la consola del navegador la URL exacta antes de salir
  console.log(`📡 Petición saliendo a: ${config.baseURL}${config.url}`);
  return config;
});

export default api;
