import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () =>
        set((state) => {
          const newMode = !state.darkMode;
          if (newMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { darkMode: newMode };
        }),
    }),
    { name: "theme-storage" },
  ),
);
