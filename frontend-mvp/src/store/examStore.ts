import { create } from 'zustand';

interface ExamState {
    currentProblem: any | null; // El JSON del problema generado
    setProblem: (problem: any) => void;
}

export const useExamStore = create<ExamState>((set) => ({
    currentProblem: null,
    setProblem: (problem) => set({ currentProblem: problem }),
}));