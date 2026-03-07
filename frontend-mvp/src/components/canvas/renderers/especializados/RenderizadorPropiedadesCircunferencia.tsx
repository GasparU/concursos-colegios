import { useState } from "react";
import { Mafs, Line, Text, Circle, Polyline, Polygon } from "mafs";
import {
  CONFIG_GEOMETRIA,
  AJUSTES_SEGMENTOS_CIRCUNFERENCIA,
} from "./ConstantesVisuales";

interface Segmento {
  inicio: [number, number];
  fin: [number, number];
}
interface Etiqueta {
  texto: string;
  pos: [number, number];
  esPunto: boolean;
}

interface Props {
  parametros: {
    radio: number;
    puntosPivote: [number, number][];
    lineasAzules: Segmento[];
    arcosVerdes?: [number, number][][];
    cuadros90?: [number, number][][];
    etiquetas: Etiqueta[];
  };
}

export const RenderizadorPropiedadesCircunferencia = ({
  parametros,
}: Props) => {
  const [escalaTexto, setEscalaTexto] = useState(1);
  if (!parametros || !parametros.puntosPivote) return null;
  const {
    radio,
    puntosPivote,
    lineasAzules,
    arcosVerdes = [],
    cuadros90 = [],
    etiquetas,
  } = parametros;

  const escalaBase = AJUSTES_SEGMENTOS_CIRCUNFERENCIA?.escalaFuente || 0.85;
  const tamanoBase = CONFIG_GEOMETRIA.TAMANO_TEXTO * escalaTexto * escalaBase;

  const xs = puntosPivote.map((p) => p[0]);
  const ys = puntosPivote.map((p) => p[1]);
  const limitesX = [...xs, radio, -radio];
  const limitesY = [...ys, radio, -radio];

  const viewBox = {
    x: [Math.min(...limitesX) - 1.5, Math.max(...limitesX) + 1.5] as [
      number,
      number,
    ],
    y: [Math.min(...limitesY) - 1.5, Math.max(...limitesY) + 1.5] as [
      number,
      number,
    ],
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

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-2 h-[380px]">
        <Mafs height={370} viewBox={viewBox} pan={false} zoom={false}>
          <g>
            <Circle
              center={[0, 0]}
              radius={radio}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
              weight={2.5}
              fillOpacity={0.05}
            />

            {/* Símbolos de 90 grados */}
            {cuadros90.map((pts, i) => (
              <Polyline
                key={`c90-${i}`}
                points={pts}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
                weight={1.5}
              />
            ))}

            {/* Arcos Verdes */}
            {arcosVerdes.map((pts, i) => (
              <Polyline
                key={`arc-${i}`}
                points={pts}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
                weight={2.5}
              />
            ))}

            {lineasAzules.map((seg, idx) => (
              <Line.Segment
                key={`solido-${idx}`}
                point1={seg.inicio}
                point2={seg.fin}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                weight={2.5}
              />
            ))}

            {etiquetas.map((eti, i) => (
              <Text
                key={`eti-${i}`}
                x={eti.pos[0]}
                y={eti.pos[1]}
                size={eti.esPunto ? tamanoBase * 0.9 : tamanoBase}
                color="#000000"
                svgTextProps={{
                  fontWeight: eti.esPunto ? "bold" : "700",
                  textAnchor: "middle",
                  dominantBaseline: "middle",
                  style: eti.esPunto
                    ? {}
                    : {
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
