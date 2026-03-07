import { useState } from "react";
import { Mafs, Line, Text, Circle, Polyline } from "mafs";
import { CONFIG_GEOMETRIA, AJUSTES_CIRCUNFERENCIA } from "./ConstantesVisuales";

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
    lineasAzulesPunteadas: Segmento[];
    arcosVerdes: [number, number][][];
    etiquetas: Etiqueta[];
  };
}

export const RenderizadorAngulosCircunferencia = ({ parametros }: Props) => {
  const [escalaTexto, setEscalaTexto] = useState(1);

  if (!parametros || !parametros.puntosPivote) return null;
  const {
    radio,
    puntosPivote,
    lineasAzules,
    lineasAzulesPunteadas,
    arcosVerdes,
    etiquetas,
  } = parametros;

  const escalaBase = AJUSTES_CIRCUNFERENCIA?.escalaFuente || 0.8;
  const tamanoBase = CONFIG_GEOMETRIA.TAMANO_TEXTO * escalaTexto * escalaBase;

  const xs = puntosPivote.map((p) => p[0]);
  const ys = puntosPivote.map((p) => p[1]);
  const limitesX = [...xs, radio, -radio];
  const limitesY = [...ys, radio, -radio];

  const minX = Math.min(...limitesX);
  const maxX = Math.max(...limitesX);
  const minY = Math.min(...limitesY);
  const maxY = Math.max(...limitesY);

  const MARGEN = 1.5;
  const viewBox = {
    x: [minX - MARGEN, maxX + MARGEN] as [number, number],
    y: [minY - MARGEN, maxY + MARGEN] as [number, number],
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

            {lineasAzulesPunteadas.map((seg, idx) => (
              <Line.Segment
                key={`punteado-${idx}`}
                point1={seg.inicio}
                point2={seg.fin}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
                weight={1.0}
                style="dashed"
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

            {arcosVerdes.map((puntosArco, idx) => (
              <Polyline
                key={`arco-${idx}`}
                points={puntosArco}
                color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
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
                  // Si es una ecuación, le ponemos Halo Blanco protector. Si es solo la letra "A", la dejamos limpia.
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
