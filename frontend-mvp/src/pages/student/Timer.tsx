import { useEffect } from "react";
import { useTimerStore } from "../../hooks/useTimerStore";

export default function Timer() {
  const { currentRemaining, isDebt, tick, isActive } = useTimerStore();

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, tick]);

  const formatTime = (seconds: number) => {
    if (seconds === undefined || seconds === null || isNaN(seconds)) return "00:00";
    const absSecs = Math.abs(seconds);
    const mins = Math.floor(absSecs / 60);
    const secs = absSecs % 60;
    const sign = seconds < 0 ? "+" : ""; 
    return `${sign}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 🔥 LÓGICA DE ADVERTENCIA: 30 segundos de pánico
  const isWarning = currentRemaining > 0 && currentRemaining <= 30;

  const getStyles = () => {
    if (isDebt) return "bg-red-50 border-red-500 text-red-600 animate-pulse shadow-red-200/50";
    if (isWarning) return "bg-orange-400 border-orange-600 text-white font-extrabold animate-bounce scale-110 shadow-orange-300/50";
    return "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200";
  };

  return (
    // 🔥 FIX DE RESPONSIVIDAD: 'fixed' garantiza que no se mueva al hacer scroll.
    // 'z-[100]' asegura que esté por encima de cualquier modal o gráfico.
    <div className={`
      relative flex items-center gap-1.5
      text-sm md:text-base font-mono px-3 py-1 
      rounded-xl border-2 shadow-sm transition-all duration-500
      ${getStyles()}
    `}
    style={{ minWidth: 'fit-content' }}
    >
      <div className="flex flex-col items-center">
        <span className="text-[8px] md:text-[10px] uppercase font-black tracking-tighter opacity-70 leading-none">
          {isDebt ? "⚠️ DEUDA" : isWarning ? "🔥 CORRE" : "⏱️ TIEMPO"}
        </span>
        <span className="leading-none mt-1">
          {formatTime(currentRemaining)}
        </span>
      </div>
    </div>
  );
}