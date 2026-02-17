import { useState, useEffect } from "react";

interface TimerProps {
  type: "FECHA_LIMITE" | "DURACION_FIJA";
  deadline?: string;
  durationMinutes?: number;
  startTime?: string;
  onEnd: () => void;
}

export default function Timer({
  type,
  deadline,
  durationMinutes,
  startTime,
  onEnd,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      let endTime: number;
      if (type === "DURACION_FIJA" && startTime && durationMinutes) {
        endTime = new Date(startTime).getTime() + durationMinutes * 60000;
      } else if (type === "FECHA_LIMITE" && deadline) {
        endTime = new Date(deadline).getTime();
      } else {
        return "Tiempo indefinido";
      }

      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        onEnd();
        return "Tiempo terminado";
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [type, deadline, durationMinutes, startTime, onEnd]);

  return (
    <div className="text-xl font-mono bg-gray-100 px-4 py-2 rounded-lg">
      ⏱️ {timeLeft}
    </div>
  );
}
