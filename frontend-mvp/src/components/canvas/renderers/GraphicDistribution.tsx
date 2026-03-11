import React from "react";

export const GraphicDistribution: React.FC<{ data: any }> = ({ data }) => {
  const { shape, figures } = data;

  if (shape === "stickman") {
    return (
      <div className="flex justify-around items-center bg-white p-6 rounded border border-slate-200 shadow-sm mt-4">
        {figures.map((fig: any[], i: number) => (
          <div key={i} className="relative w-24 h-36 flex flex-col items-center mt-2">
            
            {/* Cabeza */}
            <div className="w-12 h-12 border-4 border-green-500 rounded-full flex items-center justify-center font-black text-xl z-10 bg-white">
              <span className={fig[0] === 'x' ? 'text-red-600' : 'text-blue-700'}>{fig[0]}</span>
            </div>
            
            {/* Tronco */}
            <div className="w-1 h-12 bg-green-500 relative">
              
              {/* Brazos (Línea horizontal) */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-green-500"></div>
              
              {/* Números en las manos */}
              <div className="absolute top-0 -left-12 font-bold text-lg text-blue-700 bg-white px-1 leading-none">{fig[1]}</div>
              <div className="absolute top-0 left-9 font-bold text-lg text-blue-700 bg-white px-1 leading-none">{fig[2]}</div>
            </div>
            
            {/* Piernas (V invertida usando rotación) */}
            <div className="relative w-20 h-12">
              <div className="absolute top-0 left-1/2 w-1 h-14 bg-green-500 origin-top -rotate-[35deg] -translate-x-1/2"></div>
              <div className="absolute top-0 left-1/2 w-1 h-14 bg-green-500 origin-top rotate-[35deg] -translate-x-1/2"></div>
              
              {/* Números en los pies */}
              <div className="absolute bottom-0 -left-2 font-bold text-lg text-blue-700 bg-white px-1 leading-none">{fig[3]}</div>
              <div className="absolute bottom-0 -right-2 font-bold text-lg text-blue-700 bg-white px-1 leading-none">{fig[4]}</div>
            </div>

          </div>
        ))}
      </div>
    );
  }

  if (shape === "house") {
    return (
      <div className="flex justify-around items-end bg-white p-6 rounded border border-slate-200 shadow-sm mt-4">
        {figures.map((fig: any, i: number) => (
          <div key={i} className="relative w-28 h-36 flex flex-col items-center">
            
            {/* El Techo (Triángulo SVG) */}
            <div className="relative w-full h-14 flex justify-center items-end">
              <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute top-0 left-0">
                <polygon points="50,5 5,50 95,50" fill="#f0fdf4" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" />
              </svg>
              <div className="relative z-10 font-black text-xl mb-1">
                <span className={fig.techo === 'x' ? 'text-red-600' : 'text-blue-700'}>{fig.techo}</span>
              </div>
            </div>

            {/* El Cuerpo de la Casa */}
            <div className="relative w-[85%] h-20 border-x-4 border-b-4 border-green-500 bg-white flex flex-col items-center justify-between p-1">
              
              {/* Ventanas */}
              <div className="w-full flex justify-between px-2 mt-1">
                <div className="w-7 h-7 border-2 border-green-500 rounded-sm flex items-center justify-center font-bold text-blue-700 bg-blue-50">
                  {fig.v1}
                </div>
                <div className="w-7 h-7 border-2 border-green-500 rounded-sm flex items-center justify-center font-bold text-blue-700 bg-blue-50">
                  {fig.v2}
                </div>
              </div>

              {/* Puerta */}
              <div className="w-8 h-10 border-t-2 border-x-2 border-green-500 bg-green-50 flex items-center justify-center font-bold text-lg">
                <span className={fig.p === 'x' ? 'text-red-600' : 'text-blue-700'}>{fig.p}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    );
  }

  if (shape === "circle") {
    return (
      <div className="flex justify-around items-center bg-white p-6 rounded border border-slate-200 mt-4">
        {figures.map((fig: any, i: number) => (
          <div key={i} className="relative w-28 h-28 flex items-center justify-center">
            {/* Círculo Exterior (Verde) */}
            <div className="absolute inset-0 border-4 border-green-500 rounded-full bg-slate-50"></div>
            {/* Centro */}
            <div className={`z-10 font-black text-2xl ${fig.centro === 'x' ? 'text-red-600' : 'text-blue-700'}`}>
              {fig.centro}
            </div>
            {/* Números Periféricos (Posicionados con transform) */}
            {[0, 1, 2].map((idx) => (
              <div key={idx} 
                className="absolute font-bold text-lg text-blue-700 bg-white px-1 rounded border border-green-200"
                style={{
                  transform: `rotate(${idx * 120}deg) translateY(-55px) rotate(-${idx * 120}deg)`
                }}
              >
                {fig.vals[idx]}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  return null;
};