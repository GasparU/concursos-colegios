// src/components/canvas/renderers/especializados/RenderizadorTrianguloCuadradoInscrito.tsx
import { Mafs, Line, Polygon, Text, Point } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";

interface Props {
  parametros: {
    triangulo: [number, number][]; // A, B, C
    cuadrado: [number, number][]; // S, B, P, Q
    baseAC: number;
  };
}

export const RenderizadorTrianguloCuadradoInscrito = ({
  parametros,
}: Props) => {
  if (!parametros || !parametros.triangulo || !parametros.cuadrado) return null;

  const { triangulo, cuadrado, baseAC } = parametros;

  // MOTOR DE NORMALIZACIÓN VISUAL (Auto-Escalado a 10)
  const minXRaw = triangulo[0][0]; // A.x
  const maxXRaw = cuadrado[3][0]; // Q.x
  const anchoTotal = maxXRaw - minXRaw;
  const scale = 10 / anchoTotal;

  const sTri = triangulo.map(
    (v) => [v[0] * scale, v[1] * scale] as [number, number],
  );
  const sCuad = cuadrado.map(
    (v) => [v[0] * scale, v[1] * scale] as [number, number],
  );

  const vertA = sTri[0];
  const vertB = sTri[1];
  const vertC = sTri[2];
  const vertS = sCuad[0];
  const vertP = sCuad[2];
  const vertQ = sCuad[3];

  // SMART BOUNDING BOX
  const padding = 2;
  const viewBox = {
    x: [vertA[0] - padding, Math.max(vertC[0], vertQ[0]) + padding] as [
      number,
      number,
    ],
    y: [-padding - 1.5, vertB[1] + padding] as [number, number], // Extra espacio abajo para la cota
  };

  // return (
  //   <div className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full">
  //     <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
  //       <g>
  //         {/* 🔥 SOMBREADO DEL CUADRADO (Color Relleno Universal) */}
  //         <Polygon
  //           points={sCuad}
  //           color={CONFIG_GEOMETRIA.COLOR_RELLENO_ANGULO}
  //           fillOpacity={CONFIG_GEOMETRIA.OPACIDAD_RELLENO_ANGULO}
  //           weight={0}
  //         />

  //         {/* LÍNEAS DEL CUADRADO (Color y Grosor Universal) */}
  //         {sCuad.map((p, i) => (
  //           <Line.Segment
  //             key={`cuad-${i}`}
  //             point1={p}
  //             point2={sCuad[(i + 1) % 4]}
  //             color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
  //             weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
  //           />
  //         ))}

  //         {/* LÍNEAS DEL TRIÁNGULO (Color y Grosor Universal) */}
  //         {sTri.map((p, i) => (
  //           <Line.Segment
  //             key={`tri-${i}`}
  //             point1={p}
  //             point2={sTri[(i + 1) % 3]}
  //             color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
  //             weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
  //           />
  //         ))}

  //         {/* PUNTOS EN LOS VÉRTICES (Punto Universal) */}
  //         {[vertA, vertB, vertC, vertS, vertP, vertQ].map((pt, i) => (
  //           <Point
  //             key={`pt-${i}`}
  //             x={pt[0]}
  //             y={pt[1]}
  //             color={CONFIG_GEOMETRIA.COLOR_PUNTO}
  //             svgCircleProps={{ r: 4 }}
  //           />
  //         ))}

  //         {/* ETIQUETAS DE TEXTO (Texto Universal) */}
  //         <Text
  //           x={vertA[0] - 0.4}
  //           y={vertA[1] - 0.4}
  //           size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
  //           color={CONFIG_GEOMETRIA.COLOR_TEXTO}
  //         >
  //           A
  //         </Text>
  //         <Text
  //           x={vertB[0]}
  //           y={vertB[1] + 0.5}
  //           size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
  //           color={CONFIG_GEOMETRIA.COLOR_TEXTO}
  //         >
  //           B
  //         </Text>
  //         <Text
  //           x={vertC[0] + 0.4}
  //           y={vertC[1] - 0.4}
  //           size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
  //           color={CONFIG_GEOMETRIA.COLOR_TEXTO}
  //         >
  //           C
  //         </Text>
  //         <Text
  //           x={vertS[0] + 0.3}
  //           y={vertS[1] - 0.5}
  //           size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
  //           color={CONFIG_GEOMETRIA.COLOR_TEXTO}
  //         >
  //           S
  //         </Text>
  //         <Text
  //           x={vertP[0] + 0.4}
  //           y={vertP[1] + 0.4}
  //           size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
  //           color={CONFIG_GEOMETRIA.COLOR_TEXTO}
  //         >
  //           P
  //         </Text>
  //         <Text
  //           x={vertQ[0] + 0.4}
  //           y={vertQ[1] - 0.4}
  //           size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
  //           color={CONFIG_GEOMETRIA.COLOR_TEXTO}
  //         >
  //           Q
  //         </Text>

  //         {/* 🔥 LÍNEA DE MEDICIÓN EN LA BASE (Usando color secundario para distinguirla de la figura) */}
  //         <Line.Segment
  //           point1={[vertA[0], -1.5]}
  //           point2={[vertC[0], -1.5]}
  //           color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
  //           weight={2}
  //         />
  //         <Line.Segment
  //           point1={[vertA[0], -1.2]}
  //           point2={[vertA[0], -1.8]}
  //           color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
  //           weight={2}
  //         />
  //         <Line.Segment
  //           point1={[vertC[0], -1.2]}
  //           point2={[vertC[0], -1.8]}
  //           color={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
  //           weight={2}
  //         />

  //         <Polygon
  //           points={[
  //             [vertS[0] - 1, -1.2],
  //             [vertS[0] + 1, -1.2],
  //             [vertS[0] + 1, -1.8],
  //             [vertS[0] - 1, -1.8],
  //           ]}
  //           color="#ffffff"
  //           fillOpacity={1}
  //           weight={0}
  //         />
  //         <Text
  //           x={vertS[0]}
  //           y={-1.5}
  //           size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
  //           color={CONFIG_GEOMETRIA.COLOR_TEXTO}
  //         >
  //           {`${baseAC} m`}
  //         </Text>
  //       </g>
  //     </Mafs>
  //   </div>
  // );
};
