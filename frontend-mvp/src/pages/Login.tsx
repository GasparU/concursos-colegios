import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Asegúrate que este api tenga el baseURL correcto
import { useAuthStore } from "../store/authStore"; // Asegúrate de la ruta

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Extraemos setUser del store (y verify si lo necesitas)
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      // 🔥 CORRECCIÓN AQUÍ: Enviamos { email, password }
      // La ruta es "/auth/login" (sin /api porque ya está en el baseURL de axios)
      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data;

      // Guardar token
      localStorage.setItem("token", token);

      // Guardar usuario en estado global
      setUser(user);

      // Redirigir según rol
      if (user.role === "DOCENTE") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (err: any) {
      console.error("Error login:", err);
      // Mostrar mensaje más claro si viene del backend
      setError(
        err.response?.data?.message ||
          "Credenciales inválidas o error de conexión",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto mt-10 border rounded-xl shadow-lg bg-white"
    >
      <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
        Acceso Plataforma
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          placeholder="ejemplo@escuela.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md"
      >
        Ingresar
      </button>
    </form>
  );
}
