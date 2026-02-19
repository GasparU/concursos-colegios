import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

export default function DocenteLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* 1. SIDEBAR DESKTOP (Oculto en móvil) */}
      <div className="hidden md:flex flex-col h-full shrink-0 z-20">
        <Sidebar />
      </div>

      {/* 2. SIDEBAR MÓVIL (Drawer) */}
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-[70] shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Botón cerrar dentro del drawer */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 rounded-full"
        >
          <X size={20} />
        </button>
        {/* Renderizamos Sidebar en modo móvil */}
        <Sidebar isMobile={true} onClose={() => setMobileOpen(false)} />
      </div>

      {/* 3. ÁREA PRINCIPAL */}
      <main className="flex-1 h-full overflow-hidden flex flex-col relative w-full">
        {/* 🔥 HEADER MÓVIL: Esto soluciona el problema de solapamiento */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 active:scale-95 transition-transform"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-slate-800 dark:text-white">
              STEM AI
            </span>
          </div>
          {/* Aquí podrías poner el avatar del usuario si quisieras */}
        </div>

        {/* CONTENIDO SCROLLABLE */}
        {/* Ya no necesita padding top extra porque el Header Móvil ocupa su espacio */}
        <div className="flex-1 overflow-y-auto w-full p-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
