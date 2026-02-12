import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
    fontSize: number; // 0 = normal, 1 = grande, 2 = extra grande
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    increaseFont: () => void;
    decreaseFont: () => void;
    toggleTheme: () => void;
    toggleSidebar: () => void;
}

export const useUiStore = create<UiState>()(
    persist(
        (set) => ({
            fontSize: 0,
            theme: 'light',
            sidebarOpen: false, // En móvil empieza cerrado
            increaseFont: () => set((state) => ({ fontSize: Math.min(state.fontSize + 1, 3) })),
            decreaseFont: () => set((state) => ({ fontSize: Math.max(state.fontSize - 1, 0) })),
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        }),
        { name: 'ui-settings' } // Persistencia en LocalStorage
    )
);