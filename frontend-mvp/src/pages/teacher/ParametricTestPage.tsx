import { useState } from "react";
import { useParametricGenerator } from "../../hooks/useParametricGenerator";
import { VisualRenderer } from "../../components/canvas/renderers/VisualRenderer";

export default function ParametricTestPage() {
  const { generarProblema, problema, loading } = useParametricGenerator();
  const [plantillaId, setPlantillaId] = useState("geo_area_triangulo_basico");

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6 border-b pb-2">
        <h1 className="text-sm font-black text-slate-800 uppercase">
          Parametric Debugger
        </h1>
        <div className="flex gap-1">
          <select
            value={plantillaId}
            onChange={(e) => setPlantillaId(e.target.value)}
            className="text-[10px] border border-slate-300 rounded px-1 py-1 font-bold bg-slate-50"
          >
            <optgroup label="ESTADÍSTICA">
              <option value="geo_area_triangulo_basico">Hombrecito 1</option>
              <option value="geo_area_triangulo_intermedio">Hombrecito 2</option>
              <option value="geo_area_triangulo_avanzado">Hombrecito 3</option>
              <option value="geo_area_triangulo_experto">Hombrecito 4</option>
              <option value="rm_conteo_triangulos_intermedio">Cripto 1</option>
              <option value="rm_conteo_triangulos_avanzado">Cripto 2 </option>
              <option value="rm_conteo_triangulos_experto">Cripto 3 </option>
            </optgroup>
          </select>
          <button
            onClick={() => generarProblema(plantillaId)}
            disabled={loading}
            className="bg-slate-800 text-white text-[10px] px-3 py-1 rounded font-bold hover:bg-black transition-all"
          >
            {loading ? "..." : "GENERAR"}
          </button>
        </div>
      </div>

      {problema ? (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <span className="text-[9px] font-bold text-blue-600 uppercase">
              Enunciado:
            </span>
            <p className="text-sm text-slate-800 font-medium leading-snug mt-1">
              {problema.enunciado}
            </p>

            {problema.visual_data && (
              <div className="mt-4 bg-white border border-slate-200 rounded-sm">
                <VisualRenderer visualData={problema.visual_data} />
              </div>
            )}
          </div>

          <div className="bg-slate-900 p-2 rounded flex justify-between items-center px-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase">
              Respuesta Correcta:
            </span>
            <span className="text-sm font-black text-white">
             {typeof problema.respuesta === "object" && problema.respuesta !== null
            ? `${problema.respuesta.numerador}/${problema.respuesta.denominador}`
            : problema.respuesta || "No calculada"}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-40 border-2 border-dashed border-slate-100 rounded flex items-center justify-center text-slate-300 text-xs">
          Haz clic en GENERAR para empezar
        </div>
      )}
    </div>
  );
}
