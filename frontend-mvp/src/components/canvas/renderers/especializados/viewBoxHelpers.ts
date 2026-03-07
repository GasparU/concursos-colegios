// src/components/canvas/elements/viewBoxHelpers.ts
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";

export const calcularViewBox = (
  puntos: [number, number][],
  margen: number = CONFIG_GEOMETRIA.MARGEN_VIEWBOX,
): { x: [number, number]; y: [number, number] } => {
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  const minX = Math.min(...xs) - margen;
  const maxX = Math.max(...xs) + margen;
  const minY = Math.min(...ys) - margen;
  const maxY = Math.max(...ys) + margen;
  return {
    x: [minX, maxX] as [number, number],
    y: [minY, maxY] as [number, number],
  };
};
