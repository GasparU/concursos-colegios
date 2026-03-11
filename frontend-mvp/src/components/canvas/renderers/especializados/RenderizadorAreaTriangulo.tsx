import React from "react";
import { Mafs, Polygon, Line, Polyline, Text } from "mafs";

const C = {
  grosorFino: 1.5, 
  sizeAngulo90: 1.0,   
  fontSize: 16,
  auraThickness: 4
};

const RenderHaloText = ({ x, y, children, color = "#1e293b" }: any) => (
  <>
    <Text x={x} y={y} size={C.fontSize} color="white" svgTextProps={{ fontWeight: 600, stroke: "white", strokeWidth: C.auraThickness, strokeLinejoin: "round" }}>
      {children}
    </Text>
    <Text x={x} y={y} size={C.fontSize} color={color} svgTextProps={{ fontWeight: 600 }}>
      {children}
    </Text>
  </>
);

export const RenderizadorAreaTriangulo = ({ parametros }: { parametros: any }) => {
  if (!parametros) return null;

  const { puntos, etiquetas, lineasExtra, poligonosExtra } = parametros;

  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  
  if (puntos) puntos.forEach(([x, y]: [number, number]) => { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; });
  if (lineasExtra) lineasExtra.forEach((linea: any) => linea.puntos.forEach(([x, y]: [number, number]) => { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }));
  if (poligonosExtra) poligonosExtra.forEach((poli: any) => poli.puntos.forEach(([x, y]: [number, number]) => { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }));

  const boxW = maxX - minX || 1;
  const boxH = maxY - minY || 1;
  const dynamicPadding = Math.max(boxW, boxH) * 0.25; 

  const viewWindow = {
    x: [minX - dynamicPadding, maxX + dynamicPadding] as [number, number],
    y: [minY - dynamicPadding, maxY + dynamicPadding] as [number, number],
  };

  const visualScale = Math.max(boxW, boxH) * 0.08;

  const drawProportional90 = (pts: [number, number][]) => {
    if (pts.length !== 3) return pts;
    const [p0, p1, p2] = pts;
    const vx = p0[0] + p2[0] - p1[0]; const vy = p0[1] + p2[1] - p1[1];
    let d1x = p0[0] - vx; let d1y = p0[1] - vy; let d2x = p2[0] - vx; let d2y = p2[1] - vy;
    const len1 = Math.sqrt(d1x*d1x + d1y*d1y) || 1; const len2 = Math.sqrt(d2x*d2x + d2y*d2y) || 1;
    const finalSize = visualScale * C.sizeAngulo90;
    d1x = (d1x / len1) * finalSize; d1y = (d1y / len1) * finalSize; d2x = (d2x / len2) * finalSize; d2y = (d2y / len2) * finalSize;
    return [[vx + d1x, vy + d1y] as [number, number], [vx + d1x + d2x, vy + d1y + d2y] as [number, number], [vx + d2x, vy + d2y] as [number, number]];
  };

  return (
    <>
      <style>
        {`
          .contenedor-mafs-blanco .MafsView {
            --mafs-bg: transparent !important;
            --mafs-fg: #1e293b !important;
            --mafs-line-dash-style: 6, 6 !important;
          }
        `}
      </style>

      <div className="flex justify-center p-4 bg-white rounded-lg border border-slate-200 mt-4 select-none contenedor-mafs-blanco">
        <Mafs viewBox={viewWindow} pan={false} zoom={false} width={400} height={300}>
          
          {/* POLÍGONOS BASE (Triángulos / Cuadriláteros) */}
          {puntos && puntos.length > 0 && (
            <>
              <Polygon points={puntos} color="#3b82f6" fillOpacity={0.10} weight={0} />
              <Line.Segment point1={puntos[0]} point2={puntos[1]} color="#3b82f6" weight={C.grosorFino} />
              <Line.Segment point1={puntos[1]} point2={puntos[2]} color="#3b82f6" weight={C.grosorFino} />
              <Line.Segment point1={puntos[2]} point2={puntos[0]} color="#3b82f6" weight={C.grosorFino} />
            </>
          )}

          {/* 🔥 MOTOR DE SÓLIDOS 3D (OCLUSIÓN REAL) 🔥 */}
          {poligonosExtra && poligonosExtra.map((poli: any, i: number) => (
            <React.Fragment key={`poli3d-${i}`}>
              {/* Relleno Sólido que TAPA lo de atrás */}
              <Polygon 
                points={poli.puntos} 
                color={poli.color} 
                fillOpacity={1} 
                weight={0} 
              />
              {/* Borde Nítido que define la figura */}
              <Polyline 
                points={[...poli.puntos, poli.puntos[0]]} 
                color={poli.borde || "#1e293b"} 
                weight={1.2} 
              />
            </React.Fragment>
          ))}

          {/* LÍNEAS EXTRA (Bordes de figuras planas, líneas punteadas, etc.) */}
          {lineasExtra && lineasExtra.map((linea: any, i: number) => {
            if (linea.color === "red" || linea.tipo === 'angulo') {
              const pts90 = drawProportional90(linea.puntos);
              return <Polyline key={`90-${i}`} points={pts90} color="#dc2626" weight={C.grosorFino} />;
            } 
            return linea.puntos.map((pActual: any, j: number) => {
              if (j === 0) return null;
              return (
                <Line.Segment 
                  key={`linea-${i}-${j}`} 
                  point1={linea.puntos[j-1]} 
                  point2={pActual} 
                  color={linea.color || "#16a34a"} 
                  style={linea.estilo || "solid"} 
                  weight={linea.weight || C.grosorFino} 
                />
              );
            });
          })}

          {/* ETIQUETAS */}
          {etiquetas && etiquetas.map((etiq: any, i: number) => {
            const realPush = visualScale * 1.5; 
            const fx = etiq.pos[0] + (etiq.dir[0] * realPush);
            const fy = etiq.pos[1] + (etiq.dir[1] * realPush);
            return (
              <RenderHaloText key={`text-${i}`} x={fx} y={fy} color={etiq.tipo === "vertice" ? "#334155" : "#1e293b"}>
                {etiq.texto}
              </RenderHaloText>
            );
          })}
        </Mafs>
      </div>
    </>
  );
};