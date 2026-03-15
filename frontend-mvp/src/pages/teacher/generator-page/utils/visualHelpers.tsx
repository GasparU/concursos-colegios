import { MafsGeometryRenderer } from "../../../../components/canvas/renderers/MafsGeometryRenderer";

export const renderVisualEmbed = (rawVisualData: any, mathData?: any) => {
  if (!rawVisualData) return null;

  const visualType =
    rawVisualData.tipo_render || rawVisualData.type || rawVisualData.data?.type;
  const actualData = rawVisualData.data?.type
    ? rawVisualData.data
    : rawVisualData;

  if (!visualType || visualType === "none") return null;

  const mafsTypes = [
    "geometry_mafs", 
    "graphic_counting", 
    "distribucion_grafica", 
    "criptoaritmetica",
    "conteo_figuras", // Agregado por seguridad
    "area_sombreada"  // Agregado por seguridad
  ];
  
  if (mafsTypes.includes(visualType)) {
    return (
      <div className="my-1 flex justify-center w-full select-none">
        {/* 🔥 LA CLASE [&_button]:hidden APAGA LOS BOTONES A-/A+ A LA FUERZA */}
        <div className="w-full md:max-w-[700px] aspect-video relative flex items-center justify-center bg-white overflow-hidden [&_button]:hidden">
          <div className="w-full h-full flex items-center justify-center scale-95 origin-center">
            <MafsGeometryRenderer datosMatematicos={actualData} />
          </div>
        </div>
      </div>
    );
  }

  if (visualType === "frequency_table") {
    {
      /* 🔥 CAMBIO UNIVERSAL: Se aplica a mafsTypes, chart_bar, chart_pie, etc. */
    }
    return (
      <div className="my-0 flex justify-center w-full select-none">
        {/* 🔥 Eliminamos bordes, sombras y radios. El lienzo manda al 100%. */}
        <div className="w-full md:max-w-[700px] aspect-video relative flex items-center justify-center bg-white overflow-hidden">
          <div className="w-full h-full flex items-center justify-center scale-95 origin-center">
            <MafsGeometryRenderer datosMatematicos={actualData} />
          </div>
        </div>
      </div>
    );
  }

  if (visualType === "physics_ariana") {
    {
      /* 🔥 CAMBIO UNIVERSAL: Se aplica a mafsTypes, chart_bar, chart_pie, etc. */
    }
    return (
      <div className="my-0 flex justify-center w-full select-none">
        {/* 🔥 Eliminamos bordes, sombras y radios. El lienzo manda al 100%. */}
        <div className="w-full md:max-w-[700px] aspect-video relative flex items-center justify-center bg-white overflow-hidden">
          <div className="w-full h-full flex items-center justify-center scale-95 origin-center">
            <MafsGeometryRenderer datosMatematicos={actualData} />
          </div>
        </div>
      </div>
    );
  }

  if (visualType === "chart_bar" || visualType === "chart_pie") {
    {
      /* 🔥 CAMBIO UNIVERSAL: Se aplica a mafsTypes, chart_bar, chart_pie, etc. */
    }
    return (
      <div className="my-0 flex justify-center w-full select-none">
        {/* 🔥 Eliminamos bordes, sombras y radios. El lienzo manda al 100%. */}
        <div className="w-full md:max-w-[700px] aspect-video relative flex items-center justify-center bg-white overflow-hidden">
          <div className="w-full h-full flex items-center justify-center scale-95 origin-center">
            <MafsGeometryRenderer datosMatematicos={actualData} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 flex justify-center w-full select-none">
      <div className="w-full md:max-w-[500px] aspect-video bg-slate-50 rounded-lg border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center text-xs text-slate-400">
        Gráfico Pendiente: {visualType}
      </div>
    </div>
  );
};
