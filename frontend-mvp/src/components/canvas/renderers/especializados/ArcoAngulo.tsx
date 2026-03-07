// src/components/canvas/elements/ArcoAngulo.tsx
import { Polygon } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";

interface ArcoAnguloProps {
  centro: [number, number];
  radio?: number;
  startAngle: number; // grados
  endAngle: number; // grados
  colorRelleno?: string;
  colorBorde?: string;
  grosorBorde?: number;
  opacity?: number;
}

export const ArcoAngulo = ({
  centro,
  radio = 3,
  startAngle,
  endAngle,
  // 🔥 AÑADE ESTO: Conexión directa a tus Constantes Universales
  colorRelleno = CONFIG_GEOMETRIA.COLOR_RELLENO_ANGULO,
  colorBorde = CONFIG_GEOMETRIA.COLOR_BORDE_ANGULO,
  grosorBorde = CONFIG_GEOMETRIA.GROSOR_BORDE_ANGULO,
  opacity = CONFIG_GEOMETRIA.OPACIDAD_RELLENO_ANGULO,
}: ArcoAnguloProps) => {
  // Construcción matemática del arco para el motor de Mafs
  const points: [number, number][] = [centro];
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const steps = 30; // Suavidad del arco

  for (let i = 0; i <= steps; i++) {
    const t = startRad + (endRad - startRad) * (i / steps);
    points.push([
      centro[0] + radio * Math.cos(t),
      centro[1] + radio * Math.sin(t),
    ]);
  }

  return (
    <Polygon
      points={points}
      color={colorBorde}
      weight={grosorBorde}
      fillOpacity={opacity}
      // 🔥 Forzamos el color de relleno independiente mediante propiedades SVG de React
      svgPolygonProps={{ fill: colorRelleno }}
    />
  );
};
