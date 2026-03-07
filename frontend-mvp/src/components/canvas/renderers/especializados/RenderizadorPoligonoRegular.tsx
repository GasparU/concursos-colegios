import { Mafs, Line, Text } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";

interface PoligonoRegularProps {
  lados: number;
  radio: number;
  centro?: [number, number];
  labels?: string[];
  color?: string;
}

export const RenderizadorPoligonoRegular = ({
  lados,
  radio,
  centro = [0, 0],
  labels,
  color = CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL,
}: PoligonoRegularProps) => {
  const puntos: [number, number][] = [];
  for (let i = 0; i < lados; i++) {
    const ang = (2 * Math.PI * i) / lados - Math.PI / 2; // empezar arriba
    puntos.push([
      centro[0] + radio * Math.cos(ang),
      centro[1] + radio * Math.sin(ang),
    ]);
  }

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
        {puntos.map((p, i) => (
          <Line.Segment
            key={i}
            point1={p}
            point2={puntos[(i + 1) % lados]}
            color={color}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
          />
        ))}
        {labels &&
          labels.map((label, i) => (
            <Text
              key={i}
              x={puntos[i][0]}
              y={puntos[i][1] - 0.3}
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
