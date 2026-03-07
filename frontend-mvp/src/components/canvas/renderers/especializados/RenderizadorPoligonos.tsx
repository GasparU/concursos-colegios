import { Polygon, Text, Theme } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";

export const RenderizadorPoligonos = ({ parametros }: { parametros: any }) => {
  const { sides, radius, angles } = parametros;

  const puntos = Array.from({ length: sides }).map((_, i) => {
    const angulo = (i * 2 * Math.PI) / sides;
    return [radius * Math.cos(angulo), radius * Math.sin(angulo)] as [
      number,
      number,
    ];
  });

  return (
    <>
      <Polygon points={puntos} color={Theme.blue} fillOpacity={0.1} />

      {puntos.map((punto, i) => {
        const letra = String.fromCharCode(65 + i);
        return (
          <g key={`vertice-${i}`}>
            {/* Sin Point */}
            <Text
              x={punto[0] * 1.2}
              y={punto[1] * 1.2}
              color={CONFIG_GEOMETRIA.COLOR_TEXTO}
            >
              {letra}
            </Text>
            {angles && (
              <Text
                x={punto[0] * 0.8}
                y={punto[1] * 0.8}
                size={12}
                color={CONFIG_GEOMETRIA.COLOR_TEXTO}
              >
                {Math.round((180 * (sides - 2)) / sides)}°
              </Text>
            )}
          </g>
        );
      })}
    </>
  );
};
