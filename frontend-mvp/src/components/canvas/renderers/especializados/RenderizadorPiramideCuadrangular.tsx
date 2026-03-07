import { useState } from "react";
import { Mafs, Line, Text, Polygon, Polyline } from "mafs";
import { CONFIG_GEOMETRIA, AJUSTES_PRISMA } from "./ConstantesVisuales";

interface Arista {
  inicio: [number, number];
  fin: [number, number];
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
  const {
    todosLosPuntos,
    aristasSolidas,
    aristasOcultas,
    lineaAltura,
    etiquetas,
  } = parametros;

  // Usamos los ajustes de prisma como base para consistencia 3D
  const escalaBase = AJUSTES_PRISMA?.escalaFuente || 0.75;
  const tamanoBase = CONFIG_GEOMETRIA.TAMANO_TEXTO * escalaTexto * escalaBase;

  // 1. MOTOR DE NORMALIZACIÓN A ESCALA 10
  const xs = todosLosPuntos.map((v) => v[0]);
  const ys = todosLosPuntos.map((v) => v[1]);
  const maxDim =
    Math.max(
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys),
    ) || 1;
  const scale = 10 / maxDim;

  const escalar = (a: Arista) => ({
    inicio: [a.inicio[0] * scale, a.inicio[1] * scale] as [number, number],
    fin: [a.fin[0] * scale, a.fin[1] * scale] as [number, number],
  });

  // 2. EMPUJE DE ETIQUETAS (Lado y Altura)
  const etiquetasCalculadas = etiquetas.map((eti, i) => {
    const PADDING = AJUSTES_PRISMA?.distanciasTexto?.[i] || 0.6;
    return {
      texto: eti.texto,
      x: eti.mx * scale + eti.nx * PADDING,
      y: eti.my * scale + eti.ny * PADDING,
    };
  });

  // 3. VIEWBOX DINÁMICO
  const puntosEscalados = todosLosPuntos.map((p) => [
    p[0] * scale,
    p[1] * scale,
  ]);
  const limitesX = [
    ...puntosEscalados.map((v) => v[0]),
    ...etiquetasCalculadas.map((e) => e.x),
  ];
  const limitesY = [
    ...puntosEscalados.map((v) => v[1]),
    ...etiquetasCalculadas.map((e) => e.y),
  ];

  const viewBox = {
    x: [Math.min(...limitesX) - 1, Math.max(...limitesX) + 1] as [
      number,
      number,
    ],
    y: [Math.min(...limitesY) - 1, Math.max(...limitesY) + 1] as [
      number,
      number,
    ],
  };

  const hEscalada = escalar(lineaAltura);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-end w-full mb-2 gap-2 pr-4">
        <button
          onClick={() => setEscalaTexto((p) => Math.max(0.7, p - 0.1))}
          className="px-2 py-1 text-xs bg-slate-100 rounded text-slate-600 font-bold"
        >
          A-
        </button>
        <button
          onClick={() => setEscalaTexto((p) => Math.min(1.5, p + 0.1))}
          className="px-2 py-1 text-xs bg-slate-100 rounded text-slate-600 font-bold"
        >
          A+
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-2 h-[340px]">
        <Mafs height={330} viewBox={viewBox} pan={false} zoom={false}>
          <g>
            {/* Altura de la Pirámide (Centro a Ápice) */}
            <Line.Segment
              point1={hEscalada.inicio}
              point2={hEscalada.fin}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
              weight={1.5}
              style="dashed"
            />

            {/* Aristas Ocultas (Fondo punteado) */}
            {aristasOcultas.map((a, i) => {
              const e = escalar(a);
              return (
                <Line.Segment
                  key={`h-${i}`}
                  point1={e.inicio}
                  point2={e.fin}
                  color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
                  weight={1.5}
                  style="dashed"
                />
              );
            })}

            {/* Aristas Visibles (Sólidas) */}
            {aristasSolidas.map((a, i) => {
              const e = escalar(a);
              return (
                <Line.Segment
                  key={`s-${i}`}
                  point1={e.inicio}
                  point2={e.fin}
                  color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                  weight={2.5}
                />
              );
            })}

            {/* Etiquetas Algebraicas con Halo Blanco */}
            {etiquetasCalculadas.map((eti, i) => (
              <Text
                key={`eti-${i}`}
                x={eti.x}
                y={eti.y}
                size={tamanoBase}
                color="#000000"
                svgTextProps={{
                  fontWeight: "700",
                  textAnchor: "middle",
                  dominantBaseline: "middle",
                  style: {
                    paintOrder: "stroke",
                    stroke: "#ffffff",
                    strokeWidth: "6px",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  },
                }}
              >
                {eti.texto}
              </Text>
            ))}
          </g>
        </Mafs>
      </div>
    </div>
  );
};
