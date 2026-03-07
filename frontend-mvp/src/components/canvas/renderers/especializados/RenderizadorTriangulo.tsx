import { Mafs, Line, Text } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";

interface TrianguloProps {
  vertices: [number, number][];
  labels?: string[];
  color?: string;
}

export const RenderizadorTriangulo = ({
  vertices,
  labels,
  color = CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL,
}: TrianguloProps) => {
  if (!vertices || vertices.length !== 3) return null;

  const xs = vertices.map((v) => v[0]);
  const ys = vertices.map((v) => v[1]);
  const minX = Math.min(...xs) - CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const maxX = Math.max(...xs) + CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const minY = Math.min(...ys) - CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const maxY = Math.max(...ys) + CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const viewBox = {
    x: [minX, maxX] as [number, number],
    y: [minY, maxY] as [number, number],
  };

  return (
    <Mafs height={300} viewBox={viewBox} pan={false} zoom={false}>
      <g>
        {[0, 1, 2].map((i) => (
          <Line.Segment
            key={i}
            point1={vertices[i]}
            point2={vertices[(i + 1) % 3]}
            color={color}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
          />
        ))}
        {labels &&
          labels.map((label, i) => (
            <Text
              key={i}
              x={vertices[i][0]}
              y={vertices[i][1] - 0.2}
              size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
              color={CONFIG_GEOMETRIA.COLOR_TEXTO}
            >
              {label}
            </Text>
          ))}
      </g>
    </Mafs>
  );
};
