import { create } from 'zustand';

interface TimerState {
  currentRemaining: number;
  totalUsed: number;
  totalIdeal: number;
  isDebt: boolean;
  isActive: boolean;
  startTime: number;
  timeAtQuestionStart: number;
  initialQuestionTime: number;

  initTimer: (totalIdeal: number) => void;
  startQuestion: (seconds: number) => void;
  tick: () => void;
  stopTimer: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  currentRemaining: 0,
  totalUsed: 0,
  totalIdeal: 0,
  isDebt: false,
  isActive: false,
  startTime: 0,
  timeAtQuestionStart: 0,
  initialQuestionTime: 0,

  // Inicializa el examen completo
  initTimer: (totalIdeal: number) => {
    const now = Date.now();
    set({ 
      totalIdeal, 
      totalUsed: 0, 
      startTime: now, 
      isActive: true,
      timeAtQuestionStart: 0,
      isDebt: false
    });
  },

  // Inicia una nueva pregunta calculando el offset real
  startQuestion: (seconds: number) => set((state) => {
    const now = Date.now();
    const elapsedSoFar = Math.floor((now - state.startTime) / 1000);
    return {
      initialQuestionTime: seconds,
      timeAtQuestionStart: elapsedSoFar,
      currentRemaining: seconds,
      isDebt: false
    };
  }),

  // Motor de cálculo basado en timestamps (No se desfasa)
  tick: () => set((state) => {
    if (!state.isActive) return state;
    
    const now = Date.now();
    const elapsedTotal = Math.floor((now - state.startTime) / 1000);
    const spentInThisQuestion = elapsedTotal - state.timeAtQuestionStart;
    const remaining = state.initialQuestionTime - spentInThisQuestion;

    return {
      totalUsed: elapsedTotal,
      currentRemaining: remaining,
      isDebt: remaining < 0
    };
  }),

  stopTimer: () => set({ isActive: false }),
}));