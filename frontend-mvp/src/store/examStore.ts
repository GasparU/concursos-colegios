import { create } from "zustand";

interface ExamState {
  problems: any[];
  currentProblem: any | null;
  setProblems: (problems: any[]) => void;
  setProblem: (problem: any) => void;
}

export const useExamStore = create<ExamState>((set) => ({
  problems: [],
  currentProblem: null,
  setProblems: (problems) => set({ problems }),
  setProblem: (problem) => set({ currentProblem: problem }), // <-- Y SU IMPLEMENTACIÓN
}));