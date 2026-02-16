import { RenderizadorSegmentos } from "./especializados/RenderizadorSegmentos";
import { RenderizadorAngulos } from "./especializados/RenderizadorAngulos";
import { RenderizadorPoligonos } from "./especializados/RenderizadorPoligonos";
import { StatisticsChart } from "./StatisticsChart";

export const MafsGeometryRenderer = (props: any) => {
  // 1. RECUPERACIÓN DE DATOS
  // Atrapamos lo que sea que mande el GeneratorPage
  const datosEntrada =
    props.datosMatematicos || props.visualData || props.mathData || props.data;

  if (!datosEntrada) {
    return (
      <div className="text-red-600 font-bold">Error: Sin datos de entrada</div>
    );
  }

  // 2. LÓGICA DE DESEMPAQUETADO (EL FIX REAL)
  let tipoFigura = datosEntrada.type;
  let parametros = datosEntrada.params;

  // CASO: El backend envía un wrapper 'geometry_mafs' (Lo que mostraste en logs)
  if (tipoFigura === "geometry_mafs") {
    // El verdadero tipo está en 'theme'
    tipoFigura = datosEntrada.theme;
    if (!parametros) {
      parametros = datosEntrada;
    }
  }

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm">
      {(() => {
        switch (tipoFigura) {
          case "collinear_segments":
            return <RenderizadorSegmentos parametros={parametros} />;
          case "consecutive_angles":
            return <RenderizadorAngulos parametros={parametros} />;
          case "polygon_regular":
          case "triangle":
            return <RenderizadorPoligonos parametros={parametros} />;

          case "chart_bar":
          case "chart_pie":
            return <StatisticsChart type={tipoFigura} data={parametros} />;




            // Añadir aqui las graficas que se van a generar tanto para geometria, estadistica u otros.

          default:
            return (
              <div className="p-10 text-center text-red-500">
                Tipo de figura no soportado: <strong>{tipoFigura}</strong>
              </div>
            );
        }
      })()}
    </div>
  );
};
