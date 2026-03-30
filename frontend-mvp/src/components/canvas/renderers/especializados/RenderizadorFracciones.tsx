import React from "react";

export const RenderizadorFracciones: React.FC<{ parametros: any }> = ({ parametros }) => {
  const { shape, parts, shaded, color } = parametros;

  // Blindaje para evitar renders masivos si llega un número enorme
  const safeParts = Math.max(1, Math.min(Number(parts) || 1, 24)); 
  const safeShaded = Math.max(0, Math.min(Number(shaded) || 0, safeParts));

  // 1. MODELO RECTANGULAR (Para Adición y Sustracción)
  if (shape === "rect") {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded border border-slate-200 shadow-sm w-full max-w-sm mx-auto">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
          Modelo de Área
        </span>
        <div className="flex w-full h-10 border-2 border-slate-800 rounded-sm overflow-hidden">
          {Array.from({ length: safeParts }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 border-r-2 border-slate-800 last:border-r-0 transition-all duration-500`}
              style={{
                backgroundColor: i < safeShaded ? color : 'transparent',
              }}
            />
          ))}
        </div>
        <div className="mt-3 font-black text-lg text-slate-700 bg-slate-100 px-3 py-1 rounded">
          {safeShaded} / {safeParts}
        </div>
      </div>
    );
  }

  // 2. MODELO DE MALLA / INTERSECCIÓN (Para Multiplicación y División)
  if (shape === "grid") {
    // Calculamos una cuadrícula lo más simétrica posible
    const cols = Math.ceil(Math.sqrt(safeParts));
    
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded border border-slate-200 shadow-sm w-full max-w-xs mx-auto">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
          Malla de Intersección
        </span>
        <div 
          className="grid gap-1 p-2 bg-slate-50 border-2 border-slate-800 rounded-md"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: safeParts }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 border border-slate-300 rounded-sm transition-all duration-500"
              style={{
                backgroundColor: i < safeShaded ? color : 'white',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};