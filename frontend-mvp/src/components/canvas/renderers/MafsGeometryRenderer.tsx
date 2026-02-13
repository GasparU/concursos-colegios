import { Mafs } from "mafs";
import { RenderizadorSegmentos } from "./especializados/RenderizadorSegmentos";
import { RenderizadorAngulos } from "./especializados/RenderizadorAngulos";
import { RenderizadorPoligonos } from "./especializados/RenderizadorPoligonos";

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

  const CAJA_FIJA = {
    x: [-1, 11] as [number, number],
    y: [-5, 3] as [number, number],
    padding: 0,
  };

  return (
    <div
      className="mafs-container border rounded-lg overflow-hidden bg-white shadow-sm relative"
      style={{ touchAction: "none" }}
    >
      <Mafs
        width="auto"
        height={400}
        viewBox={CAJA_FIJA}
        pan={false}
        zoom={false}
        preserveAspectRatio={"xMidYMid meet" as any}
      >
        {(() => {
          switch (tipoFigura) {
            case "collinear_segments":
              return <RenderizadorSegmentos parametros={parametros} />;

            case "consecutive_angles":
              return <RenderizadorAngulos parametros={parametros} />;

            case "polygon_regular":
            case "triangle":
              return <RenderizadorPoligonos parametros={parametros} />;

            default:
              return (
                <text x={0} y={0} fontSize={20} fill="red">
                  Error: Tipo {tipoFigura} no soportado
                </text>
              );
          }
        })()}
      </Mafs>
    </div>
  );
};
