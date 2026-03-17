import { Mafs, Line, Text, Polygon } from "mafs";
import { CONFIG_GEOMETRIA } from "./ConstantesVisuales";

interface CuboProps {
  puntos?: [number, number][];
  color?: string;
  parametros?: any;
}

export const RenderizadorCubo = ({
  puntos,
  color = CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL,
  parametros,
}: CuboProps) => {
  
  // =========================================================================
  // 🔥 LO NUEVO: Proyección Oblicua (El verdadero 3D de libro escolar)
  // =========================================================================
  if (!puntos || puntos.length !== 8) {
    if (parametros && parametros.arista) {
      const arista = parametros.arista;
      
      // Coordenadas fijas para un cubo 3D perfecto donde TODAS las líneas se ven
      // f_ = front (frente), b_ = back (atrás)
      // bl = bottom-left, tr = top-right, etc.
      
      const f_bl = [-1.8, -1.8] as [number, number];
      const f_br = [0.6, -1.8] as [number, number];
      const f_tr = [0.6, 0.6] as [number, number];
      const f_tl = [-1.8, 0.6] as [number, number];

      const b_bl = [-0.6, -0.6] as [number, number];
      const b_br = [1.8, -0.6] as [number, number];
      const b_tr = [1.8, 1.8] as [number, number];
      const b_tl = [-0.6, 1.8] as [number, number];

      return (
        <div className="w-full flex justify-center py-4 bg-white dark:bg-slate-900 rounded-lg">
          <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
            
            {/* 1. CARAS CON RELLENO (Se dibujan atrás para dar volumen sin tapar líneas) */}
            <Polygon points={[f_bl, f_br, f_tr, f_tl]} color={color} fillOpacity={0.1} weight={0} />
            <Polygon points={[f_tl, f_tr, b_tr, b_tl]} color={color} fillOpacity={0.2} weight={0} />
            <Polygon points={[f_br, b_br, b_tr, f_tr]} color={color} fillOpacity={0.3} weight={0} />

            {/* 2. ARISTAS OCULTAS (DASHED) - Las 3 líneas que van por detrás */}
            <Line.Segment point1={b_bl} point2={b_br} color={color} weight={2} style="dashed" />
            <Line.Segment point1={b_bl} point2={b_tl} color={color} weight={2} style="dashed" />
            <Line.Segment point1={f_bl} point2={b_bl} color={color} weight={2} style="dashed" />

            {/* 3. ARISTAS VISIBLES (Líneas sólidas y más gruesas) */}
            {/* Cuadrado frontal */}
            <Line.Segment point1={f_bl} point2={f_br} color={color} weight={3} />
            <Line.Segment point1={f_br} point2={f_tr} color={color} weight={3} />
            <Line.Segment point1={f_tr} point2={f_tl} color={color} weight={3} />
            <Line.Segment point1={f_tl} point2={f_bl} color={color} weight={3} />
            
            {/* Líneas de profundidad */}
            <Line.Segment point1={f_tl} point2={b_tl} color={color} weight={3} />
            <Line.Segment point1={f_tr} point2={b_tr} color={color} weight={3} />
            <Line.Segment point1={f_br} point2={b_br} color={color} weight={3} />
            
            {/* Marco trasero superior y derecho */}
            <Line.Segment point1={b_tl} point2={b_tr} color={color} weight={3} />
            <Line.Segment point1={b_tr} point2={b_br} color={color} weight={3} />

            {/* 4. ETIQUETA (Centrada bajo la arista inferior frontal) */}
            <Text x={-0.6} y={-2.2} size={22} color="#0f172a" svgTextProps={{ fontWeight: "bold" }}>
              {`${arista} u`}
            </Text>
          </Mafs>
        </div>
      );
    }
    return null; 
  }

  // =========================================================================
  // 🛡️ LO ANTIGUO: EXACTAMENTE COMO LO TENÍAS
  // =========================================================================
  const front = puntos.slice(0, 4);
  const back = puntos.slice(4, 8);

  // Calcular viewBox
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  const minX = Math.min(...xs) - CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const maxX = Math.max(...xs) + CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const minY = Math.min(...ys) - CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const maxY = Math.max(...ys) + CONFIG_GEOMETRIA.MARGEN_VIEWBOX;
  const viewBox = {
    x: [minX, maxX] as [number, number],
    y: [minY, maxY] as [number, number],
  };

  return (
    <Mafs height={300} viewBox={viewBox} pan={false} zoom={false}>
      <g>
        {/* Cara frontal */}
        {front.map((p, i) => (
          <Line.Segment
            key={`f-${i}`}
            point1={p}
            point2={front[(i + 1) % 4]}
            color={color}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
          />
        ))}
        {/* Cara trasera */}
        {back.map((p, i) => (
          <Line.Segment
            key={`b-${i}`}
            point1={p}
            point2={back[(i + 1) % 4]}
            color={color}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
          />
        ))}
        {/* Aristas de profundidad */}
        {front.map((p, i) => (
          <Line.Segment
            key={`fb-${i}`}
            point1={p}
            point2={back[i]}
            color={color}
            weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
            style={i >= 2 ? "dashed" : undefined}
          />
        ))}
        {/* Etiquetas */}
        <Text
          x={front[0][0] - 0.2}
          y={front[0][1] - 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          A
        </Text>
        <Text
          x={front[1][0] + 0.2}
          y={front[1][1] - 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          B
        </Text>
        <Text
          x={front[2][0] + 0.2}
          y={front[2][1] + 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          C
        </Text>
        <Text
          x={front[3][0] - 0.2}
          y={front[3][1] + 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          D
        </Text>
        <Text
          x={back[0][0] - 0.2}
          y={back[0][1] - 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          E
        </Text>
        <Text
          x={back[1][0] + 0.2}
          y={back[1][1] - 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          F
        </Text>
        <Text
          x={back[2][0] + 0.2}
          y={back[2][1] + 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          G
        </Text>
        <Text
          x={back[3][0] - 0.2}
          y={back[3][1] + 0.2}
          size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
          color={CONFIG_GEOMETRIA.COLOR_TEXTO}
        >
          H
        </Text>
      </g>
    </Mafs>
  );
};