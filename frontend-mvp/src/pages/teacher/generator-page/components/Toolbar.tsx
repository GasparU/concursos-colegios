import {
  Search,
  Sparkles,
  Dices,
  Save,
  ZoomIn,
  ZoomOut,
  Eraser,
} from "lucide-react";
import { normalizeText } from "../../../../lib/utils";

interface ToolbarProps {
  config: any;
  setConfig: (updater: any) => void;
  topic: string;
  setTopic: (val: string) => void;
  suggestions: any[];
  setSuggestions: (val: any[]) => void;
  topicOptions: any[];
  isGenerating: boolean;
  problems: any[];
  onGenerate: () => void;
  onSimulacro: () => void;
  onSave: () => void;
  isSaving: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  theme: string;
  onClear: () => void;
}

export default function Toolbar({
  config,
  setConfig,
  topic,
  setTopic,
  suggestions,
  setSuggestions,
  topicOptions,
  isGenerating,
  problems,
  onGenerate,
  onSimulacro,
  onSave,
  isSaving,
  onZoomIn,
  onZoomOut,
  onClear
}: ToolbarProps) {
  const handleChange = (field: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  // 🔥 NUEVA FUNCIÓN DE BÚSQUEDA INSTANTÁNEA EN LA MEMORIA RAM
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTopic(val);
    if (val.length > 1) {
      const search = normalizeText(val);
      // Filtramos buscando en la propiedad 'nombre' del objeto
      const filtered = topicOptions.filter((t) =>
        normalizeText(t.nombre).includes(search),
      );
      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  };

  const selectTopic = (t: any) => {
    setTopic(t.nombre); // Solo mostramos el nombre en el input
    setSuggestions([]);
  };

  // Clases comunes
  const labelClass =
    "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1";
  const inputClass =
    "h-10 text-sm border rounded-xl outline-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 dark:text-gray-100";

  return (
    <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm z-10 transition-colors duration-300">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-col xl:flex-row gap-4 xl:items-end">
       {/* ZONA 1: INPUT TEMA */}
        <div className="flex-1 relative min-w-[200px]">
          {/* 🔥 EL LABEL AHORA TIENE EL BOTÓN DE LIMPIAR AL LADO */}
          <div className="flex items-center gap-2 mb-2 ml-1">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tema o Contenido a Evaluar
            </label>
            
            {problems && problems.length > 0 && (
              <button
                onClick={onClear}
                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Limpiar todos los ejercicios de la pantalla"
                type="button" // Para evitar que envíe formularios si lo hubiera
              >
                <Eraser size={14} /> 
              </button>
            )}
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={topic}
              onChange={handleInput}
              className={`w-full pl-9 pr-4 ${inputClass}`}
              placeholder="Ej: Fracciones, Geometría..."
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => selectTopic(s)}
                    className="px-4 py-2.5 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <span
                      style={
                        s.tipo === "conamat"
                          ? { color: "#FF6384", fontWeight: "bold" } // 🔥 'Rojo Bonito' sutil
                          : { color: "#3B82F6", fontWeight: "500" } // Azul estándar para academia
                      }
                    >
                      {s.nombre}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-2 uppercase">
                      {s.tipo}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ZONA 2: FILTROS */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 items-end">
          <div className="w-1/3 md:w-auto">
            <label className={labelClass}>Grado</label>
            <select
              value={config.grade}
              onChange={(e) => handleChange("grade", e.target.value)}
              className={`w-full md:w-24 px-2 ${inputClass}`}
            >
              <option value="3ro">3ro</option>
              <option value="4to">4to</option>
              <option value="5to">5to</option>
              <option value="6to">6to</option>
            </select>
          </div>
          <div className="w-1/3 md:w-auto">
            <label className={labelClass}>Nivel</label>
            <select
              value={config.difficulty}
              onChange={(e) => handleChange("difficulty", e.target.value)}
              className={`w-full md:w-32 px-2 ${inputClass}`}
            >
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Experto">Experto</option>
              <option value="Concurso">Mixto</option>
            </select>
          </div>
        </div>

        {/* ZONA 3: ACCIONES (Corregida alineación y eliminado el ojo) */}
        {/* 🔥 CAMBIO: Usamos 'items-end' en lugar de 'items-center' para que todo toque el suelo */}
        <div className="flex items-end gap-2 ml-auto shrink-0 border-l pl-4 border-gray-100 dark:border-gray-700">
          <div>
            <label className={`${labelClass} text-center ml-0`}>Cant.</label>
            <input
              type="number"
              min="1"
              max="20"
              value={config.quantity}
              onChange={(e) =>
                handleChange("quantity", parseInt(e.target.value) || 1)
              }
              className={`w-14 text-center font-bold ${inputClass}`}
            />
          </div>

          <div className="flex gap-2 h-10">
            <button
              onClick={onGenerate}
              disabled={isGenerating || !topic}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-6 rounded-xl font-bold transition-all shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="animate-spin">↻</span>
              ) : (
                <Sparkles size={18} />
              )}
              <span className="hidden md:inline">Generar</span>
            </button>

            <button
              onClick={onSimulacro}
              className="w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 transition-colors"
              title="Simulacro Rápido"
            >
              <Dices size={20} />
            </button>
          </div>

          {/* BOTÓN GUARDAR (Alineado y sin el ojo) */}
          {problems.length > 0 && (
            <div className="flex items-center gap-2 h-10 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

              <button
                onClick={onSave}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 h-full rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                title="Guardar en Base de Datos"
              >
                {isSaving ? (
                  <span className="animate-spin">↻</span>
                ) : (
                  <Save size={18} />
                )}
                <span className="hidden lg:inline">Guardar</span>
              </button>
            </div>
          )}

          {/* Zoom Controls (Alineados al fondo también) */}
          <div className="hidden xl:flex items-center gap-1 ml-1 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700 h-10">
            <button
              onClick={onZoomOut}
              className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md text-gray-500"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={onZoomIn}
              className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md text-gray-500"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* BARRA EXTRA MÓVIL */}
      <div className="flex xl:hidden justify-end items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button onClick={onZoomOut}>
          <ZoomOut size={16} className="text-gray-400" />
        </button>
        <button onClick={onZoomIn}>
          <ZoomIn size={16} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
