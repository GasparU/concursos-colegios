import { Line, Text } from "mafs";

interface MeasureProps {
  inicio: [number, number];
  fin: [number, number];
  etiqueta: string;
  // 🔥 AHORA TÚ CONTROLAS TODO ESTO:
  alturaLinea: number; // En qué Y se dibuja la raya verde
  alturaTexto: number; // En qué Y se dibuja el texto (independiente de la línea)
  alturaPatitas: number; // Qué tan altas son las rayitas verticales |---|
  color?: string;
  grosor?: number;
  tamanoTexto?: number;
}

export const MeasureDimension = ({
  inicio,
  fin,
  etiqueta,
  alturaLinea,
  alturaTexto,
  alturaPatitas = 0.3,
  color = "#10b981",
  grosor = 2,
  tamanoTexto = 16,
}: MeasureProps) => {
  const xMedia = (inicio[0] + fin[0]) / 2;

  return (
    <g>
      {/* 1. La Línea Horizontal */}
      <Line.Segment
        point1={[inicio[0], alturaLinea]}
        point2={[fin[0], alturaLinea]}
        color={color}
        weight={grosor}
      />

      {/* 2. Las Patitas Verticales (Ticks) */}
      <Line.Segment
        point1={[inicio[0], alturaLinea - alturaPatitas / 2]}
        point2={[inicio[0], alturaLinea + alturaPatitas / 2]}
        color={color}
        weight={grosor}
      />
      <Line.Segment
        point1={[fin[0], alturaLinea - alturaPatitas / 2]}
        point2={[fin[0], alturaLinea + alturaPatitas / 2]}
        color={color}
        weight={grosor}
      />

      {/* 3. El Texto (Totalmente independiente) */}
      <Text
        x={xMedia}
        y={alturaTexto}
        size={tamanoTexto}
        color={color}
        svgTextProps={{
          textAnchor: "middle",
          dominantBaseline: "middle", // Centrado verticalmente en su punto Y
          fontWeight: "bold",
        }}
      >
        {etiqueta}
      </Text>
    </g>
  );
};
