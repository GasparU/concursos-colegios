import { Mafs, Line, Point, Text, Polygon } from "mafs";
import {
  CONFIG_GEOMETRIA,
  CONFIG_RECTANGULO_DIAGONAL,
} from "./ConstantesVisuales";

interface Props {
  parametros: {
    rectangulo: [number, number][];
    punto: [number, number];
    diagonal: [number, number][];
    pos_p?: number; // 0=Sup, 1=Inf, 2=Der, 3=Izq
  };
}

export const RenderizadorRectanguloPuntoDiagonal = ({ parametros }: Props) => {
  const { rectangulo, punto, diagonal, pos_p = 0 } = parametros;

  if (!rectangulo || rectangulo.length < 4) return null;

  // DEDUCCIÓN AUTOMÁTICA DE VALORES (Solo para Alto y Ancho principales)
  const valAncho = Math.round(rectangulo[1][0] - rectangulo[0][0]);
  const valAlto = Math.round(rectangulo[2][1] - rectangulo[1][1]);

  // MOTOR DE NORMALIZACIÓN VISUAL
  const maxW = Math.max(...rectangulo.map((p) => p[0]));
  const maxH = Math.max(...rectangulo.map((p) => p[1]));
  const maxVal = Math.max(maxW, maxH);
  const scale = 10 / maxVal;

  const sRect = rectangulo.map(
    (v) => [v[0] * scale, v[1] * scale] as [number, number],
  );
  const sPunto = [punto[0] * scale, punto[1] * scale] as [number, number];
  const sDiag = diagonal.map(
    (v) => [v[0] * scale, v[1] * scale] as [number, number],
  );

  const verticeA = sRect[0];
  const verticeC = sRect[2];
  const verticeP = sPunto;

  const config = CONFIG_RECTANGULO_DIAGONAL;
  const pOffset = config.PUNTO_P_OFFSETS[pos_p];

  // SMART BOUNDING BOX
  let minX = 0;
  let maxX = maxW * scale;
  let minY = 0;
  let maxY = maxH * scale;

  sRect.forEach((v, i) => {
    const offset = config.VERTICES[i]?.offset || [0, 0];
    minX = Math.min(minX, v[0] + offset[0] - 0.5);
    maxX = Math.max(maxX, v[0] + offset[0] + 0.5);
    minY = Math.min(minY, v[1] + offset[1] - 0.5);
    maxY = Math.max(maxY, v[1] + offset[1] + 0.5);
  });

  // Expandir cámara por los textos principales de Ancho y Alto
  minY = Math.min(minY, sRect[0][1] + config.LADOS.abajo.offset[1] - 1);
  maxX = Math.max(maxX, sRect[1][0] + config.LADOS.derecha.offset[0] + 1);

  // Expandir cámara solo por la letra P (Ya no por la distancia oculta)
  minX = Math.min(minX, sPunto[0] + pOffset[0] - 1);
  maxX = Math.max(maxX, sPunto[0] + pOffset[0] + 1);
  minY = Math.min(minY, sPunto[1] + pOffset[1] - 1);
  maxY = Math.max(maxY, sPunto[1] + pOffset[1] + 1);

  const padding = config.ZOOM_MARGIN || 1.5;
  const viewBox = {
    x: [minX - padding, maxX + padding] as [number, number],
    y: [minY - padding, maxY + padding] as [number, number],
  };

  const rSize = config.ANGULO_RECTO_TAMANO || 0.6;
  const sAncho = maxW * scale;
  const sAlto = maxH * scale;
  const angulosRectos: [number, number][][] = [
    [
      [0, 0],
      [rSize, 0],
      [rSize, rSize],
      [0, rSize],
    ],
    [
      [sAncho, 0],
      [sAncho - rSize, 0],
      [sAncho - rSize, rSize],
      [sAncho, rSize],
    ],
    [
      [sAncho, sAlto],
      [sAncho - rSize, sAlto],
      [sAncho - rSize, sAlto - rSize],
      [sAncho, sAlto - rSize],
    ],
    [
      [0, sAlto],
      [rSize, sAlto],
      [rSize, sAlto - rSize],
      [0, sAlto - rSize],
    ],
  ];

  return (
    <div className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full">
      <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
        <g>
          {/* ÁREA SOMBREADA */}
          <Polygon
            points={[verticeA, verticeC, verticeP]}
            color={CONFIG_GEOMETRIA.COLOR_RELLENO_ANGULO}
            fillOpacity={CONFIG_GEOMETRIA.OPACIDAD_RELLENO_ANGULO + 0.1}
            weight={0}
          />

          {angulosRectos.map((puntos, idx) => (
            <Polygon
              key={`rect-ang-${idx}`}
              points={puntos}
              color={CONFIG_GEOMETRIA.COLOR_BORDE_ANGULO}
              weight={CONFIG_GEOMETRIA.GROSOR_BORDE_ANGULO}
              fillOpacity={CONFIG_GEOMETRIA.OPACIDAD_RELLENO_ANGULO}
            />
          ))}

          {sRect.map((v, i) => (
            <Line.Segment
              key={`lado-${i}`}
              point1={v}
              point2={sRect[(i + 1) % 4]}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
              weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
            />
          ))}

          <Line.Segment
            point1={sDiag[0]}
            point2={sDiag[1]}
            color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
            style="dashed"
          />

          {/* LÍNEA DE CIERRE DEL TRIÁNGULO */}
          <Line.Segment
            point1={pos_p === 0 || pos_p === 2 ? verticeA : verticeC}
            point2={verticeP}
            color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA - 0.5}
          />

          <Point
            x={sPunto[0]}
            y={sPunto[1]}
            color={config.PUNTO_COLOR}
            svgCircleProps={{ r: config.PUNTO_TAMANO }}
          />

          {/* Textos Ancho y Alto */}
          <Text
            x={sAncho / 2}
            y={config.LADOS.abajo.offset[1]}
            size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
            color={CONFIG_GEOMETRIA.COLOR_TEXTO}
          >
            {valAncho}
          </Text>
          <Text
            x={sAncho + config.LADOS.derecha.offset[0]}
            y={sAlto / 2}
            size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
            color={CONFIG_GEOMETRIA.COLOR_TEXTO}
          >
            {valAlto}
          </Text>

          {/* Etiquetas ABCD y P */}
          {["A", "B", "C", "D"].map((label, i) => {
            const offset = config.VERTICES[i]?.offset || [0, 0];
            return (
              <Text
                key={`label-${i}`}
                x={sRect[i][0] + offset[0]}
                y={sRect[i][1] + offset[1]}
                size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                color={CONFIG_GEOMETRIA.COLOR_TEXTO}
              >
                {label}
              </Text>
            );
          })}
          <Text
            x={sPunto[0] + pOffset[0]}
            y={sPunto[1] + pOffset[1]}
            size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
            color={config.PUNTO_COLOR}
          >
            P
          </Text>
        </g>
      </Mafs>
    </div>
  );
};
