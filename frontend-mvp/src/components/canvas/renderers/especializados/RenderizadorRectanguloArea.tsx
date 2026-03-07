// src/components/canvas/renderers/especializados/RenderizadorRectanguloArea.tsx
import { Mafs, Line } from "mafs";
import { CONFIG_GEOMETRIA, CONFIG_RECTANGULO_AREA } from "./ConstantesVisuales";

interface Props {
  parametros: {
    esquina: [number, number];
    ancho: number;
    alto: number;
  };
}

export const RenderizadorRectanguloArea = ({ parametros }: Props) => {
  const { esquina, ancho, alto } = parametros;
  const [x0, y0] = esquina;

  const vertices: [number, number][] = [
    [x0, y0],
    [x0 + ancho, y0],
    [x0 + ancho, y0 + alto],
    [x0, y0 + alto],
  ];

  const xs = vertices.map((p) => p[0]);
  const ys = vertices.map((p) => p[1]);
  const minX = Math.min(...xs) - CONFIG_RECTANGULO_AREA.VIEWBOX_MARGIN;
  const maxX = Math.max(...xs) + CONFIG_RECTANGULO_AREA.VIEWBOX_MARGIN;
  const minY = Math.min(...ys) - CONFIG_RECTANGULO_AREA.VIEWBOX_MARGIN;
  const maxY = Math.max(...ys) + CONFIG_RECTANGULO_AREA.VIEWBOX_MARGIN;
  const viewBox = {
    x: [minX, maxX] as [number, number],
    y: [minY, maxY] as [number, number],
  };

  return (
    <div className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full">
      <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
        <g>
          {[0, 1, 2, 3].map((i) => (
            <Line.Segment
              key={i}
              point1={vertices[i]}
              point2={vertices[(i + 1) % 4]}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
              weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
            />
          ))}
        </g>
      </Mafs>
    </div>
  );
};
