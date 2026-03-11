import React from 'react';
export const CryptoMultiplication: React.FC<{ data: any }> = ({ data }) => {
  const { operator, rows } = data;
  const maxLength = Math.max(...rows.map((r: string[]) => r.length));
  
  const padRow = (row: string[]) => {
    const padding = Array(maxLength - row.length).fill("");
    return [...padding, ...row];
  };

  const paddedRows = rows.map(padRow);

  return (
    <div className="flex justify-center p-6 bg-white border border-slate-200 shadow-sm mt-4 rounded max-w-md mx-auto">
      <div className="flex flex-col items-end text-xl font-mono leading-relaxed">
        
        {/* FILA 0: MULTIPLICANDO + SIGNO 'X' A LA DERECHA (ARRIBA) */}
        <div className="flex items-center">
          {paddedRows[0].map((c: string, i: number) => (
            <div key={`m0-${i}`} className="w-7 text-center flex-shrink-0 font-semibold text-blue-700">
              {c === "*" ? <span className="text-red-600">✱</span> : c}
            </div>
          ))}
          {/* SIGNO 'X' AQUÍ ARRIBA */}
          <div className="w-7 text-center text-green-500 font-bold ml-4 lowercase">{operator}</div>
        </div>

        {/* FILA 1: MULTIPLICADOR (CON LÍNEA VERDE) */}
        <div className="flex items-center border-b-2 border-green-500 pb-1 mb-1 w-full justify-end">
          {paddedRows[1].map((c: string, i: number) => (
            <div key={`m1-${i}`} className="w-7 text-center flex-shrink-0 font-semibold text-blue-700">
              {c === "*" ? <span className="text-red-600">✱</span> : c}
            </div>
          ))}
          {/* ESPACIO VACÍO PARA ALINEAR CON EL SIGNO DE ARRIBA */}
          <div className="w-7 ml-4"></div>
        </div>

        {/* SUBPRODUCTOS Y RESULTADO SIGUEN LA MISMA LÓGICA... */}
        {paddedRows.slice(2).map((row: string[], rIdx: number) => {
          const isLast = rIdx === paddedRows.slice(2).length - 1;
          const isSubProductLine = paddedRows.length > 3 && rIdx === paddedRows.slice(2).length - 2;

          return (
            <React.Fragment key={`frag-${rIdx}`}>
              <div className={`flex items-center ${isSubProductLine ? "border-b-2 border-green-500 pb-1 mb-1 w-full justify-end" : ""}`}>
                {row.map((c: string, i: number) => (
                  <div key={`c-${rIdx}-${i}`} className="w-7 text-center flex-shrink-0 font-semibold text-blue-700">
                    {c === "*" ? <span className="text-red-600">✱</span> : c === " " ? "" : c}
                  </div>
                ))}
                <div className="w-7 ml-4"></div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};