import { useEffect } from "react";
import { useTimerStore } from "../../hooks/useTimerStore";

// Asumimos que la interface TimerProps sigue igual si la usas
interface TimerProps {
  type: string;
}

export default function Timer({ type }: TimerProps) {
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

  // 🔥 LÓGICA DE ADVERTENCIA QUIRÚRGICA 🔥
  // Es advertencia si quedan segundos (>0) y son menos o igual a 30.
  const isWarning = currentRemaining > 0 && currentRemaining <= 30;

  // 🔥 GESTIÓN DE ESTILOS BASADA EN EL ESTADO DEL CRONÓMETRO
  const getStyles = () => {
    // 1. Estado de DEUDA (Tiempo agotado) -> ROJO
    if (isDebt) {
      return "bg-red-50 border-red-500 text-red-600 animate-pulse font-bold shadow-lg";
    }

    // 2. Estado de ADVERTENCIA (Menos de 30s) -> ÁMBAR/NARANJA VIBRANTE 🔥
    // ¡Esta es la lógica que faltaba! Usamos orange-400 para que sea llamativo.
    if (isWarning) {
      return "bg-orange-400 border-orange-600 text-white font-bold shadow-md scale-105";
    }

    // 3. Estado NORMAL (Tiempo suficiente) -> GRIS/SLATE
    return "bg-slate-100 border-slate-200 text-slate-700";
  };

  return (
    <div className={`
      text-lg md:text-xl font-mono px-4 py-1.5 rounded-xl border-2 transition-all duration-300
      ${getStyles()} // Aplicamos el estilo dinámico aquí
    `}>
      <span className="text-[10px] md:text-xs uppercase font-black mr-2 opacity-60">
        ⏱️ TIEMPO
      </span>
      {formatTime(currentRemaining)}
    </div>
  );
}