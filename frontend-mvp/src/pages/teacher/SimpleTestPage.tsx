import { useState } from "react";
import api from "../../services/api";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function SimpleTestPage() {
  const [tipo, setTipo] = useState("operaciones");
  const [problema, setProblema] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generar = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/simple/generar?tipo=${tipo}`);
      setProblema(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generador Simple</h1>
      <div className="flex gap-2 mb-4">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="operaciones">Operaciones combinadas</option>
          <option value="fracciones">Suma/resta de fracciones</option>
          <option value="sucesiones">Sucesiones</option>
        </select>
        <button
          onClick={generar}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generando..." : "Generar problema"}
        </button>
      </div>

      {problema && (
        <div className="border rounded-lg p-4 bg-white shadow">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {problema.enunciado}
            </ReactMarkdown>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="font-semibold">Respuesta:</p>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(problema.respuesta, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
