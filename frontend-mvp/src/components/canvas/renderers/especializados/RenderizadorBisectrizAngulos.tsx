// src/components/canvas/renderers/especializados/RenderizadorBisectrizAngulos.tsx
import { Mafs, Line, Text, Point } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";
import { ArcoAngulo } from "./ArcoAngulo";

interface Props {
  parametros: {
    centro: [number, number];
    rayos: { angulo: number; etiqueta: string }[];
    angulo_entre: number;
  };
}

export const RenderizadorBisectrizAngulos = ({ parametros }: Props) => {
  const { centro, rayos, angulo_entre } = parametros;
  const radio = 2; // longitud de los rayos

  // Generar puntos finales de cada rayo
  const puntosRayos = rayos.map((r) => {
    const rad = (r.angulo * Math.PI) / 180;
    return [
      centro[0] + radio * Math.cos(rad),
      centro[1] + radio * Math.sin(rad),
    ] as [number, number];
  });

  // Recolectar puntos para viewBox
  const todosPuntos = [centro, ...puntosRayos];
  const xs = todosPuntos.map((p) => p[0]);
  const ys = todosPuntos.map((p) => p[1]);
  const minX = Math.min(...xs) - CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const maxX = Math.max(...xs) + CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const minY = Math.min(...ys) - CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const maxY = Math.max(...ys) + CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const viewBox = {
    x: [minX, maxX] as [number, number],
    y: [minY, maxY] as [number, number],
  };

  return (
    <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
      <g>
        {/* Dibujar rayos */}
        {rayos.map((r, i) => (
          <Line.Segment
            key={`rayo-${i}`}
            point1={centro}
            point2={puntosRayos[i]}
            color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
          />
        ))}

        {/* Arco para el ángulo entre dos primeros rayos (suponemos que son OA y OB) */}
        {rayos.length >= 2 && (
          <ArcoAngulo
            centro={centro}
            startAngle={rayos[0].angulo}
            endAngle={rayos[1].angulo}
            radio={0.8}
            colorBorde={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
          />
        )}

        {/* Etiquetas de los rayos */}
        {rayos.map((r, i) => (
          <Text
            key={`label-${i}`}
            x={puntosRayos[i][0] * 1.1}
            y={puntosRayos[i][1] * 1.1}
            size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
            color={CONFIG_GEOMETRIA.COLOR_TEXTO}
          >
            {r.etiqueta}
          </Text>
        ))}

        {/* Mostrar el valor del ángulo entre OM y OB si se desea */}
        <Text
          x={centro[0] + 0.5}
          y={centro[1] + 0.5}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          {angulo_entre}°
        </Text>
      </g>
    </Mafs>
  );
};
