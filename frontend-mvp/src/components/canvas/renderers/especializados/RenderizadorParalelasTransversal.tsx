import { Mafs, Line, Text } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";
import { ArcoAngulo } from "./ArcoAngulo";

interface ParalelasTransversalProps {
  paralelas: { y1: number; y2: number };
  transversal: { pendiente: number; intercepto: number };
  angulos?: {
    centro: [number, number];
    inicio: number;
    fin: number;
    etiqueta?: string;
  }[];
}

export const RenderizadorParalelasTransversal = ({
  paralelas,
  transversal,
  angulos,
}: ParalelasTransversalProps) => {
  const xMin = -5;
  const xMax = 5;

  const interseccion1: [number, number] = [
    (paralelas.y1 - transversal.intercepto) / transversal.pendiente,
    paralelas.y1,
  ];
  const interseccion2: [number, number] = [
    (paralelas.y2 - transversal.intercepto) / transversal.pendiente,
    paralelas.y2,
  ];

  const puntos = [
    [xMin, paralelas.y1],
    [xMax, paralelas.y1],
    [xMin, paralelas.y2],
    [xMax, paralelas.y2],
    interseccion1,
    interseccion2,
    ...(angulos?.map((a) => a.centro) || []),
  ];
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
        <Line.Segment
          point1={[xMin, paralelas.y1]}
          point2={[xMax, paralelas.y1]}
          color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
          weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
        />
        <Line.Segment
          point1={[xMin, paralelas.y2]}
          point2={[xMax, paralelas.y2]}
          color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
          weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
        />
        <Line.Segment
          point1={[xMin, transversal.pendiente * xMin + transversal.intercepto]}
          point2={[xMax, transversal.pendiente * xMax + transversal.intercepto]}
          color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
          weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
        />

        <Text
          x={xMax + 0.2}
          y={paralelas.y1}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          L1
        </Text>
        <Text
          x={xMax + 0.2}
          y={paralelas.y2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          L2
        </Text>

        {angulos?.map((a, i) => (
          <g key={`ang-${i}`}>
            <ArcoAngulo
              centro={a.centro}
              startAngle={a.inicio}
              endAngle={a.fin}
              radio={0.8}
              colorBorde={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
            />
            {a.etiqueta && (
              <Text
                x={
                  a.centro[0] +
                  1.2 * Math.cos((((a.inicio + a.fin) / 2) * Math.PI) / 180)
                }
                y={
                  a.centro[1] +
                  1.2 * Math.sin((((a.inicio + a.fin) / 2) * Math.PI) / 180)
                }
                size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                color={CONFIG_GEOMETRIA.COLOR_TEXTO}
              >
                {a.etiqueta}
              </Text>
            )}
          </g>
        ))}
      </g>
    </Mafs>
  );
};
