import { Mafs, Line, Text } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";

export const RenderizadorSimetria = () => {
  const puntos: [number, number][] = [
    [0, 0],
    [4, 0],
    [2, 3],
  ];
  const eje: [number, number][] = [
    [2, -1],
    [2, 4],
  ];

  const xs = puntos.map((p) => p[0]).concat(eje.map((p) => p[0]));
  const ys = puntos.map((p) => p[1]).concat(eje.map((p) => p[1]));
  const minX = Math.min(...xs) - 1;
  const maxX = Math.max(...xs) + 1;
  const minY = Math.min(...ys) - 1;
  const maxY = Math.max(...ys) + 1;
  const viewBox = {
    x: [minX, maxX] as [number, number],
    y: [minY, maxY] as [number, number],
  };

  return (
    <Mafs height={300} viewBox={viewBox} pan={false} zoom={false}>
      <g>
        <Line.Segment
          point1={puntos[0]}
          point2={puntos[1]}
          color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
          weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
        />
        <Line.Segment
          point1={puntos[1]}
          point2={puntos[2]}
          color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
          weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
        />
        <Line.Segment
          point1={puntos[2]}
          point2={puntos[0]}
          color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
          weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
        />
        <Line.Segment
          point1={eje[0]}
          point2={eje[1]}
          color="red"
          weight={2}
          style="dashed"
        />
        <Text
          x={puntos[0][0] - 0.2}
          y={puntos[0][1] - 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          A
        </Text>
        <Text
          x={puntos[1][0] + 0.2}
          y={puntos[1][1] - 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          B
        </Text>
        <Text
          x={puntos[2][0]}
          y={puntos[2][1] + 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          C
        </Text>
      </g>
    </Mafs>
  );
};
