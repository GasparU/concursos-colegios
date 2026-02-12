import React, { useMemo } from "react";
import { Mafs, Polygon, Point, Text, Line, Polyline, Circle } from "mafs";
import "mafs/core.css";
import "mafs/font.css";

// ==============================================================
// 🎨 TEMA "LIBRO DE TEXTO" (MODIFICABLE)
// ==============================================================
const THEME_BOOK = {
    background: "#ffffff",
    segmentColor: "#1e293b", // Negro/Azul oscuro para la figura base
    pointColor: "#36a2eb",   // Rojo intenso (Vértices)
    measureColor: "#16a34a", // Verde (Cotas de medida)
    measureText: "#000000",  // Texto de la medida
    angleColor: "#f59e0b",   // Naranja (Ángulos)
    textColor: "#0f172a",    // Texto general (A, B, C)
    grid: false
};

// ==============================================================
// 🎨 MATRIZ DE ESTILOS POR TIPO DE GRÁFICO (MODULAR)
// ==============================================================
const GRAPH_THEMES: any = {
    // 1. SEGMENTOS COLINEALES (Necesitan ser GRANDES y CLAROS)
    collinear_segments: {
        pointRadius: 3,         // Puntos gordos
        vertexFontSize: 18,     // Letras A, B, C gigantes
        measureFontSize: 18,    // Números "3x+2" grandes
        angleLabelSize: 18,
        angleArcRadius: 1.5,
        lineWidth: 3,           // Línea base gruesa
        labelDistance: 25,      // Letras A, B muy separadas del punto
        measureOffset: 1.5,      // Cotas bien separadas
        zoomPadding: 0.2,
        measureTextGapTop: 5,
        measureTextGapBottom: 8,
        measureTickSize: 3,   // Tamaño de las rayitas verticales de la cota
        measureTextGap: 3,    // Distancia entre la línea verde y el número
        measureScaleUp: 10,    // Qué tan arriba van las cotas positivas
        measureScaleDown: 18
    },
    
    // 2. ÁNGULOS CONSECUTIVOS (Más delicados para que quepan)
    consecutive_angles: {
        pointRadius: 4,         // Puntos medianos
        vertexFontSize: 20,     // Letras O, A, B normales
        angleArcRadius: 2.0,
        measureFontSize: 18,    // Valores de ángulos
        angleLabelSize: 16,
        lineWidth: 2,
        labelDistance: 20,
        measureOffset: 1.2,
        zoomPadding: 0.8
    },

    // 3. SÓLIDOS (Cubos)
    solid_cube: {
        pointRadius: 3,
        vertexFontSize: 16,     // Letras discretas para no tapar aristas
        measureFontSize: 16,
        angleLabelSize: 14,
        lineWidth: 2,
        labelDistance: 15,
        measureOffset: 0.8,
        zoomPadding: 0.35
    },

    // 4. FALLBACK (Por si llega algo nuevo)
    default: {
        pointRadius: 4,
        vertexFontSize: 20,
        measureFontSize: 18,
        angleLabelSize: 16,
        lineWidth: 2,
        labelDistance: 20,
        measureOffset: 1.0,
        zoomPadding: 0.3,
        measureTickSize: 0.2,
        measureTextGap: 0.5,
        measureScaleUp: 2.0,
        measureScaleDown: 2.0,
        measureTextGapTop: 0.5,
        measureTextGapBottom: 0.5,
    },

    polygon_regular: {
        pointRadius: 4, 
        vertexFontSize: 20,
        lineWidth: 2,
        labelDistance: 25,
        zoomPadding: 0.5 // Más aire para polígonos
    },
    circle_sectors: {
        pointRadius: 0, // En pizzas a veces no queremos puntos gordos
        vertexFontSize: 18,
        angleLabelSize: 14, // Porcentajes pequeños
        lineWidth: 1,
        zoomPadding: 0.2
    },

    net_box: {
        pointRadius: 2,
        vertexFontSize: 12,
        measureFontSize: 14,
        lineWidth: 1,
        zoomPadding: 0.1 // Ajustado
    },
    parallel_lines_bisector: {
        pointRadius: 3,         // Puntos pequeños
        vertexFontSize: 18,
        measureFontSize: 16,
        angleLabelSize: 16,     // Texto de ángulos
        angleArcRadius: 1.0,    // 🔥 Arcos pequeños para que quepan en la intersección
        lineWidth: 2,
        labelDistance: 20,
        measureOffset: 1.0,
        zoomPadding: 0.4
    },
};

interface Props {
  visualData: any;
}

// --------------------------------------------------------------
// 🧩 COMPONENTE: COTA DE MEDIDA (La línea verde con topes)
// --------------------------------------------------------------
const MeasureDimension = ({ 
    p1, p2, label, 
    offset = 1.0, 
    fontSize = 18,
    tickSize = 0.2, 
    // 🔥 RECIBIMOS LAS DOS SEPARACIONES
    textGapTop = 0.5,
    textGapBottom = 0.5,
    scaleUp = 2.5,
    scaleDown = 3.5
}: any) => {
    if (!p1 || !p2) return null;
    
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const len = Math.sqrt(dx*dx + dy*dy);
    if (len === 0) return null;

    const nx = -dy / len;
    const ny = dx / len;

    const direction = offset >= 0 ? 1 : -1;
    
    // Altura de la línea verde
    const finalDistance = direction === 1 
        ? scaleUp * Math.abs(offset) 
        : -scaleDown * Math.abs(offset);

    const m1 = [p1[0] + nx * finalDistance, p1[1] + ny * finalDistance] as [number, number];
    const m2 = [p2[0] + nx * finalDistance, p2[1] + ny * finalDistance] as [number, number];

    const midX = (m1[0] + m2[0]) / 2;
    const midY = (m1[1] + m2[1]) / 2;

    const cleanLabel = useMemo(() => {
        if (!label) return "";
        return label.toString().replace(/\$/g, '').replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2').replace(/\\cdot/g, '*').replace(/\{|\}/g, '');
    }, [label]);

    // 🔥 LOGICA DE SEPARACIÓN INDEPENDIENTE
    // Si direction es 1 (Arriba), usa textGapTop. Si es -1 (Abajo), usa textGapBottom (negativo).
    const textPush = direction === 1 ? textGapTop : -textGapBottom;

    const textX = midX + nx * textPush; 
    const textY = midY + ny * textPush;

    return (
        <React.Fragment>
            <Line.Segment point1={m1} point2={m2} color={THEME_BOOK.measureColor} weight={1} />
            <Line.Segment point1={[m1[0] + nx * tickSize, m1[1] + ny * tickSize]} point2={[m1[0] - nx * tickSize, m1[1] - ny * tickSize]} color={THEME_BOOK.measureColor} weight={1} />
            <Line.Segment point1={[m2[0] + nx * tickSize, m2[1] + ny * tickSize]} point2={[m2[0] - nx * tickSize, m2[1] - ny * tickSize]} color={THEME_BOOK.measureColor} weight={1} />
            
            <Text x={textX} y={textY} color={THEME_BOOK.measureText} size={fontSize}>
                {cleanLabel}
            </Text>
        </React.Fragment>
    );
};

// --------------------------------------------------------------
// 🚀 RENDERIZADOR PRINCIPAL
// --------------------------------------------------------------
export const MafsGeometryRenderer = ({ visualData }: Props) => {

    // 🔥 1. DETECTAR EL TIPO DE GRÁFICO Y CARGAR SU TEMA
  // Si visualData no tiene type, usa 'default'.
  const activeType = visualData?.theme || visualData?.type || 'default';
  
  // Cargamos la configuración específica, o la default si no existe
  const CONFIG = GRAPH_THEMES[activeType] || GRAPH_THEMES.default;

  // NORMALIZADOR DE DATOS
  const { normalizedPoints, normalizedLines, normalizedPolygons, normalizedAngles, normalizedLabels, normalizedMeasures, normalizedCircles,normalizedArcs  } = useMemo(() => {
    const output = {
        normalizedPoints: [] as any[],
        normalizedLines: [] as any[],
        normalizedPolygons: [] as any[],
        normalizedAngles: [] as any[],
        normalizedLabels: [] as any[],
        normalizedMeasures: [] as any[],
        normalizedCircles: [] as any[],  
        normalizedArcs: [] as any[], 
    };

    const extractCoords = (p: any): [number, number] | null => {
        if (Array.isArray(p) && p.length >= 2) return [p[0], p[1]];
        if (typeof p === 'object' && p !== null && 'x' in p) return [p.x, p.y];
        return null;
    };

    // 1. BLINDAJE: Crear una lista limpia antes de iterar
    const validElements = (visualData.elements && Array.isArray(visualData.elements))
        ? visualData.elements.filter((el: any) => el && typeof el === 'object') // 🔥 AQUÍ ESTÁ EL FILTRO
        : [];

    // Ahora iteramos sobre la lista segura "validElements"
    validElements.forEach((el: any) => {
        
        // Ya no necesitamos el "if (!el) return" aquí porque filtramos arriba
        
        // Extracción segura de coordenadas
        let elPoints = el.points ? el.points.map(extractCoords).filter(Boolean) : [];
        if (el.coords) elPoints = [extractCoords(el.coords)].filter(Boolean) as any;

        // --- A PARTIR DE AQUÍ TU CÓDIGO SIGUE IGUAL ---
        
        // PUNTOS
        if (el.type === 'point' && elPoints.length > 0) {
            output.normalizedPoints.push({ x: elPoints[0][0], y: elPoints[0][1], label: el.label });
            if (el.label) output.normalizedLabels.push({ x: elPoints[0][0], y: elPoints[0][1], text: el.label, isPointLabel: true });
        }

        // SEGMENTOS / LÍNEAS
        if ((el.type === 'segment' || el.type === 'line') && elPoints.length >= 2) {
             // ... tu lógica de líneas ...
             for (let i = 0; i < elPoints.length - 1; i++) {
                output.normalizedLines.push({
                    from: elPoints[i],
                    to: elPoints[i+1],
                    style: el.style
                });
            }
        }
        

        // ÁNGULOS
        if (el.type === 'angle' && elPoints.length === 3) {
            output.normalizedAngles.push({
                from: elPoints[0], at: elPoints[1], to: elPoints[2],
                label: el.label || el.value
            });
        }

        // CÍRCULOS
        if (el.type === 'circle') {
            output.normalizedCircles.push({
                center: el.center,
                radius: el.radius,
                color: el.color,
                weight: el.weight,
                filled: el.filled
            });
        }

        // ARCOS
        if (el.type === 'arc') {
                output.normalizedArcs.push({
                    center: el.center,
                    radius: el.radius,
                    startAngle: el.startAngle,
                    endAngle: el.endAngle,
                    color: el.color,
                    weight: el.weight,
                    label: el.label
                });
            }

        // POLÍGONOS CON RELLENO (ya se capturan como polygons, pero asegurar fillOpacity)
        if ((el.type === 'polygon' || el.type === 'triangle') && elPoints.length >= 3) {
            output.normalizedPolygons.push({
                points: elPoints,
                color: el.color,
                filled: el.filled,
                fillOpacity: el.fillOpacity ?? 0.2,
                weight: el.weight ?? 0
            });
        }

        // ETIQUETAS SUELTAS (no asociadas a punto)
        if (el.type === 'label' && el.coords) {
            const coord = extractCoords(el.coords);
            if (coord) {
                output.normalizedLabels.push({
                    x: coord[0],
                    y: coord[1],
                    text: el.text,
                    isLatex: el.isLatex
                });
            }
        }

        
    });

    // 2. Procesar "measures" (Cotas decorativas explícitas)
    // Esto lo usaremos si modificamos el backend para enviar "measures": []
    if (visualData.measures && Array.isArray(visualData.measures)) {
        visualData.measures.forEach((m: any) => {
             const p1 = extractCoords(m.from);
             const p2 = extractCoords(m.to);
             if (p1 && p2) {
                 output.normalizedMeasures.push({ from: p1, to: p2, label: m.label, offset: m.offset || 1.2 });
             }
        });
    } 
    // FALLBACK: Si el backend sigue mandando medidas dentro de 'elements' con type='measure'
    else if (visualData.elements) {
        visualData.elements.forEach((el: any) => {
            if (el.type === 'measure') { // Tipo especial inventado para la IA
                const pts = el.points ? el.points.map(extractCoords) : [];
                if (pts.length >= 2) {
                    output.normalizedMeasures.push({ from: pts[0], to: pts[1], label: el.label, offset: el.offset || 1.2 });
                }
            }
        });
    }

    return output;
  }, [visualData]);

  // Lógica de arcos
  const getAngleArcPoints = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
      const points: [number, number][] = [];
      const steps = 15;
      let diff = endAngle - startAngle;
      while (diff <= -Math.PI) diff += 2 * Math.PI;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      for (let i = 0; i <= steps; i++) {
          const t = startAngle + (diff * i) / steps;
          points.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
      }
      return { points, midAngle: startAngle + diff / 2 };
  };

  // 4. AUTO-ZOOM CENTRADO (VERSIÓN "CÁMARA FIJA")
  const bounds = useMemo(() => {
      const allX: number[] = [];
      const allY: number[] = [];
      
      // Solo nos importa el ANCHO para el zoom X
      normalizedPoints.forEach(p => { allX.push(p.x); allY.push(p.y); });
      normalizedLines.forEach(l => { 
          allX.push(l.from[0], l.to[0]); 
          allY.push(l.from[1], l.to[1]); 
      });
      // Las medidas a veces se salen del dibujo, hay que incluirlas
      normalizedMeasures.forEach(m => { 
          allX.push(m.from[0], m.to[0]); 
          allY.push(m.from[1], m.to[1]); 
      });
      
      // Si no hay datos, default
      if (allX.length === 0) return { minX: -5, maxX: 5, minY: -5, maxY: 5 };

      const minX = Math.min(...allX);
      const maxX = Math.max(...allX);
      const minY = Math.min(...allY);
      const maxY = Math.max(...allY);
      
      const width = maxX - minX;
      const height = maxY - minY;
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      // 🔥 APLICAMOS EL MARGEN DEL 40% (0.4)
      // Si el dibujo es muy plano (altura 0), forzamos una altura mínima de 4
      const effectiveHeight = height < 1 ? 4 : height;
      const effectiveWidth = width < 1 ? 4 : width;

      const padX = effectiveWidth * CONFIG.zoomPadding;
      const padY = effectiveHeight * CONFIG.zoomPadding;

      return { 
          minX: centerX - (effectiveWidth / 2) - padX, 
          maxX: centerX + (effectiveWidth / 2) + padX, 
          minY: centerY - (effectiveHeight / 2) - padY, 
          maxY: centerY + (effectiveHeight / 2) + padY 
      };
      
      // Dependencias
  }, [normalizedPoints, normalizedLines, normalizedMeasures, CONFIG]);


  return (
    <div className="w-full h-[800px] relative select-none rounded-lg overflow-hidden custom-mafs-wrapper " style={{ backgroundColor: THEME_BOOK.background }}>
      <style>{`
        /* 1. Fondo del lienzo */
        .custom-mafs-wrapper .MafsView { 
            background-color: ${THEME_BOOK.background} !important; 
        }

        /* 2. Textos (Grosor y borde para que se lean sobre líneas) */
        .custom-mafs-wrapper text { 
            font-family: 'Inter', sans-serif; 
            paint-order: stroke; 
            stroke: ${THEME_BOOK.background}; 
            stroke-width: 3px; /* Borde blanco alrededor de letras */
            fill: ${THEME_BOOK.textColor} !important;
        }

        /* 3. Puntos (Círculos) - AQUÍ ES DONDE FALLABA EL TAMAÑO */
        .custom-mafs-wrapper circle { 
            fill: ${THEME_BOOK.pointColor} !important; 
            stroke: ${THEME_BOOK.pointColor} !important; 
            r: ${CONFIG.pointRadius}px !important;
        }

        /* 4. Líneas */
        .custom-mafs-wrapper line {
            stroke-linecap: round;
        }
      `}</style>

      <Mafs viewBox={{ x: [bounds.minX, bounds.maxX], y: [bounds.minY, bounds.maxY] }} preserveAspectRatio="contain" pan zoom>
        
        {/* 1. POLÍGONOS (Fondo) */}
        {normalizedPolygons.map((poly: any, i: number) => (
          <Polygon key={`poly-${i}`} points={poly.points} color={THEME_BOOK.angleColor} fillOpacity={0.15} weight={0} />
        ))}

        

        {/* 2. ÁNGULOS */}
        {normalizedAngles.map((ang: any, i: number) => {
            const a1 = Math.atan2(ang.from[1] - ang.at[1], ang.from[0] - ang.at[0]);
            const a2 = Math.atan2(ang.to[1] - ang.at[1], ang.to[0] - ang.at[0]);
            const arcRadius = CONFIG.angleArcRadius || 1.5;
            const { points, midAngle } = getAngleArcPoints(ang.at[0], ang.at[1], 0.7, a1, a2);
            return (
                <React.Fragment key={`ang-${i}`}>
                    <Polyline points={points} color={THEME_BOOK.angleColor} weight={3} />
                    <Polygon points={[[ang.at[0], ang.at[1]], ...points]} color={THEME_BOOK.angleColor} fillOpacity={0.2} weight={0} />
                    {ang.label && (
                        <Text 
                            x={ang.at[0] + (arcRadius + 0.8) * Math.cos(midAngle)} // Posición dinámica
                            y={ang.at[1] + (arcRadius + 0.8) * Math.sin(midAngle)} 
                            color={THEME_BOOK.angleColor}
                            size={CONFIG.angleLabelSize || 18} // Tamaño del tema
                        >
                            {ang.label}
                        </Text>
                    )}
                </React.Fragment>
            );
        })}

        {/* 3. LÍNEAS (Estructurales - NEGRAS) */}
        {normalizedLines.map((line: any, i: number) => (
            <Line.Segment key={`base-${i}`} point1={line.from} point2={line.to} color={THEME_BOOK.segmentColor} weight={CONFIG.lineWidth} style={line.style || "solid"} />
        ))}

        {/* 4. MEDIDAS (Cotas - VERDES) */}
        {normalizedMeasures.map((m: any, i: number) => (
            <MeasureDimension 
                key={`meas-${i}`} 
                p1={m.from} 
                p2={m.to} 
                label={m.label} 
                offset={m.offset || 1.0} 
                fontSize={CONFIG.measureFontSize}
                textGapTop={CONFIG.measureTextGapTop}
                textGapBottom={CONFIG.measureTextGapBottom}
                tickSize={CONFIG.measureTickSize}       // Controla rayitas
                textGap={CONFIG.measureTextGap}         // Controla distancia texto
                scaleUp={CONFIG.measureScaleUp}         // Controla altura arriba
                scaleDown={CONFIG.measureScaleDown}     // Controla altura abajo
            />
        ))}

      {/* CÍRCULOS */}
        {normalizedCircles.map((circ: any, i: number) => (
            <Circle 
                key={`circ-${i}`}
                center={circ.center}
                radius={circ.radius}
                color={circ.color || THEME_BOOK.segmentColor}
                weight={circ.weight || 2}
                strokeStyle="solid"
            />
        ))}

{/* ARCOS */}
{normalizedArcs.map((arc: { center: [number, number]; radius: number; startAngle: number; endAngle: number; color?: string; weight?: number; label?: string }, i: number) => {
    const steps = 30;
    const points: [number, number][] = [];
    for (let j = 0; j <= steps; j++) {
        const t = arc.startAngle + (arc.endAngle - arc.startAngle) * j / steps;
        points.push([
            arc.center[0] + arc.radius * Math.cos(t),
            arc.center[1] + arc.radius * Math.sin(t)
        ]);
    }


    return (
        <React.Fragment key={`arc-${i}`}>
            <Polyline points={points} color={arc.color || THEME_BOOK.angleColor} weight={arc.weight || 3} />
            {arc.label && (
                <Text 
                    x={arc.center[0] + (arc.radius + 0.5) * Math.cos((arc.startAngle + arc.endAngle) / 2)}
                    y={arc.center[1] + (arc.radius + 0.5) * Math.sin((arc.startAngle + arc.endAngle) / 2)}
                    color={arc.color || THEME_BOOK.angleColor}
                >
                    {arc.label}
                </Text>
            )}
        </React.Fragment>
    );
        })}
        

        {/* 5. PUNTOS (Vértices - ROJOS) */}
        {normalizedPoints.map((p: any, i: number) => (
            <Point 
                key={`pt-${i}`} 
                x={p.x} 
                y={p.y} 
                color={THEME_BOOK.pointColor} 
            />
        ))}

        {/* 6. ETIQUETAS (A, B, C) */}
        {normalizedLabels.map((lbl: any, i: number) => {
            return (
                <Text 
                    key={`lbl-${i}`} 
                    x={lbl.x} 
                    y={lbl.y} 
                    attach="n" // Mantiene N (Norte) por defecto
                    attachDistance={CONFIG.labelDistance} // 🔥 Se ajusta según el tamaño del punto
                    color={THEME_BOOK.textColor}
                    size={CONFIG.vertexFontSize} 
                    svgTextProps={{ fontWeight: 'bold' }}
                >
                    {lbl.text}
                </Text>
            );
        })}
        

      </Mafs>
    </div>
  );
};