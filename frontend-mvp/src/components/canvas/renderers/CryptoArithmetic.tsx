import React from "react";

export const CryptoArithmetic: React.FC<{ data: any }> = ({ data }) => {
  const { operator, rows } = data;

  // 1. Encontramos la fila más larga para igualar todas (ej. si suman 99 + 1 = 100)
  const maxLength = Math.max(...rows.map((r: string[]) => r.length));
  
  // 2. Rellenamos con espacios vacíos a la izquierda para que cuadren las unidades con unidades
  const padRow = (row: string[]) => {
    const padding = Array(maxLength - row.length).fill("");
    return [...padding, ...row];
  };

  const paddedRows = rows.map(padRow);

  return (
    <div className="flex justify-center p-6 bg-white border border-slate-200 shadow-sm mt-4 rounded max-w-[280px] mx-auto">
      {/* Redujimos a text-xl y font-mono para un look más "examen" */}
      <div className="flex flex-col items-end text-xl font-mono leading-relaxed">
        
        {/* FILA 1: Números y el Signo a la derecha */}
        <div className="flex items-center">
          {paddedRows[0].map((c: string, i: number) => (
            <div key={`r0-${i}`} className="w-7 text-center flex-shrink-0">
              <span className={c === "*" ? "text-red-600 font-semibold" : "text-blue-700 font-semibold"}>
                {c === "*" ? "✱" : c}
              </span>
            </div>
          ))}
          {/* Signo VISIBLE en la primera línea */}
          <div className="w-7 text-center text-green-500 font-bold ml-2">
            {operator}
          </div>
        </div>
        
        {/* FILA 2: Solo números. Línea divisoria verde abajo */}
        <div className="flex items-center border-b-2 border-green-500 pb-1 mb-1 w-full justify-end">
          {paddedRows[1].map((c: string, i: number) => (
            <div key={`r1-${i}`} className="w-7 text-center flex-shrink-0">
              <span className={c === "*" ? "text-red-600 font-semibold" : "text-blue-700 font-semibold"}>
                {c === "*" ? "✱" : c}
              </span>
            </div>
          ))}
          {/* Fantasma invisible para que no se ruede la línea */}
          <div className="w-7 opacity-0 ml-2">{operator}</div>
        </div>
        
        {/* FILA 3: Resultado */}
        <div className="flex items-center pt-1">
          {paddedRows[2].map((c: string, i: number) => (
            <div key={`r2-${i}`} className="w-7 text-center flex-shrink-0">
              <span className={c === "*" ? "text-red-600 font-semibold" : "text-blue-700 font-semibold"}>
                {c === "*" ? "✱" : c}
              </span>
            </div>
          ))}
          <div className="w-7 opacity-0 ml-2">{operator}</div>
        </div>

      </div>
    </div>
  );
};