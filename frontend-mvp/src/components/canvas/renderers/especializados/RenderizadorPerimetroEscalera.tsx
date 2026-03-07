import { useState } from "react";
import { Mafs, Text, Polygon } from "mafs";
import {
  CONFIG_GEOMETRIA,
  AJUSTES_PERIMETRO_ESCALERA,
} from "./ConstantesVisuales"; // 🔥 Importamos el ajuste

interface SegmentoVectorial {
  etiqueta: string;
  mx: number;
  my: number;
  nx: number;
  ny: number;
}

interface Props {
  parametros: {
    polPoints: [number, number][];
    segmentos: SegmentoVectorial[];
  };
}

export const RenderizadorPerimetroEscalera = ({ parametros }: Props) => {
  const [escalaTexto, setEscalaTexto] = useState(1);

  if (!parametros || !parametros.polPoints || !parametros.segmentos)
    return null;
  const { polPoints, segmentos } = parametros;

  // 🔥 Leemos la escala base desde las constantes (Fallback a 0.9 por seguridad)
  const escalaBase = AJUSTES_PERIMETRO_ESCALERA?.escalaFuente || 0.9;
  const tamanoBase = CONFIG_GEOMETRIA.TAMANO_TEXTO * escalaTexto * escalaBase;

  // 1. Normalización estricta (Mantiene la figura a escala de 10)
  const todosX = polPoints.map((p) => p[0]);
  const todosY = polPoints.map((p) => p[1]);
  const widthOrig = Math.max(...todosX) - Math.min(...todosX);
  const heightOrig = Math.max(...todosY) - Math.min(...todosY);
  const maxDim = Math.max(widthOrig, heightOrig) || 1;
  const scale = 10 / maxDim;

  const polPointsScaled = polPoints.map(
    (p) => [p[0] * scale, p[1] * scale] as [number, number],
  );

  // 🔥 2. LECTURA DINÁMICA DE DISTANCIAS
  // Ahora el frontend itera sobre el array de Constantes. Si el array no existe, usa 0.75
  const segmentosCalculados = segmentos.map((seg, i) => {
    const PADDING_DINAMICO =
      AJUSTES_PERIMETRO_ESCALERA?.distanciasTexto?.[i] || 0.75;

    return {
      etiqueta: seg.etiqueta,
      etiquetaX: seg.mx * scale + seg.nx * PADDING_DINAMICO,
      etiquetaY: seg.my * scale + seg.ny * PADDING_DINAMICO,
    };
  });

  // 3. Viewbox Dinámico Inteligente (Encuadra los textos automáticamente)
  const limitesX = [
    ...polPointsScaled.map((p) => p[0]),
    ...segmentosCalculados.map((s) => s.etiquetaX),
  ];
  const limitesY = [
    ...polPointsScaled.map((p) => p[1]),
    ...segmentosCalculados.map((s) => s.etiquetaY),
  ];

  const minX = Math.min(...limitesX);
  const maxX = Math.max(...limitesX);
  const minY = Math.min(...limitesY);
  const maxY = Math.max(...limitesY);

  const MARGEN = 1.0;
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

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-2 h-[340px]">
        <Mafs height={330} viewBox={viewBox} pan={false} zoom={false}>
          <g>
            <Polygon
              points={polPointsScaled}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
              fillOpacity={0.1}
              weight={2.5}
            />

            {segmentosCalculados.map((seg, i) => (
              <Text
                key={`txt-${i}`}
                x={seg.etiquetaX}
                y={seg.etiquetaY}
                size={tamanoBase}
                color="#000000"
                svgTextProps={{
                  fontWeight: "600",
                  textAnchor: "middle",
                  dominantBaseline: "middle",
                }}
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
