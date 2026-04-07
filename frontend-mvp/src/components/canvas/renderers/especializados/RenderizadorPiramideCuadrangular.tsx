import { useState } from "react";
import { Mafs, Line } from "mafs";
import { CONFIG_GEOMETRIA, AJUSTES_PRISMA } from "./ConstantesVisuales";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

interface Arista {
  inicio: [number, number];
  fin: [number, number];
  esBase?: boolean; 
}

interface EtiquetaVectorial {
  texto: string;
  mx: number;
  my: number;
  nx: number;
  ny: number;
}

interface Props {
  parametros: {
    todosLosPuntos: [number, number][];
    aristasSolidas: Arista[];
    aristasOcultas: Arista[];
    lineaAltura: Arista;
    etiquetas: EtiquetaVectorial[];
  };
}

export const RenderizadorPiramideCuadrangular = ({ parametros }: Props) => {
  const [escalaTexto, setEscalaTexto] = useState(1);

  if (!parametros || !parametros.todosLosPuntos) return null;
  const { todosLosPuntos, aristasSolidas, aristasOcultas, lineaAltura, etiquetas } = parametros;

  const escalaBase = AJUSTES_PRISMA?.escalaFuente || 0.75;
  const tamanoBase = 18 * escalaTexto * escalaBase;

  // Normalización a escala 10
  const xs = todosLosPuntos.map((v) => v[0]);
  const ys = todosLosPuntos.map((v) => v[1]);
  const maxDim = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
  const scale = 10 / maxDim;

  const escalar = (a: Arista) => ({
    inicio: [a.inicio[0] * scale, a.inicio[1] * scale] as [number, number],
    fin: [a.fin[0] * scale, a.fin[1] * scale] as [number, number],
  });

  const etiquetasCalculadas = etiquetas.map((eti) => ({
    texto: eti.texto,
    x: eti.mx * scale,
    y: eti.my * scale,
  }));

  // 🔥 VIEWBOX AJUSTADO: Esto hace que la pirámide ocupe TODO el lienzo otra vez
  const viewBox = { x: [-8, 8] as [number, number], y: [-3, 8.5] as [number, number] };
  const hEscalada = escalar(lineaAltura);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-end w-full mb-2 gap-2 pr-4">
        <button onClick={() => setEscalaTexto((p) => Math.max(0.7, p - 0.1))} className="px-2 py-1 text-xs bg-slate-100 rounded text-slate-600 font-bold">A-</button>
        <button onClick={() => setEscalaTexto((p) => Math.min(1.5, p + 0.1))} className="px-2 py-1 text-xs bg-slate-100 rounded text-slate-600 font-bold">A+</button>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-2 h-[340px]">
        <Mafs height={330} viewBox={viewBox} pan={false} zoom={false}>
          <g>
            <Line.Segment point1={hEscalada.inicio} point2={hEscalada.fin} color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA} weight={1.5} style="dashed" />

            {aristasOcultas.map((a, i) => {
              const e = escalar(a);
              return (
                <g key={`h-${i}`}>
                  <Line.Segment point1={e.inicio} point2={e.fin} color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA} weight={1.5} style="dashed" />
                  {a.esBase && <circle cx={(e.inicio[0]+e.fin[0])/2} cy={(e.inicio[1]+e.fin[1])/2} r={2.5} fill={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA} />}
                </g>
              );
            })}

            {aristasSolidas.map((a, i) => {
              const e = escalar(a);
              return (
                <g key={`s-${i}`}>
                  <Line.Segment point1={e.inicio} point2={e.fin} color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL} weight={2.5} />
                  {a.esBase && <circle cx={(e.inicio[0]+e.fin[0])/2} cy={(e.inicio[1]+e.fin[1])/2} r={3.5} fill={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL} stroke="white" strokeWidth={1} />}
                </g>
              );
            })}

            {/* 🔥 RENDERIZADO LATEX LIMPIO Y A UN COSTADO */}
            {etiquetasCalculadas.map((eti, i) => (
              <foreignObject 
                key={`eti-${i}`} 
                // 🔥 OFFSET A LA DERECHA: Empuja el texto fuera de la línea punteada
                x={eti.x + 5} 
                y={-eti.y - 15} 
                width="80" 
                height="30"
                style={{ overflow: 'visible' }}
              >
                <div className="flex items-center justify-start h-full w-full bg-transparent pl-2">
                  <div 
                    style={{ fontSize: `${tamanoBase}px` }} 
                    className="text-slate-900 font-bold whitespace-nowrap drop-shadow-[0_2px_3px_rgba(255,255,255,1)]"
                  >
                    <Latex>{eti.texto}</Latex>
                  </div>
                </div>
              </foreignObject>
            ))}
          </g>
        </Mafs>
      </div>
    </div>
  );
};