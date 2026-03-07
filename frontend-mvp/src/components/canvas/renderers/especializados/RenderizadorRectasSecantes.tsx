// src/components/canvas/renderers/especializados/RenderizadorRectasSecantes.tsx
import { Mafs, Line, Text } from "mafs";
import {
  CONFIG_GEOMETRIA,
  AJUSTES_ESPECIFICOS_SECANTES,
} from "./ConstantesVisuales";
import { ArcoAngulo } from "./ArcoAngulo";

interface Props {
  parametros: {
    idPlantilla?: string;
    lineas: { puntos: [[number, number], [number, number]]; label?: string }[];
    angulos: { inicio: number; fin: number; etiqueta: string }[];
    centro?: [number, number]; // Opcional por seguridad
    origen?: [number, number]; // Soporte para lo que envía el backend
  };
}

export const RenderizadorRectasSecantes = ({ parametros }: Props) => {
  // 🔥 DEFENSA: Si no hay parámetros o líneas, no renderizamos nada para evitar el crash
  if (!parametros || !parametros.lineas) return null;

  // 🔥 SINCRONIZACIÓN: Usamos 'centro' o 'origen' (el que venga del backend)
  const centroFinal = parametros.centro || parametros.origen || [0, 0];
  const { lineas, angulos } = parametros;

  // Calcular viewBox dinámico
  const puntos: [number, number][] = [];
  lineas.forEach((l) => {
    if (l.puntos) puntos.push(l.puntos[0], l.puntos[1]);
  });

  angulos.forEach((a) => {
    const medio = (a.inicio + a.fin) / 2;
    const rad = (medio * Math.PI) / 180;
    const radioEtiqueta = 2.0;
    puntos.push([
      centroFinal[0] + radioEtiqueta * Math.cos(rad),
      centroFinal[1] + radioEtiqueta * Math.sin(rad),
    ]);
  });

  // Valores por defecto si el cálculo falla
  const xs = puntos.length > 0 ? puntos.map((p) => p[0]) : [-5, 5];
  const ys = puntos.length > 0 ? puntos.map((p) => p[1]) : [-5, 5];

  const minX = Math.min(...xs) - (CONFIG_GEOMETRIA.MARGEN_VIEWBOX || 1);
  const maxX = Math.max(...xs) + (CONFIG_GEOMETRIA.MARGEN_VIEWBOX || 1);
  const minY = Math.min(...ys) - (CONFIG_GEOMETRIA.MARGEN_VIEWBOX || 1);
  const maxY = Math.max(...ys) + (CONFIG_GEOMETRIA.MARGEN_VIEWBOX || 1);

  const viewBox = {
    x: [minX, maxX] as [number, number],
    y: [minY, maxY] as [number, number],
  };

  return (
    <div className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden flex justify-center items-center w-full p-4">
      <Mafs height={320} viewBox={viewBox} pan={false} zoom={false}>
        <g>
          {/* DIBUJO DE LÍNEAS (L1, L2) */}
          {lineas.map((linea, i) => (
            <Line.Segment
              key={`linea-${i}`}
              point1={linea.puntos[0]}
              point2={linea.puntos[1]}
              color={CONFIG_GEOMETRIA.COLOR_LINEA_PRINCIPAL}
              weight={CONFIG_GEOMETRIA.GROSOR_LINEA}
            />
          ))}

          {/* DIBUJO DE ARCOS DE ÁNGULOS */}
          {angulos.map((ang, i) => (
            <ArcoAngulo
              key={`ang-arc-${i}`}
              centro={centroFinal}
              startAngle={ang.inicio}
              endAngle={ang.fin}
              radio={1.2}
              colorBorde={CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA}
            />
          ))}

          {/* DIBUJO DE ETIQUETAS (TEXTO) */}
          {angulos.map((ang, i) => {
            const medio = (ang.inicio + ang.fin) / 2;
            const rad = (medio * Math.PI) / 180;

            const ajustes = parametros.idPlantilla
              ? AJUSTES_ESPECIFICOS_SECANTES[parametros.idPlantilla]
              : {};
            const radioTexto =
              ajustes && ajustes.radioTexto ? ajustes.radioTexto : 2.5;
            const x = centroFinal[0] + radioTexto * Math.cos(rad);
            const y = centroFinal[1] + radioTexto * Math.sin(rad);

            // 🔥 LÓGICA DE COLOR (Verde si no tiene x, Oscuro si tiene)
            const esEcuacion = ang.etiqueta
              ? ang.etiqueta.includes("x") || ang.etiqueta.includes("y")
              : false;
            const colorDinamico = esEcuacion
              ? CONFIG_GEOMETRIA.COLOR_TEXTO
              : CONFIG_GEOMETRIA.COLOR_LINEA_SECUNDARIA;
            return (
              <Text
                key={`label-text-${i}`}
                x={x}
                y={y}
                size={CONFIG_GEOMETRIA.TAMANO_TEXTO}
                color={colorDinamico}
              >
                {ang.etiqueta}
              </Text>
            );
          })}
        </g>
      </Mafs>
    </div>
  );
};
