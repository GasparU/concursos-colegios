import React from "react";

export const GraphicCounting: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;
  const { shape, params } = data;

  // ESTILOS CONAMAT: Borde Verde oscuro, relleno azul clarito o vacío
  const strokeColor = "#16a34a"; // green-600
  const strokeWidth = "2.5";

  // Generador de Cevianas Base
  if (shape === "cevianas_base") {
    const w = 200; const h = 180;
    const { espacios } = params;
    const step = w / espacios;
    return (
      <div className="flex justify-center p-6 bg-white border border-slate-200 mt-4 rounded">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
          {/* Triángulo Principal */}
          <polygon points={`0,${h} ${w/2},0 ${w},${h}`} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
          {/* Cevianas (Líneas desde el pico a la base) */}
          {Array.from({ length: espacios - 1 }).map((_, i) => (
            <line key={i} x1={w/2} y1="0" x2={step * (i + 1)} y2={h} stroke={strokeColor} strokeWidth={strokeWidth} />
          ))}
        </svg>
      </div>
    );
  }

  // Generador de Malla (Cevianas + Horizontales)
  if (shape === "cevianas_malla") {
    const w = 220; const h = 200;
    const { espacios, pisos } = params;
    const stepX = w / espacios;
    const stepY = h / pisos;
    return (
      <div className="flex justify-center p-6 bg-white border border-slate-200 mt-4 rounded">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
          <polygon points={`0,${h} ${w/2},0 ${w},${h}`} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
          {Array.from({ length: espacios - 1 }).map((_, i) => (
            <line key={`c-${i}`} x1={w/2} y1="0" x2={stepX * (i + 1)} y2={h} stroke={strokeColor} strokeWidth={strokeWidth} />
          ))}
          {/* Horizontales */}
          {Array.from({ length: pisos - 1 }).map((_, i) => {
            const currentY = stepY * (i + 1);
            // Calcular x inicial y final basados en el triángulo isósceles
            const inset = (currentY / h) * (w / 2);
            return <line key={`h-${i}`} x1={inset} y1={currentY} x2={w - inset} y2={currentY} stroke={strokeColor} strokeWidth={strokeWidth} />;
          })}
        </svg>
      </div>
    );
  }

  // Cuadriláteros Cruzados
  if (shape === "cuadrado_diagonales" || shape === "cuadrado_asterisco") {
    const s = 150;
    return (
      <div className="flex justify-center p-6 bg-white border border-slate-200 mt-4 rounded">
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x="5" y="5" width={s-10} height={s-10} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="5" y1="5" x2={s-5} y2={s-5} stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="5" y1={s-5} x2={s-5} y2="5" stroke={strokeColor} strokeWidth={strokeWidth} />
          {shape === "cuadrado_asterisco" && (
            <>
              <line x1={s/2} y1="5" x2={s/2} y2={s-5} stroke={strokeColor} strokeWidth={strokeWidth} />
              <line x1="5" y1={s/2} x2={s-5} y2={s/2} stroke={strokeColor} strokeWidth={strokeWidth} />
            </>
          )}
        </svg>
      </div>
    );
  }

  // Estrellas (Nivel Experto)
  if (shape === "estrella_5" || shape === "estrella_david") {
    return (
      <div className="flex justify-center p-6 bg-white border border-slate-200 mt-4 rounded">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {shape === "estrella_5" ? (
            <polygon points="100,10 40,190 190,70 10,70 160,190" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          ) : (
            <>
              <polygon points="100,20 180,150 20,150" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
              <polygon points="100,180 20,50 180,50" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
            </>
          )}
        </svg>
      </div>
    );
  }

  // Cevianas + Transversal cruzada
  if (shape === "cevianas_transversal") {
    const w = 200; const h = 180;
    return (
      <div className="flex justify-center p-6 bg-white border border-slate-200 mt-4 rounded">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
          <polygon points={`0,${h} ${w/2},0 ${w},${h}`} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
          <line x1={w/2} y1="0" x2={w*0.25} y2={h} stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1={w/2} y1="0" x2={w*0.5} y2={h} stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1={w/2} y1="0" x2={w*0.75} y2={h} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Transversal maldita (Corta desde la base izq hasta la mitad derecha) */}
          <line x1="0" y1={h} x2={w*0.87} y2={h/2} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      </div>
    );
  }

  return null;
};