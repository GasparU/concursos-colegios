
import { MafsGeometryRenderer } from '../../../../components/canvas/renderers/MafsGeometryRenderer'
import { PureSvgPhysicsRenderer } from '../../../../components/canvas/renderers/PureSvgPhysicsRenderer';
import { StatisticsChart } from '../../../../components/canvas/renderers/StatisticsChart';
import { StatisticsTable } from '../../../../components/canvas/renderers/StatisticsTable';




export const renderVisualEmbed = (visualData: any, mathData?: any) => {
  console.log("📊 renderVisualEmbed visualData:", JSON.stringify(visualData, null, 2));
  if (!visualData || visualData.type === "none") return null;

  if (visualData.type === "geometry_mafs") {
    const tieneDataNueva = mathData && mathData.params;
    const tieneDataVieja = visualData.elements && visualData.elements.length > 0;
    if (!tieneDataNueva && !tieneDataVieja) return null;
    return (
      <div className="my-3 flex justify-center w-full select-none">
        <div className="w-full md:max-w-[500px] h-[300px] bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
          <MafsGeometryRenderer datosMatematicos={mathData || visualData} />
        </div>
      </div>
    );
  }

  if (visualData.type === "frequency_table") {
    return (
      <div className="my-3 flex justify-center w-full select-none">
        <div className="w-full md:max-w-[500px] bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <StatisticsTable data={visualData.data} />
        </div>
      </div>
    );
  }

  if (visualData.type === "physics_ariana") {
    return (
      <div className="my-3 flex justify-center w-full select-none">
        <div className="w-full md:max-w-[500px] h-[300px] bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
          <PureSvgPhysicsRenderer visualData={visualData} />
        </div>
      </div>
    );
  }

  if (visualData.type === "chart_bar" || visualData.type === "chart_pie") {
    return (
      <div className="my-3 flex justify-center w-full select-none">
        <div className="w-full md:max-w-[500px] h-[300px] bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
          <StatisticsChart type={visualData.type} data={visualData.data} />
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 flex justify-center w-full select-none">
      <div className="w-full md:max-w-[500px] h-[300px] bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative flex items-center justify-center text-xs text-slate-400">
        Gráfico: {visualData.type}
      </div>
    </div>
  );
};