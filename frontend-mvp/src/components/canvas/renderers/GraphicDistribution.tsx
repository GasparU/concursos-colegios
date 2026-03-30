import React from "react";

export const GraphicDistribution: React.FC<{ data: any }> = ({ data }) => {
  const { shape, figures } = data;

  const colorTexto = (val: string) => (val === 'X' || val === 'x' ? 'text-red-600' : 'text-slate-800');

  // CONTENEDOR GENERAL PARA ALINEAR LAS 3 FIGURAS
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-wrap justify-around items-center bg-white p-4 md:p-6 rounded-xl border border-slate-200 mt-4 gap-4 md:gap-6 w-full shadow-sm overflow-x-auto">
      {children}
    </div>
  );

  if (!figures || figures.length === 0) return null;

  switch (shape) {
    // 1. HOMBRECITOS (El Clásico)
    case "stickman":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-24 h-36 flex flex-col items-center mt-2">
              <div className="w-12 h-12 border-4 border-green-500 rounded-full flex items-center justify-center font-black text-xl z-10 bg-white shadow-sm">
                <span className={colorTexto(fig.center)}>{fig.center}</span>
              </div>
              <div className="w-1 h-12 bg-green-500 relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-green-500 rounded-full"></div>
                <div className="absolute top-0 -left-12 font-bold text-lg bg-white px-1">{fig.v1}</div>
                <div className="absolute top-0 left-9 font-bold text-lg bg-white px-1">{fig.v2}</div>
              </div>
              <div className="relative w-20 h-12">
                <div className="absolute top-0 left-1/2 w-1 h-14 bg-green-500 origin-top -rotate-[35deg] -translate-x-1/2 rounded-full"></div>
                <div className="absolute top-0 left-1/2 w-1 h-14 bg-green-500 origin-top rotate-[35deg] -translate-x-1/2 rounded-full"></div>
                <div className="absolute bottom-0 -left-2 font-bold text-lg bg-white px-1">{fig.v3}</div>
                <div className="absolute bottom-0 -right-2 font-bold text-lg bg-white px-1">{fig.v4}</div>
              </div>
            </div>
          ))}
        </Wrapper>
      );

    // 2. ASTERISCO / CRUZ
    case "asterisk":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-32 h-32 flex items-center justify-center mt-4">
              <div className="absolute w-full h-1 bg-indigo-500 rounded-full"></div>
              <div className="absolute w-1 h-full bg-indigo-500 rounded-full"></div>
              <div className="z-10 w-12 h-12 bg-white border-4 border-indigo-500 flex items-center justify-center font-black text-xl shadow-sm">
                <span className={colorTexto(fig.center)}>{fig.center}</span>
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-lg bg-white px-1">{fig.v1}</div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-bold text-lg bg-white px-1">{fig.v2}</div>
              <div className="absolute top-1/2 -left-8 -translate-y-1/2 font-bold text-lg bg-white px-1">{fig.v3}</div>
              <div className="absolute top-1/2 -right-8 -translate-y-1/2 font-bold text-lg bg-white px-1">{fig.v4}</div>
            </div>
          ))}
        </Wrapper>
      );

    // 3. CASITA
    case "house":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-28 h-36 flex flex-col items-center mt-2">
              <div className="absolute -top-4 right-4 w-6 h-8 bg-orange-500 rounded-t-sm flex items-start justify-center pt-1 font-bold text-white text-sm">{fig.v4}</div>
              <div className="relative w-full h-14 flex justify-center items-end z-10">
                <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute top-0 left-0 overflow-visible">
                  <polygon points="50,5 5,50 95,50" fill="#fff7ed" stroke="#f97316" strokeWidth="4" strokeLinejoin="round" />
                </svg>
                <div className="relative z-10 font-black text-xl mb-1">{fig.v1}</div>
              </div>
              <div className="relative w-[85%] h-20 border-x-4 border-b-4 border-orange-500 bg-white flex flex-col items-center justify-between p-1 z-10">
                <div className="w-full flex justify-between px-2 mt-1">
                  <div className="w-7 h-7 border-2 border-orange-500 flex items-center justify-center font-bold bg-orange-50">{fig.v2}</div>
                  <div className="w-7 h-7 border-2 border-orange-500 flex items-center justify-center font-bold bg-orange-50">{fig.v3}</div>
                </div>
                <div className="w-8 h-10 border-t-2 border-x-2 border-orange-500 bg-orange-50 flex items-center justify-center font-black text-lg">
                  <span className={colorTexto(fig.center)}>{fig.center}</span>
                </div>
              </div>
            </div>
          ))}
        </Wrapper>
      );

    // 4. TRIÁNGULO CLÁSICO
    case "triangle":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-28 h-28 flex items-center justify-center mt-6 mb-2">
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0 overflow-visible">
                <polygon points="50,10 90,90 10,90" fill="#f0fdf4" stroke="#22c55e" strokeWidth="4" />
              </svg>
              <span className={`z-10 font-black text-2xl mt-4 ${colorTexto(fig.center)}`}>{fig.center}</span>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-lg bg-white px-2 rounded-md">{fig.v1}</div>
              <div className="absolute -bottom-4 -left-4 font-bold text-lg bg-white px-2 rounded-md">{fig.v2}</div>
              <div className="absolute -bottom-4 -right-4 font-bold text-lg bg-white px-2 rounded-md">{fig.v3}</div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-bold text-lg bg-white px-2 rounded-md border border-green-200">{fig.v4}</div>
            </div>
          ))}
        </Wrapper>
      );

    // 5. CÍRCULO CON X (4 Cuadrantes)
    case "circle_x":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-28 h-28 rounded-full border-4 border-blue-500 bg-blue-50 overflow-hidden flex items-center justify-center mt-2 shadow-sm">
              <div className="absolute w-[150%] h-1 bg-blue-500 rotate-45"></div>
              <div className="absolute w-[150%] h-1 bg-blue-500 -rotate-45"></div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-lg bg-white/80 px-1 rounded">{fig.v1}</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-lg bg-white/80 px-1 rounded">{fig.v2}</div>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-lg bg-white/80 px-1 rounded">{fig.v3}</div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-lg bg-white/80 px-1 rounded">{fig.v4}</div>
              <div className="z-10 w-10 h-10 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className={`font-black text-lg ${colorTexto(fig.center)}`}>{fig.center}</span>
              </div>
            </div>
          ))}
        </Wrapper>
      );

    // 6. CRUZ DE CAJAS
    case "box_cross":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-32 h-32 flex items-center justify-center mt-2">
              <div className="absolute top-0 w-10 h-10 border-2 border-red-500 flex items-center justify-center font-bold bg-red-50">{fig.v1}</div>
              <div className="absolute bottom-0 w-10 h-10 border-2 border-red-500 flex items-center justify-center font-bold bg-red-50">{fig.v2}</div>
              <div className="absolute left-0 w-10 h-10 border-2 border-red-500 flex items-center justify-center font-bold bg-red-50">{fig.v3}</div>
              <div className="absolute right-0 w-10 h-10 border-2 border-red-500 flex items-center justify-center font-bold bg-red-50">{fig.v4}</div>
              <div className="z-10 w-14 h-14 rounded-md border-4 border-red-600 bg-white flex items-center justify-center shadow-md">
                <span className={`font-black text-xl ${colorTexto(fig.center)}`}>{fig.center}</span>
              </div>
            </div>
          ))}
        </Wrapper>
      );

    // 7. RAÍZ / ÁRBOL DE NODOS
    case "root_node":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-32 h-36 flex flex-col items-center mt-2">
              <div className="z-20 w-10 h-10 rounded-full border-2 border-emerald-600 bg-emerald-50 flex items-center justify-center font-bold relative">{fig.v1}</div>
              <svg className="absolute top-8 w-full h-16 overflow-visible z-0" preserveAspectRatio="none">
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#059669" strokeWidth="2"/>
                <line x1="50%" y1="100%" x2="15%" y2="150%" stroke="#059669" strokeWidth="2"/>
                <line x1="50%" y1="100%" x2="50%" y2="150%" stroke="#059669" strokeWidth="2"/>
                <line x1="50%" y1="100%" x2="85%" y2="150%" stroke="#059669" strokeWidth="2"/>
              </svg>
              <div className="z-10 w-12 h-12 rounded-md border-4 border-emerald-600 bg-white flex items-center justify-center mt-1 shadow-sm">
                <span className={`font-black text-xl ${colorTexto(fig.center)}`}>{fig.center}</span>
              </div>
              <div className="flex w-full justify-between mt-3 z-10 px-2">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-600 bg-emerald-50 flex items-center justify-center font-bold text-sm">{fig.v2}</div>
                <div className="w-8 h-8 rounded-full border-2 border-emerald-600 bg-emerald-50 flex items-center justify-center font-bold text-sm">{fig.v3}</div>
                <div className="w-8 h-8 rounded-full border-2 border-emerald-600 bg-emerald-50 flex items-center justify-center font-bold text-sm">{fig.v4}</div>
              </div>
            </div>
          ))}
        </Wrapper>
      );

    // 8. TAZA / VASO
    case "cup":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-28 h-28 flex flex-col items-center justify-end mt-4">
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0 overflow-visible">
                <polygon points="10,20 90,20 70,90 30,90" fill="#fef08a" stroke="#ea580c" strokeWidth="4" strokeLinejoin="round"/>
              </svg>
              <span className={`z-10 font-black text-2xl mb-4 ${colorTexto(fig.center)}`}>{fig.center}</span>
              <div className="absolute -top-2 left-0 w-8 h-8 bg-white border-2 border-orange-500 rounded-full flex items-center justify-center font-bold shadow-sm">{fig.v1}</div>
              <div className="absolute -top-2 right-0 w-8 h-8 bg-white border-2 border-orange-500 rounded-full flex items-center justify-center font-bold shadow-sm">{fig.v2}</div>
              <div className="absolute -bottom-4 left-4 w-8 h-8 bg-white border-2 border-orange-500 rounded-md flex items-center justify-center font-bold">{fig.v3}</div>
              <div className="absolute -bottom-4 right-4 w-8 h-8 bg-white border-2 border-orange-500 rounded-md flex items-center justify-center font-bold">{fig.v4}</div>
            </div>
          ))}
        </Wrapper>
      );

    // 9. TABLA 2x2 CON BASE
    case "grid_2x2":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative flex flex-col items-center mt-2 shadow-sm border-4 border-slate-700 rounded-md overflow-hidden w-24">
              <div className="flex w-full border-b-2 border-slate-700 bg-white">
                <div className="w-1/2 h-10 border-r-2 border-slate-700 flex items-center justify-center font-bold text-lg">{fig.v1}</div>
                <div className="w-1/2 h-10 flex items-center justify-center font-bold text-lg">{fig.v2}</div>
              </div>
              <div className="flex w-full border-b-4 border-slate-700 bg-white">
                <div className="w-1/2 h-10 border-r-2 border-slate-700 flex items-center justify-center font-bold text-lg">{fig.v3}</div>
                <div className="w-1/2 h-10 flex items-center justify-center font-bold text-lg">{fig.v4}</div>
              </div>
              <div className="w-full h-12 bg-slate-100 flex items-center justify-center">
                <span className={`font-black text-2xl ${colorTexto(fig.center)}`}>{fig.center}</span>
              </div>
            </div>
          ))}
        </Wrapper>
      );

    // 10. PIRÁMIDE DE CAJAS
    case "tower":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative flex flex-col items-center mt-2 w-32">
              <div className="w-12 h-10 bg-white border-4 border-purple-600 rounded-t-md flex items-center justify-center z-20 shadow-sm relative top-1">
                <span className={`font-black text-xl ${colorTexto(fig.center)}`}>{fig.center}</span>
              </div>
              <div className="flex w-full justify-center z-10 relative top-0.5">
                <div className="w-12 h-10 bg-purple-50 border-2 border-purple-600 flex items-center justify-center font-bold text-lg">{fig.v1}</div>
                <div className="w-12 h-10 bg-purple-50 border-2 border-purple-600 flex items-center justify-center font-bold text-lg">{fig.v2}</div>
              </div>
              <div className="flex w-full justify-center">
                <div className="w-12 h-10 bg-purple-100 border-2 border-purple-600 rounded-bl-md flex items-center justify-center font-bold text-lg">{fig.v3}</div>
                <div className="w-12 h-10 bg-purple-100 border-2 border-purple-600 rounded-br-md flex items-center justify-center font-bold text-lg">{fig.v4}</div>
              </div>
            </div>
          ))}
        </Wrapper>
      );

    // 11. CUADRADO CON ESQUINAS
    case "square":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-24 h-24 border-4 border-blue-500 bg-blue-50 flex items-center justify-center shadow-sm mt-4 mb-2">
              <span className={`font-black text-2xl ${colorTexto(fig.center)}`}>{fig.center}</span>
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center font-bold">{fig.v1}</div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center font-bold">{fig.v2}</div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center font-bold">{fig.v3}</div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center font-bold">{fig.v4}</div>
            </div>
          ))}
        </Wrapper>
      );

    // 12. DIAMANTE / ROMBO
    case "diamond":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-24 h-24 flex items-center justify-center mt-4">
              <div className="absolute inset-0 border-4 border-purple-500 bg-purple-50 rotate-45 shadow-sm"></div>
              <span className={`z-10 font-black text-2xl ${colorTexto(fig.center)}`}>{fig.center}</span>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-lg bg-white px-1">{fig.v1}</div>
              <div className="absolute top-1/2 -right-8 -translate-y-1/2 font-bold text-lg bg-white px-1">{fig.v2}</div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-bold text-lg bg-white px-1">{fig.v3}</div>
              <div className="absolute top-1/2 -left-8 -translate-y-1/2 font-bold text-lg bg-white px-1">{fig.v4}</div>
            </div>
          ))}
        </Wrapper>
      );

    // 13. MOLÉCULA
    case "molecule":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute w-full h-1 bg-teal-500"></div>
              <div className="absolute h-full w-1 bg-teal-500"></div>
              <div className="z-10 w-14 h-14 bg-white border-4 border-teal-500 rounded-full flex items-center justify-center shadow-sm">
                <span className={`font-black text-xl ${colorTexto(fig.center)}`}>{fig.center}</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-9 bg-teal-50 border-2 border-teal-500 rounded-full flex items-center justify-center font-bold">{fig.v1}</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-9 bg-teal-50 border-2 border-teal-500 rounded-full flex items-center justify-center font-bold">{fig.v2}</div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-teal-50 border-2 border-teal-500 rounded-full flex items-center justify-center font-bold">{fig.v3}</div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-teal-50 border-2 border-teal-500 rounded-full flex items-center justify-center font-bold">{fig.v4}</div>
            </div>
          ))}
        </Wrapper>
      );

    // 14. ROBOT
    case "robot":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-24 h-36 flex flex-col items-center mt-2">
              <div className="w-10 h-10 border-4 border-gray-600 bg-gray-100 rounded-md flex items-center justify-center font-bold text-lg z-10">{fig.v1}</div>
              <div className="w-2 h-3 bg-gray-600"></div>
              <div className="relative w-16 h-16 border-4 border-gray-600 bg-gray-50 flex items-center justify-center shadow-sm z-10">
                <span className={`font-black text-xl ${colorTexto(fig.center)}`}>{fig.center}</span>
                <div className="absolute top-2 -left-8 w-6 h-2 bg-gray-600 flex items-center">
                  <div className="absolute -left-6 w-6 h-6 bg-white border-2 border-gray-600 rounded-full flex items-center justify-center font-bold text-sm">{fig.v2}</div>
                </div>
                <div className="absolute top-2 -right-8 w-6 h-2 bg-gray-600 flex items-center">
                  <div className="absolute -right-6 w-6 h-6 bg-white border-2 border-gray-600 rounded-full flex items-center justify-center font-bold text-sm">{fig.v3}</div>
                </div>
              </div>
              <div className="w-12 h-6 border-4 border-gray-600 border-t-0 rounded-b-full flex items-center justify-center bg-gray-200 mt-1 font-bold text-sm">{fig.v4}</div>
            </div>
          ))}
        </Wrapper>
      );

    // 15. FLOR
    case "flower":
      return (
        <Wrapper>
          {figures.map((fig: any, i: number) => (
            <div key={i} className="relative w-28 h-28 flex items-center justify-center mt-2">
              <div className="absolute -top-3 w-10 h-10 bg-pink-100 border-2 border-pink-400 rounded-full flex items-center justify-center font-bold text-pink-700">{fig.v1}</div>
              <div className="absolute -bottom-3 w-10 h-10 bg-pink-100 border-2 border-pink-400 rounded-full flex items-center justify-center font-bold text-pink-700">{fig.v2}</div>
              <div className="absolute -left-3 w-10 h-10 bg-pink-100 border-2 border-pink-400 rounded-full flex items-center justify-center font-bold text-pink-700">{fig.v3}</div>
              <div className="absolute -right-3 w-10 h-10 bg-pink-100 border-2 border-pink-400 rounded-full flex items-center justify-center font-bold text-pink-700">{fig.v4}</div>
              <div className="z-10 w-12 h-12 bg-yellow-300 border-4 border-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                <span className={`font-black text-xl ${colorTexto(fig.center)}`}>{fig.center}</span>
              </div>
            </div>
          ))}
        </Wrapper>
      );

    default:
      return null;
  }
};