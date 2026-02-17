import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  fontSize: number; // 0,1,2,3
  theme: "light" | "dark"; // pero el modo oscuro ya lo manejamos aparte, podemos sincronizar o dejarlo independiente
  sidebarOpen: boolean;
  increaseFont: () => void;
  decreaseFont: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UIState>()(
  persist(
    (set) => ({
      fontSize: 2, // valor por defecto (text-base)
      theme: "light", // podría ser 'light' por defecto, pero el modo oscuro lo maneja themeStore
      sidebarOpen: true,
      increaseFont: () =>
        set((state) => ({ fontSize: Math.min(state.fontSize + 1, 3) })),
      decreaseFont: () =>
        set((state) => ({ fontSize: Math.max(state.fontSize - 1, 0) })),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: "ui-storage" },
  ),
);
