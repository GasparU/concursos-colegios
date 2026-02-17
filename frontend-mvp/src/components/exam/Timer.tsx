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
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      let endTime: number;
      if (type === "DURACION_FIJA" && startTime && durationMinutes) {
        endTime = new Date(startTime).getTime() + durationMinutes * 60000;
      } else if (type === "FECHA_LIMITE" && deadline) {
        endTime = new Date(deadline).getTime();
      } else {
        return "—";
      }

      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        onEnd();
        return "00:00:00";
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
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
