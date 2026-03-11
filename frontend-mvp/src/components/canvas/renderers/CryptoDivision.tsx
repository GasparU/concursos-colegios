import React from "react";

export const CryptoDivision: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;
  const { dividendo, divisor, cociente, pasos } = data;

  const renderCell = (c: string, i: number) => {
    // Espacio en blanco (mantiene la estructura de la cuadrícula)
    if (c === " ") return <div key={i} className="w-7 h-8" />;
    
    // Rayita de división exacta
    if (c === "-") return <div key={i} className="w-7 h-8 flex items-center justify-center font-bold text-blue-700">-</div>;
    
    // Incógnita: SOLO CUADRADO ROJO, SIN TEXTO
    if (c === "*") return <div key={i} className="w-7 h-8 border-[1.5px] border-red-500 bg-white" />;

    // Número visible: SUELTO EN AZUL
    return <div key={i} className="w-7 h-8 flex items-center justify-center text-xl font-bold text-blue-700 font-mono">{c}</div>;
  };

  return (
    <div className="flex justify-center p-8 bg-white border border-slate-200 shadow-sm mt-4 rounded mx-auto select-none">
      <div className="flex">
        
        {/* LADO IZQUIERDO: Dividendo y cascada */}
        <div className="flex flex-col items-end pr-4">
          <div className="flex gap-1 mb-2">{dividendo.map((c:any, i:any) => renderCell(c, i))}</div>
          
          {pasos.map((p: any, idx: number) => (
            <div key={idx} className="flex flex-col items-end w-full">
              <div className="flex gap-1">{p.producto.map((c:any, i:any) => renderCell(c, i))}</div>
              {/* La línea de resta se dibuja exactamente del ancho del contenido */}
              <div className="w-full border-t-[1.5px] border-slate-400 my-1"></div>
              <div className="flex gap-1 mb-2">{p.resta.map((c:any, i:any) => renderCell(c, i))}</div>
            </div>
          ))}
        </div>

        {/* LADO DERECHO: Divisor y Cociente */}
        <div className="border-l-[2px] border-slate-600 pl-4 h-fit">
          <div className="border-b-[2px] border-slate-600 pb-2 flex gap-1">
            {divisor.map((c:any, i:any) => renderCell(c, i))}
          </div>
          <div className="pt-2 flex gap-1">
            {cociente.map((c:any, i:any) => renderCell(c, i))}
          </div>
        </div>
      </div>
    </div>
  );
};