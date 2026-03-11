import React from "react";
import { Mafs, Coordinates, Polygon, Line, Polyline, Text } from "mafs";

// 🔥 DIALES DE DISEÑO (Ajústalos aquí si lo ves grande/pequeño) 🔥
const C = {
  grosorFino: 1.2,
  grosorPunteado: 1.2,
  sizeAngulo90: 1.2,     // Escala del cuadradito de 90°. (1.2 es ideal, pon 1.5 si lo quieres gigante)
  
  // EMPUJE DE TEXTOS: Si se ven muy pegados, sube estos números a 1.8 o 2.0
  pushText: 1.6,         // Separación de los números de las líneas
  
  fontSize: 18, // Tamaño de letra más sobrio
  auraThickness: 3 // "Halo" blanco fino
};

// 🔥 AURA BLANCA ELEGANTE Y FINA 🔥
const RenderHaloText = ({ x, y, children, size = 18, color = "#1e293b" }: any) => (
  <>
    {/* Contorno blanco fino para limpiar líneas sin verse tosco */}
    <Text x={x} y={y} size={size} color="white" svgTextProps={{ fontWeight: 600, stroke: "white", strokeWidth: C.auraThickness, strokeLinejoin: "round" }}>
      {children}
    </Text>
    {/* Texto real */}
    <Text x={x} y={y} size={size} color={color} svgTextProps={{ fontWeight: 600 }}>
      {children}
    </Text>
  </>
);

export const RenderizadorAreaTriangulo = ({ parametros }: { parametros: any }) => {
  if (!parametros || !parametros.puntos) return null;

  const { puntos, etiquetas, lineasExtra } = parametros;

  // 🔥 ESCALADO DINÁMICO VECTORIAL PERFECTO 🔥
  // Calculamos la caja delimitadora (bounding box) de TODO lo que se dibuja
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  
  // Incluimos vértices del triángulo
  puntos.forEach(([x, y]: [number, number]) => {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  });
  
  // Incluimos líneas punteadas y ángulo
  if (lineasExtra) {
    lineasExtra.forEach((linea: any) => linea.puntos.forEach(([x, y]: [number, number]) => {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }));
  }
  
  // Incluimos etiquetas (usamos la posición base y aplicamos un push estimado para la cámara)
  if (etiquetas) {
    etiquetas.forEach((etiq: any) => {
      // Un push estimado de 2 unidades para que la cámara lo contenga
      const ex = etiq.pos[0] + etiq.dir[0] * 2;
      const ey = etiq.pos[1] + etiq.dir[1] * 2;
      if (ex < minX) minX = ex; if (ex > maxX) maxX = ex;
      if (ey < minY) minY = ey; if (ey > maxY) maxY = ey;
    });
  }

  // Calculamos ancho y alto del bounding box
  const boxW = maxX - minX;
  const boxH = maxY - minY;
  
  // Calculamos el padding dinámico proporcional (20% de las dimensiones)
  // para que siempre haya aire alrededor sin importar el tamaño real.
  // Escogemos el máximo para asegurar proporcionalidad.
  const dynamicPadding = Math.max(boxW * 0.20, boxH * 0.20);

  const viewWindow = {
    x: [minX - dynamicPadding, maxX + dynamicPadding] as [number, number],
    y: [minY - dynamicPadding, maxY + dynamicPadding] as [number, number],
  };

  // Ajuste de tamaño del ángulo 90° dinámico
  const draw90 = (p: [number, number][]) => p.map(([x, y]) => [x * C.sizeAngulo90, y * C.sizeAngulo90] as [number, number]);

  return (
    <div className="flex justify-center p-4 bg-white rounded-lg border border-slate-200 mt-4 select-none">
      <Mafs viewBox={viewWindow} pan={false} zoom={false} width={400} height={300}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 1 }} />
        
        {/* Relleno Azulito sutil */}
        <Polygon points={puntos} color="#3b82f6" fillOpacity={0.10} weight={C.grosorFino} />

        {/* Líneas Extra y Ángulo 90 escalable */}
        {lineasExtra && lineasExtra.map((linea: any, i: number) => {
          if (linea.color === "red") {
            // 🔥 FIX ÁNGULO 90: Polyline escalada desde el vértice (0,0) - Toca perfecto.
            const pts90 = draw90(linea.puntos);
            return <Polyline key={`90-${i}`} points={pts90} color="#dc2626" weight={C.grosorFino} />;
          } 
          // Alturas verdes punteadas
          return linea.puntos.map((pActual: any, j: number) => {
            if (j === 0) return null;
            return <Line.Segment key={`h-${i}-${j}`} point1={linea.puntos[j-1]} point2={pActual} color="#16a34a" style="dashed" weight={C.grosorFino} />;
          });
        })}

        {/* Textos con Empuje Vectorial Perfectamente escalado */}
        {etiquetas && etiquetas.map((etiq: any, i: number) => {
          // Usamos el vector de dirección (dir) que viene del backend y multiplicamos por el push dial
          const fx = etiq.pos[0] + (etiq.dir[0] * C.pushText);
          const fy = etiq.pos[1] + (etiq.dir[1] * C.pushText);
          
          return (
            <RenderHaloText key={`text-${i}`} x={fx} y={fy} size={C.fontSize} color="#1e293b">
              {etiq.texto}
            </RenderHaloText>
          );
        })}
      </Mafs>
    </div>
  );
};