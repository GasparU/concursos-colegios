import { Point, Text, Theme, Vector } from "mafs";

export const RenderizadorAngulos = ({ parametros }: { parametros: any }) => {
  const {
    vertex,
    rays, // Mantenemos rays porque abajo seguro usas .map
    x_value,
  } = parametros;
  let anguloAcumulado = 0;

  return (
    <>
      <Point x={0} y={0} />
      <Text x={0} y={-0.5} attach="n">
        {vertex?.label || "O"}
      </Text>

      {/* Corregido: tail y tip */}
      <Vector tail={[0, 0]} tip={[5, 0]} color={Theme.foreground} />

      {rays.map((rayo: any, indice: number) => {
        const valorAngulo =
          parseFloat(rayo.coef) * parseFloat(x_value) + parseFloat(rayo.const);
        anguloAcumulado += valorAngulo;

        const radianes = (anguloAcumulado * Math.PI) / 180;
        const xFinal = 5 * Math.cos(radianes);
        const yFinal = 5 * Math.sin(radianes);

        const radianesEtiqueta =
          ((anguloAcumulado - valorAngulo / 2) * Math.PI) / 180;
        const xEtiqueta = 3 * Math.cos(radianesEtiqueta);
        const yEtiqueta = 3 * Math.sin(radianesEtiqueta);

        return (
          <g key={`rayo-${indice}`}>
            <Vector tail={[0, 0]} tip={[xFinal, yFinal]} color={Theme.blue} />

            <Text x={xFinal * 1.1} y={yFinal * 1.1} size={14}>
              {rayo.pointLabel}
            </Text>

            <Text x={xEtiqueta} y={yEtiqueta} size={16} color={Theme.blue}>
              {rayo.angleLabel}
            </Text>
          </g>
        );
      })}
    </>
  );
};
