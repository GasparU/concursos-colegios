import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { useUiStore } from "../store/uiStore";

export default function StudentLayout() {
  const { sidebarOpen } = useUiStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Sidebar Fijo */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-slate-50 border-r border-slate-200 transition-all duration-300 ease-in-out
          ${isMobile 
            ? (mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full w-64") 
            : (sidebarOpen ? "translate-x-0 w-64" : "translate-x-0 w-20")
          }
        `}
      >
        <Sidebar />
      </aside>

      {/* Overlay Móvil */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Contenedor de Contenido */}
      <div
        className={`
          flex-1 flex flex-col min-w-0 h-full transition-all duration-300
          ${!isMobile ? (sidebarOpen ? "pl-64" : "pl-20") : "pl-0"}
        `}
      >
        {/* Botón Menú Móvil */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="fixed top-[10px] right-3 z-50 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* CAMBIO CLAVE: Quitamos overflow-hidden y ponemos overflow-y-auto */}
        <main className="flex-1 h-full w-full overflow-y-auto bg-white relative scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}