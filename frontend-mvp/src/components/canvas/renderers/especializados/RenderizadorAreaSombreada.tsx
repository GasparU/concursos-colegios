// src/components/canvas/renderers/especializados/RenderizadorAreaSombreada.tsx
import { Mafs, Polygon, Ellipse, Line, Text, Plot } from "mafs";
import { CONFIG_GEOMETRIA, ESTILO_HALO_ROBUSTO } from "./ConstantesVisuales";

export const RenderizadorAreaSombreada = ({ parametros }: any) => {
  if (!parametros) return null;

  // 🔥 1. AUTO-ESCALADO INTELIGENTE
  let allXs: number[] = [];
  let allYs: number[] = [];
  const addPts = (pts: [number, number][]) =>
    pts.forEach((p) => {
      allXs.push(p[0]);
      allYs.push(p[1]);
    });

  parametros.poligonosBase?.forEach(addPts);
  parametros.poligonosHueco?.forEach(addPts);
  parametros.parchesBase?.forEach(addPts);
  parametros.parchesLineas?.forEach(addPts);
  parametros.circulosBase?.forEach((c: any) => {
    allXs.push(c.centro[0] + c.r, c.centro[0] - c.r);
    allYs.push(c.centro[1] + c.r, c.centro[1] - c.r);
  });
  parametros.lineas?.forEach((l: any) => {
    allXs.push(l.p1[0], l.p2[0]);
    allYs.push(l.p1[1], l.p2[1]);
  });
  parametros.etiquetas?.forEach((e: any) => {
    allXs.push(e.pos[0]);
    allYs.push(e.pos[1]);
  });

  if (allXs.length === 0) {
    allXs = [0, 10];
    allYs = [0, 10];
  }
  const padding = 2.5;
  const viewBox = {
    x: [Math.min(...allXs) - padding, Math.max(...allXs) + padding] as [
      number,
      number,
    ],
    y: [Math.min(...allYs) - padding, Math.max(...allYs) + padding] as [
      number,
      number,
    ],
  };

  // 🔥 2. PALETA GEOMÉTRICA (100% FRONTEND)
  const colorFill = "#bae6fd"; // Celeste sólido (sky-200)
  const colorStroke = CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL; // Azul oscuro
  const colorResalte = "#ef4444"; // Rojo (para distancias o alturas clave)
  const colorAngulo = "#16a34a"; // Verde
  const strokeW = CONFIG_GEOMETRIA.GROSOR_LINEA;

  return (
    <div className="flex flex-col items-center w-full bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <Mafs height={350} viewBox={viewBox} pan={false} zoom={false}>
        {/* CAPA 1: FONDOS (Donas transparentes y polígonos sólidos) */}
        {parametros.poligonosBase?.map((pts: any, i: number) => (
          <Polygon
            key={`pb-${i}`}
            points={pts}
            color={colorFill}
            fillOpacity={1}
            weight={0}
          />
        ))}
        {parametros.circulosBase?.map((c: any, i: number) => (
          <Ellipse
            key={`cb-${i}`}
            center={c.centro}
            radius={[c.r, c.r]}
            color={colorFill}
            fillOpacity={1}
            weight={0}
          />
        ))}

        {/* CAPA 2: RECORTES (Para figuras básicas que sí necesitan huecos blancos) */}
        {parametros.poligonosHueco?.map((pts: any, i: number) => (
          <Polygon
            key={`ph-${i}`}
            points={pts}
            color="#ffffff"
            fillOpacity={1}
            weight={0}
          />
        ))}
        {parametros.circulosHueco?.map((c: any, i: number) => (
          <Ellipse
            key={`ch-${i}`}
            center={c.centro}
            radius={[c.r, c.r]}
            color="#ffffff"
            fillOpacity={1}
            weight={0}
          />
        ))}

        {/* CAPA 3: BORDES AZULES */}
        {parametros.poligonosBorde?.map((pts: any, i: number) => (
          <Polygon
            key={`pbo-${i}`}
            points={pts}
            color={colorStroke}
            fillOpacity={0}
            weight={strokeW}
          />
        ))}
        {parametros.circulosBorde?.map((c: any, i: number) => (
          <Ellipse
            key={`cbo-${i}`}
            center={c.centro}
            radius={[c.r, c.r]}
            color={colorStroke}
            fillOpacity={0}
            weight={strokeW}
          />
        ))}

        {/* CAPA 4: PARCHES 3D (Cadenas entrelazadas) */}
        {parametros.parchesBase?.map((pts: any, i: number) => (
          <Polygon
            key={`pchb-${i}`}
            points={pts}
            color={colorFill}
            fillOpacity={1}
            weight={0}
          />
        ))}
        {parametros.parchesLineas?.map((pts: any, i: number) => (
          <Line.Segment
            key={`pchl-${i}`}
            point1={pts[0]}
            point2={pts[1]}
            color={colorStroke}
            weight={strokeW}
          />
        ))}
        {parametros.parchesArcos?.map((a: any, i: number) => (
          <Plot.Parametric
            key={`pcha-${i}`}
            t={[(a.inicio * Math.PI) / 180, (a.fin * Math.PI) / 180]}
            xy={(t) => [
              a.centro[0] + a.r * Math.cos(t),
              a.centro[1] + a.r * Math.sin(t),
            ]}
            color={colorStroke}
            weight={strokeW}
          />
        ))}

        {/* CAPA 5: ÁNGULOS Y ALTURAS */}
        {parametros.angulos?.map((a: any, i: number) => (
          <Plot.Parametric
            key={`ang-${i}`}
            t={[(a.inicio * Math.PI) / 180, (a.fin * Math.PI) / 180]}
            xy={(t) => [
              a.centro[0] + a.r * Math.cos(t),
              a.centro[1] + a.r * Math.sin(t),
            ]}
            color={colorAngulo}
            weight={strokeW}
          />
        ))}
        {parametros.lineas?.map((l: any, i: number) => (
          <Line.Segment
            key={`l-${i}`}
            point1={l.p1}
            point2={l.p2}
            color={l.resaltada ? colorResalte : colorStroke}
            weight={strokeW}
            style={l.punteada ? "dashed" : "solid"}
          />
        ))}

        {/* CAPA 6: ETIQUETAS ESTRUCTURALES */}
        {parametros.etiquetas?.map((etiq: any, i: number) => (
          <Text
            key={`t-${i}`}
            x={etiq.pos[0]}
            y={etiq.pos[1]}
            size={etiq.esVertice ? 18 : 16}
            color={etiq.esVertice ? "#475569" : "#0f172a"}
            svgTextProps={{ style: ESTILO_HALO_ROBUSTO }}
          >
            {etiq.texto}
          </Text>
        ))}
        {/* 🔥 CAPA 7: REFUERZO ESTÉTICO (Líneas horizontales para la corbata) */}
        {/* Añade esto: Si la plantilla es de nivel avanzado y el tipo de figura es el 7, 
            dibujamos las líneas de cierre superior e inferior.
        */}
        {parametros.idPlantilla?.includes("avanzado") &&
          parametros.tipo_fig === 7 && (
            <>
              {/* Línea horizontal inferior (Base) */}
              <Line.Segment
                point1={[0, 0]}
                point2={[20 * (parametros.k || 1), 0]}
                color={colorStroke}
                weight={strokeW}
                style="dashed"
              />
              {/* Línea horizontal superior (Techo) */}
              <Line.Segment
                point1={[0, 15 * (parametros.k || 1)]}
                point2={[20 * (parametros.k || 1), 15 * (parametros.k || 1)]}
                color={colorStroke}
                weight={strokeW}
                style="dashed"
              />
            </>
          )}
      </Mafs>
    </div>
  );
};
