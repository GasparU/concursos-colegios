import { useState } from "react";
import { Mafs, Line, Text } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";

interface Segmento {
  inicio: [number, number];
  fin: [number, number];
  etiqueta: string;
  etiquetaX: number; // 🔥 Ahora recibe coordenadas exactas y seguras
  etiquetaY: number;
}

interface Props {
  parametros: {
    paralelas: {
      puntos: [[number, number], [number, number]];
      label?: string;
    }[];
    transversales: {
      puntos: [[number, number], [number, number]];
      label?: string;
    }[];
    segmentos: Segmento[];
  };
}

export const RenderizadorThales = ({ parametros }: Props) => {
  const [escalaTexto, setEscalaTexto] = useState(1);

  if (!parametros || !parametros.paralelas) return null;
  const { paralelas, transversales, segmentos } = parametros;

  const tamanoBase = CONFIG_GEOMETRIA.TAMANO_TEXTO * escalaTexto;

  const viewBox = {
    x: [-7, 7] as [number, number], // Viewbox ensanchado para alojar los textos
    y: [-5, 5] as [number, number],
  };

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

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-2">
        <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
          <g>
            {/* Paralelas y Transversales */}
            {paralelas.map((linea, i) => (
              <Line.Segment
                key={`p-${i}`}
                point1={linea.puntos[0]}
                point2={linea.puntos[1]}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                weight={2}
              />
            ))}
            {transversales.map((linea, i) => (
              <Line.Segment
                key={`t-${i}`}
                point1={linea.puntos[0]}
                point2={linea.puntos[1]}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
                weight={2}
              />
            ))}

            {/* Textos Matemáticamente Centrados y Empujados */}
            {segmentos.map((seg, i) => (
              <Text
                key={`seg-${i}`}
                x={seg.etiquetaX}
                y={seg.etiquetaY}
                size={tamanoBase}
                color="#000000"
                svgTextProps={{ fontWeight: "600" }}
              >
                {seg.etiqueta}
              </Text>
            ))}
          </g>
        </Mafs>
      </div>
    </div>
  );
};
