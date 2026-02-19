import { useState } from "react";
import { useParametricGenerator } from "../../hooks/useParametricGenerator";

export default function ParametricTestPage() {
  const { generarProblema, problema, loading } = useParametricGenerator();
  const [plantillaId, setPlantillaId] = useState("canje_monetario_01");

  const handleGenerate = async () => {
    await generarProblema(plantillaId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generador paramétrico</h1>
      <div className="mb-4 flex gap-2">
        <select
          value={plantillaId}
          onChange={(e) => setPlantillaId(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="canje_monetario_01">Canje monetario 1</option>
          <option value="canje_monetario_02">Canje monetario 2</option>
          <option value="fraccion_fraccion_01">
            Fracción de fracción 1 (reparto)
          </option>
          <option value="fraccion_fraccion_02">
            Fracción de fracción 2 (consumo)
          </option>
          <option value="mcm_coincidencia_01">MCM coincidencia</option>
          <option value="mcm_encuentro_02">MCM encuentro</option>
          <option value="mcd_reparto_01">MCD reparto</option>
          <option value="mcd_baldosas_02">MCD baldosas</option>
          <option value="proporcionalidad_compuesta_01">
            Proporcionalidad compuesta
          </option>
          <option value="porcentaje_01">Porcentaje descuento</option>
          <option value="porcentaje_02">Porcentaje aumento</option>
          <option value="regla_tres_simple_01">Regla de tres simple</option>
          <option value="regla_tres_compuesta_01">
            Regla de tres Compuesta
          </option>
          <option value="ecuacion_simple_unificada">
            Ecuación suma/resta/multiplicacion/division
          </option>
        </select>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generando..." : "Generar problema"}
        </button>
      </div>

      {problema && (
        <div>
          <p>{problema.enunciado}</p>
          <p>
            Respuesta:{" "}
            {typeof problema.respuesta === "object"
              ? `${problema.respuesta.numerador}/${problema.respuesta.denominador}`
              : problema.respuesta}
          </p>
        </div>
      )}
    </div>
  );
}
