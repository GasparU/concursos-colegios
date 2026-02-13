import { Polygon, Point, Text, Theme } from "mafs";

export const RenderizadorPoligonos = ({ parametros }: { parametros: any }) => {
  // Eliminamos variables no usadas (side_expression, x_value si no se usan en el render)
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
            <Point x={punto[0]} y={punto[1]} />
            <Text x={punto[0] * 1.2} y={punto[1] * 1.2}>
              {letra}
            </Text>
            {angles && (
              <Text x={punto[0] * 0.8} y={punto[1] * 0.8} size={12}>
                {Math.round((180 * (sides - 2)) / sides)}°
              </Text>
            )}
          </g>
        );
      })}
    </>
  );
};
