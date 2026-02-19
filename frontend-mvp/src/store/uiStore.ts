// src/store/uiStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  fontSize: number; // 0,1,2,3
  theme: "light" | "dark"; // Estado único para el tema
  sidebarOpen: boolean;

  // Acciones
  increaseFont: () => void;
  decreaseFont: () => void;
  toggleSidebar: () => void;
  toggleTheme: () => void; // 🔥 La nueva acción unificada
}

export const useUiStore = create<UIState>()(
  persist(
    (set) => ({
      fontSize: 2,
      theme: "light",
      sidebarOpen: true,

      increaseFont: () =>
        set((state) => ({ fontSize: Math.min(state.fontSize + 1, 5) })), // Ampliado a 5 niveles como pediste

      decreaseFont: () =>
        set((state) => ({ fontSize: Math.max(state.fontSize - 1, 0) })),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // 🔥 Lógica fusionada: Actualiza el estado Y el DOM al mismo tiempo
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";

          // Manipulación directa del DOM (Lo que hacía themeStore)
          if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }

          return { theme: newTheme };
        }),
    }),
    {
      name: "ui-storage",
      // Hidratación: Asegurar que el DOM coincida con el estado guardado al recargar
      onRehydrateStorage: () => (state) => {
        if (state?.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    },
  ),
);
