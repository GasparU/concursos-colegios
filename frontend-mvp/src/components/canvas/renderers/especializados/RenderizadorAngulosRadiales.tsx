// src/components/canvas/renderers/especializados/RenderizadorAngulosRadiales.tsx
import { Mafs, Vector, Text, Plot, Polygon } from "mafs";
import {
  CONFIG_GEOMETRIA,
  CONFIG_ANGULOS_RADIALES,
  AJUSTES_ESPECIFICOS_RADIALES,
} from "./ConstantesVisuales";

interface Rayo {
  angulo: number;
  etiqueta?: string;
  esBisectriz?: boolean;
}

interface Arco {
  inicio: number;
  fin: number;
  etiqueta?: string;
  radio?: number;
  radioTexto?: number;
  offsetXY?: [number, number];
  esRecto?: boolean;
  tamanoTexto?: number;
}

interface Props {
  parametros: {
    idPlantilla: string;
    rayos: Rayo[];
    arcos: Arco[];
    origenEtiqueta?: string;
  };
}

export const RenderizadorAngulosRadiales = ({ parametros }: Props) => {
  if (!parametros || !parametros.rayos) return null;

  const { idPlantilla, arcos, origenEtiqueta = "O" } = parametros;
  const rayosOriginales = parametros.rayos;

  // 🔥 ESCUDO ANTI-SOLAPAMIENTO (FRONTEND):
  // Si dos líneas caen en el mismo sitio (ej. 0° y 360°), une sus etiquetas (A + D = "A / D")
  const rayosProcesados: Rayo[] = [];
  rayosOriginales.forEach((rayo) => {
    const anguloNorm = Math.round(rayo.angulo) % 360;
    const existente = rayosProcesados.find(
      (r) => Math.abs((Math.round(r.angulo) % 360) - anguloNorm) < 1,
    );

    if (
      existente &&
      existente.etiqueta &&
      rayo.etiqueta &&
      existente.etiqueta !== rayo.etiqueta
    ) {
      existente.etiqueta = `${existente.etiqueta} / ${rayo.etiqueta}`;
    } else if (!existente) {
      rayosProcesados.push({ ...rayo });
    }
  });

  const ajustes = AJUSTES_ESPECIFICOS_RADIALES[idPlantilla] || {};
  const config = CONFIG_ANGULOS_RADIALES;

  const rTextoFinal = ajustes.radioTexto || config.RADIO_TEXTO_BASE;

  const viewBox = {
    x: ajustes.viewBoxX || config.VIEWBOX_DEFAULT_X,
    y: ajustes.viewBoxY || config.VIEWBOX_DEFAULT_Y,
  };

  return (
    <div className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-4">
      <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
        <g>
          {/* ARCOS Y ECUACIONES */}
          {arcos.map((arco, i) => {
            const r = arco.radio || config.RADIO_ARCO_BASE;
            const offsetManual = ajustes.offsets
              ? ajustes.offsets[i] || [0, 0]
              : config.OFFSET_TEXTOS_ARCOS[i] || [0, 0];

            const tMinDeg = Math.min(arco.inicio, arco.fin);
            const tMaxDeg = Math.max(arco.inicio, arco.fin);
            const tMin = (tMinDeg * Math.PI) / 180;
            const tMax = (tMaxDeg * Math.PI) / 180;

            if (arco.esRecto) {
              const rRect = 0.6;
              const p1 = [rRect * Math.cos(tMin), rRect * Math.sin(tMin)] as [
                number,
                number,
              ];
              const p2 = [rRect * Math.cos(tMax), rRect * Math.sin(tMax)] as [
                number,
                number,
              ];
              const pCorner = [p1[0] + p2[0], p1[1] + p2[1]] as [
                number,
                number,
              ];
              return (
                <Polygon
                  key={`recto-${i}`}
                  points={[[0, 0], p1, pCorner, p2]}
                  color="#ef4444"
                  fillOpacity={1}
                  weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
                />
              );
            }

            let medioDeg = (arco.inicio + arco.fin) / 2;
            if (Math.abs(arco.inicio - arco.fin) > 180) medioDeg += 180;
            const medioRad = (medioDeg * Math.PI) / 180;

            const textX = rTextoFinal * Math.cos(medioRad) + offsetManual[0];
            const textY = rTextoFinal * Math.sin(medioRad) + offsetManual[1];

            // LÓGICA DE COLOR INTELIGENTE Y TAMAÑO
            const esEcuacion = arco.etiqueta
              ? arco.etiqueta.includes("x") || arco.etiqueta.includes("y")
              : false;
            const colorDinamico = esEcuacion
              ? CONFIG_GEOMETRIA.COLOR_TEXTO
              : CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA;

            const tamanoBase =
              arco.tamanoTexto || CONFIG_GEOMETRIA.TAMANO_TEXTO || 16;
            const tamanoDinamico = esEcuacion ? tamanoBase * 0.85 : tamanoBase;

            return (
              <g key={`arco-group-${i}`}>
                <Plot.Parametric
                  t={[tMin, tMax]}
                  xy={(t) => [r * Math.cos(t), r * Math.sin(t)]}
                  color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
                  weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
                />
                {arco.etiqueta && (
                  <Text
                    x={textX}
                    y={textY}
                    size={tamanoDinamico}
                    color={colorDinamico}
                    svgTextProps={{
                      fontWeight: "bold",
                      stroke: "#ffffff",
                      strokeWidth: 6,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      paintOrder: "stroke fill",
                    }}
                  >
                    {arco.etiqueta}
                  </Text>
                )}
              </g>
            );
          })}

          {/* RAYOS PROCESADOS (SIN SOLAPAMIENTOS) */}
          {rayosProcesados.map((rayo, i) => {
            const rad = (rayo.angulo * Math.PI) / 180;
            const puntaX = config.LONGITUD_RAYO * Math.cos(rad);
            const puntaY = config.LONGITUD_RAYO * Math.sin(rad);

            const factorEtiqueta =
              ajustes.offsetEtiqueta || config.OFFSET_ETIQUETA;
            const textX = config.LONGITUD_RAYO * factorEtiqueta * Math.cos(rad);
            const textY = config.LONGITUD_RAYO * factorEtiqueta * Math.sin(rad);

            return (
              <g key={`rayo-${i}`}>
                <Vector
                  tail={[0, 0]}
                  tip={[puntaX, puntaY]}
                  color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
                  weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
                  style={rayo.esBisectriz ? "dashed" : "solid"}
                />
                {rayo.etiqueta && (
                  <Text
                    x={textX}
                    y={textY}
                    size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                    color={CONFIG_GEOMETRIA.COLOR_TEXTO}
                    svgTextProps={{
                      fontWeight: "bold",
                      stroke: "#ffffff",
                      strokeWidth: 4,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      paintOrder: "stroke fill",
                    }}
                  >
                    {rayo.etiqueta}
                  </Text>
                )}
              </g>
            );
          })}

          {/* ORIGEN O */}
          <Text
            x={config.OFFSET_ORIGEN[0]}
            y={config.OFFSET_ORIGEN[1]}
            size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
            color={CONFIG_GEOMETRIA.COLOR_TEXTO}
            svgTextProps={{
              fontWeight: "bold",
              stroke: "#ffffff",
              strokeWidth: 4,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              paintOrder: "stroke fill",
            }}
          >
            {origenEtiqueta}
          </Text>
        </g>
      </Mafs>
    </div>
  );
};
