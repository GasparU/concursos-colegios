// src/components/canvas/renderers/especializados/RenderizadorRegionesCompuestas.tsx
import { Mafs, Line, Text, Polygon } from "mafs";
import {
  CONFIG_GEOMETRIA,
  CONFIG_REGIONES_COMPUESTAS,
} from "./ConstantesVisuales";

interface RegionArea {
  puntos: [number, number][];
  texto: string;
  cx: number;
  cy: number;
}

interface Props {
  parametros: {
    rectangulo: [number, number][]; // A, B, C, D
    trianguloAMN: [number, number][]; // A, M, N
    regiones: RegionArea[]; // Las 3 áreas sobrantes
  };
}

export const RenderizadorRegionesCompuestas = ({ parametros }: Props) => {
  if (!parametros || !parametros.rectangulo || !parametros.regiones)
    return null;

  const { rectangulo, trianguloAMN, regiones } = parametros;

  // 🔥 1. MOTOR DE NORMALIZACIÓN VISUAL (Auto-Escalado a 10)
  const maxW = Math.max(...rectangulo.map((p) => p[0]));
  const scale = 10 / maxW;

  const sRect = rectangulo.map(
    (v) => [v[0] * scale, v[1] * scale] as [number, number],
  );
  const sTriAMN = trianguloAMN.map(
    (v) => [v[0] * scale, v[1] * scale] as [number, number],
  );

  const sRegiones = regiones.map((r) => ({
    ...r,
    puntos: r.puntos.map(
      (v) => [v[0] * scale, v[1] * scale] as [number, number],
    ),
    cx: r.cx * scale,
    cy: r.cy * scale,
  }));

  const config = CONFIG_REGIONES_COMPUESTAS;

  // 🔥 2. SMART BOUNDING BOX
  let minX = 0;
  let maxX = maxW * scale;
  let minY = 0;
  let maxY = Math.max(...sRect.map((p) => p[1]));

  const padding = config.ZOOM_MARGIN || 1.5;
  const viewBox = {
    x: [minX - padding, maxX + padding] as [number, number],
    y: [minY - padding, maxY + padding] as [number, number],
  };

  return (
    <div className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full">
      <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
        <g>
          {/* 🔥 3. DIBUJAMOS LAS 3 REGIONES SOMBREADAS */}
          {sRegiones.map((reg, i) => (
            <g key={`region-${i}`}>
              <Polygon
                points={reg.puntos}
                color={CONFIG_GEOMETRIA.COLOR_RELLENO_ANGULO}
                fillOpacity={CONFIG_GEOMETRIA.OPACIDAD_RELLENO_ANGULO}
                weight={0}
              />
              <Text
                x={reg.cx}
                y={reg.cy}
                size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                color={CONFIG_GEOMETRIA.COLOR_TEXTO}
              >
                {reg.texto}
              </Text>
            </g>
          ))}

          {/* El triángulo AMN queda en blanco por defecto al no pintarlo */}

          {/* BORDES DEL RECTÁNGULO (Azul universal) */}
          {sRect.map((v, i) => (
            <Line.Segment
              key={`lado-${i}`}
              point1={v}
              point2={sRect[(i + 1) % 4]}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
              weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
            />
          ))}

          {/* BORDES DEL TRIÁNGULO AMN (Líneas internas) */}
          {sTriAMN.map((v, i) => (
            <Line.Segment
              key={`tri-${i}`}
              point1={v}
              point2={sTriAMN[(i + 1) % 3]}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
              weight={CONFIG_GEOMETRIA.GROSOR_LINEA - 0.5} // Un poco más finas para las líneas internas
            />
          ))}

          {/* ETIQUETAS DE LOS VÉRTICES DEL RECTÁNGULO (A, B, C, D) */}
          {sRect.map((v, i) => {
            const offset = config.VERTICES[i]?.offset || [0, 0];
            return (
              <Text
                key={`label-rect-${i}`}
                x={v[0] + offset[0]}
                y={v[1] + offset[1]}
                size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                color={CONFIG_GEOMETRIA.COLOR_TEXTO}
              >
                {config.VERTICES[i].id}
              </Text>
            );
          })}

          {/* ETIQUETAS DE LOS PUNTOS M y N */}
          <Text
            x={sTriAMN[1][0] + config.PUNTOS_EXTRA[0].offset[0]}
            y={sTriAMN[1][1] + config.PUNTOS_EXTRA[0].offset[1]}
            size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
            color={CONFIG_GEOMETRIA.COLOR_TEXTO}
          >
            M
          </Text>
          <Text
            x={sTriAMN[2][0] + config.PUNTOS_EXTRA[1].offset[0]}
            y={sTriAMN[2][1] + config.PUNTOS_EXTRA[1].offset[1]}
            size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
            color={CONFIG_GEOMETRIA.COLOR_TEXTO}
          >
            N
          </Text>
        </g>
      </Mafs>
    </div>
  );
};
