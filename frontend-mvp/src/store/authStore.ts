import { create } from "zustand";
import api from "../services/api";

interface User {
  id: string;
  email: string;
  role: "DOCENTE" | "ESTUDIANTE";
  nombre?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, loading: false });
  },
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const res = await api.get("/auth/me"); // ⚠️ Este endpoint debe existir en backend
      set({ user: res.data, loading: false });
    } catch (error) {
      console.error("Error en checkAuth:", error);
      localStorage.removeItem("token"); // Opcional: limpiar token inválido
      set({ loading: false });
    }
  },
}));
