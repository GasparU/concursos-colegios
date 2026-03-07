// src/components/canvas/renderers/especializados/RenderizadorCuadradosSuperpuestos.tsx
import { Mafs, Line, Text, Polygon } from "mafs";
import {
  CONFIG_GEOMETRIA,
  CONFIG_CUADRADOS_SUPERPUESTOS,
} from "./ConstantesVisuales";

interface Props {
  parametros: {
    cuadradoGrande: [number, number][];
    cuadradoPequeno: [number, number][];
    perimetro: number;
  };
}

export const RenderizadorCuadradosSuperpuestos = ({ parametros }: Props) => {
  const { cuadradoGrande, cuadradoPequeno } = parametros;

  if (!cuadradoGrande || cuadradoGrande.length < 4) return null;

  // 🔥 1. MOTOR DE NORMALIZACIÓN VISUAL (Auto-Escalado a 10)
  const maxW = Math.max(...cuadradoGrande.map((p) => p[0]));
  const scale = 10 / maxW;

  const sGrande = cuadradoGrande.map(
    (v) => [v[0] * scale, v[1] * scale] as [number, number],
  );
  const sPequeno = cuadradoPequeno.map(
    (v) => [v[0] * scale, v[1] * scale] as [number, number],
  );

  const config = CONFIG_CUADRADOS_SUPERPUESTOS;

  // 🔥 2. SMART BOUNDING BOX
  let minX = 0;
  let maxX = 10;
  let minY = 0;
  let maxY = 10;

  // Escanear letras del cuadrado grande para no cortarlas
  sGrande.forEach((v, i) => {
    const offset = config.VERTICES_GRANDE[i]?.offset || [0, 0];
    minX = Math.min(minX, v[0] + offset[0] - 0.5);
    maxX = Math.max(maxX, v[0] + offset[0] + 0.5);
    minY = Math.min(minY, v[1] + offset[1] - 0.5);
    maxY = Math.max(maxY, v[1] + offset[1] + 0.5);
  });

  const padding = config.ZOOM_MARGIN || 1.5;
  const viewBox = {
    x: [minX - padding, maxX + padding] as [number, number],
    y: [minY - padding, maxY + padding] as [number, number],
  };

  return (
    <div className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full">
      <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
        <g>
          {/* 🔥 3. SOMBREADO INTELIGENTE DEL MARCO */}
          {/* Pintamos todo el cuadrado grande de verde... */}
          <Polygon
            points={sGrande}
            color={CONFIG_GEOMETRIA.COLOR_RELLENO_ANGULO}
            fillOpacity={CONFIG_GEOMETRIA.OPACIDAD_RELLENO_ANGULO}
            weight={0}
          />
          {/* ...y "perforamos" el centro pintando el pequeño de blanco puro opaco */}
          <Polygon
            points={sPequeno}
            color="#ffffff"
            fillOpacity={1}
            weight={0}
          />

          {/* Bordes Cuadrado Grande */}
          {sGrande.map((v, i) => (
            <Line.Segment
              key={`g-${i}`}
              point1={v}
              point2={sGrande[(i + 1) % 4]}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
              weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
            />
          ))}

          {/* Bordes Cuadrado Pequeño (El agujero interior) */}
          {sPequeno.map((v, i) => (
            <Line.Segment
              key={`p-${i}`}
              point1={v}
              point2={sPequeno[(i + 1) % 4]}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA} // Usamos el color secundario para diferenciarlo
              weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
            />
          ))}

          {/* Etiquetas Cuadrado Grande (ABCD) */}
          {sGrande.map((v, i) => {
            const conf = config.VERTICES_GRANDE[i];
            return (
              <Text
                key={`label-g-${i}`}
                x={v[0] + conf.offset[0]}
                y={v[1] + conf.offset[1]}
                size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                color={CONFIG_GEOMETRIA.COLOR_TEXTO}
              >
                {conf.id}
              </Text>
            );
          })}

          {/* Etiquetas Cuadrado Pequeño (PQRS) */}
          {sPequeno.map((v, i) => {
            const conf = config.VERTICES_PEQUENO[i];
            return (
              <Text
                key={`label-p-${i}`}
                x={v[0] + conf.offset[0]}
                y={v[1] + conf.offset[1]}
                size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                color={CONFIG_GEOMETRIA.COLOR_TEXTO}
              >
                {conf.id}
              </Text>
            );
          })}
        </g>
      </Mafs>
    </div>
  );
};
