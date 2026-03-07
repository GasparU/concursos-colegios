import { Mafs, Line, Text } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";

interface CuboProps {
  puntos: [number, number][]; // 8 puntos
  color?: string;
}

export const RenderizadorCubo = ({
  puntos,
  color = CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL,
}: CuboProps) => {
  if (!puntos || puntos.length !== 8) return null;
  const front = puntos.slice(0, 4);
  const back = puntos.slice(4, 8);

  // Calcular viewBox
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
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
        {/* Cara frontal */}
        {front.map((p, i) => (
          <Line.Segment
            key={`f-${i}`}
            point1={p}
            point2={front[(i + 1) % 4]}
            color={color}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
          />
        ))}
        {/* Cara trasera */}
        {back.map((p, i) => (
          <Line.Segment
            key={`b-${i}`}
            point1={p}
            point2={back[(i + 1) % 4]}
            color={color}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
          />
        ))}
        {/* Aristas de profundidad */}
        {front.map((p, i) => (
          <Line.Segment
            key={`fb-${i}`}
            point1={p}
            point2={back[i]}
            color={color}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
            style={i >= 2 ? "dashed" : undefined}
          />
        ))}
        {/* Etiquetas */}
        <Text
          x={front[0][0] - 0.2}
          y={front[0][1] - 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          A
        </Text>
        <Text
          x={front[1][0] + 0.2}
          y={front[1][1] - 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          B
        </Text>
        <Text
          x={front[2][0] + 0.2}
          y={front[2][1] + 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          C
        </Text>
        <Text
          x={front[3][0] - 0.2}
          y={front[3][1] + 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          D
        </Text>
        <Text
          x={back[0][0] - 0.2}
          y={back[0][1] - 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          E
        </Text>
        <Text
          x={back[1][0] + 0.2}
          y={back[1][1] - 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          F
        </Text>
        <Text
          x={back[2][0] + 0.2}
          y={back[2][1] + 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          G
        </Text>
        <Text
          x={back[3][0] - 0.2}
          y={back[3][1] + 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          H
        </Text>
      </g>
    </Mafs>
  );
};
