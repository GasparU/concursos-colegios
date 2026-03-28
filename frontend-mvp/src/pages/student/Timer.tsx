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
    const absSecs = Math.abs(seconds);
    const mins = Math.floor(absSecs / 60);
    const secs = absSecs % 60;
    const sign = seconds < 0 ? "+" : ""; 
    return `${sign}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`
      text-lg md:text-xl font-mono px-4 py-1.5 rounded-xl border-2 transition-all duration-300 shadow-sm
      ${isDebt 
        ? "bg-red-50 border-red-500 text-red-600 animate-pulse" 
        : "bg-slate-100 border-slate-200 text-slate-700"}
    `}>
      <span className="text-[10px] md:text-xs uppercase font-black mr-2 opacity-50">
        {isDebt ? "⚠️ Deuda" : "⏱️ Tiempo"}
      </span>
      {formatTime(currentRemaining)}
    </div>
  );
}