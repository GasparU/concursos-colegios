interface GenerationProgressProps {
  progress: number;
  isGenerating: boolean;
  onCancel: () => void;
  dragPos: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent) => void;
  problemsLength: number;
  quantity: number;
}

export default function GenerationProgress({
  progress,
  isGenerating,
  onCancel,
  dragPos,
  onMouseDown,
  problemsLength,
  quantity,
}: GenerationProgressProps) {
  if (!isGenerating) return null;

  return (
    <div
      onMouseDown={onMouseDown}
      className="fixed w-80 bg-white p-4 rounded-xl shadow-2xl border border-indigo-100 z-[9999] select-none transition-shadow cursor-grab hover:shadow-lg"
      style={{ left: dragPos.x, top: dragPos.y, touchAction: "none" }}
    >
      <div className="flex justify-between items-center mb-2 pointer-events-none">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
          <span className="animate-spin text-lg">↻</span> IA Trabajando
        </span>
        <span className="text-xl font-black text-slate-700">{progress}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2 pointer-events-none">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-[10px] text-slate-400 font-medium text-center pointer-events-none">
        Generando ejercicio {problemsLength + 1} de {quantity}...
      </p>
      <button
        onClick={onCancel}
        className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-md hover:bg-rose-100 transition-colors border border-rose-100"
      >
        CANCELAR
      </button>
      <div className="absolute top-2 right-2 text-slate-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
    </div>
  );
}
