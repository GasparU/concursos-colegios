import React from "react";

export const StatisticsTable: React.FC<{ visualData: any }> = ({
  visualData,
}) => {
  if (!visualData) return null;
  const { type, headers, rows, data, colorAccent, valorPorSimbolo } =
    visualData;

  // Normalizamos la entrada de datos
  const items = Array.isArray(rows) ? rows : Array.isArray(data) ? data : [];

  if (items.length === 0) return null;

  return (
    <div className="w-full my-2 overflow-hidden border border-slate-400 rounded-sm shadow-sm">
      <table className="min-w-full text-center border-collapse text-[11px]">
        <thead
          style={{ backgroundColor: colorAccent || "#333" }}
          className="text-white"
        >
          <tr className="divide-x divide-white/10">
            {headers &&
              headers.map((h: string, idx: number) => (
                <th
                  key={idx}
                  className="px-2 py-1.5 font-black uppercase tracking-tighter"
                >
                  {h}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {items.map((row: any, rIdx: number) => (
            <tr
              key={rIdx}
              className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}
            >
             {Array.isArray(row)
            ? row.map((cell: any, cIdx: number) => (
                <td
                  key={cIdx}
                  className="px-2 py-2 text-slate-900 font-bold border-x border-slate-100 first:border-l-0 last:border-r-0"
                >
                  {/* 🔥 EL CAMBIO ESTÁ AQUÍ 🔥 */}
                  {type === "pictogram_table" && cIdx === 1
                    ? "📚".repeat(Math.min(Number(cell), 7)) 
                    : typeof cell === "number"
                      ? Number(cell.toFixed(2)) // Si es número (ej. 11.5), máximo 2 decimales. Si es entero (15), sale entero.
                      : cell} {/* Si es un "?" o texto, lo pinta tal cual sin errores */}
                  {/* 🔥 FIN DEL CAMBIO 🔥 */}
                </td>
              ))
            : null}
            </tr>
          ))}
        </tbody>
      </table>
      {valorPorSimbolo && (
        <div className="bg-amber-50 text-amber-900 text-[9px] p-1.5 font-black text-center border-t border-slate-200 uppercase">
          Escala: 1 📚 = {valorPorSimbolo} unidades
        </div>
      )}
    </div>
  );
};
