import { Outlet, NavLink } from 'react-router-dom';
import { BrainCircuit, GraduationCap, BarChart3, Settings, Moon, Sun, } from 'lucide-react';

import clsx from 'clsx';
import { useUiStore } from '../store/uiStore';

export const DashboardLayout = () => {
  const { theme, toggleTheme } = useUiStore();


  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR FIJO (Sin hover, ancho constante) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        
        {/* Header del Sidebar */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-900/20">S</div>
          <div className="ml-3 flex flex-col">
            <span className="font-bold text-white tracking-wide">STEM AI</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">MVP Ariana</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-10"
            title={theme === 'dark' ? "Modo Claro" : "Modo Oscuro"}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        

        {/* Navegación */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          <div className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Docente</div>
          <NavItem to="/" icon={<BrainCircuit size={18} />} label="Generador IA" />
          
          <div className="px-3 mb-2 mt-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Estudiante</div>
          <NavItem to="/student/exam" icon={<GraduationCap size={18} />} label="Sala de Examen" />
          <NavItem to="/progress" icon={<BarChart3 size={18} />} label="Progreso" />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/50">
           <NavItem to="/settings" icon={<Settings size={18} />} label="Configuración" />
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-white">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => clsx(
      "flex items-center h-10 px-3 rounded-md transition-all duration-200 group",
      isActive 
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/10" 
        : "hover:bg-slate-800 hover:text-white text-slate-400"
    )}
  >
    <span className={clsx("mr-3", ({ isActive }: any) => isActive ? "text-indigo-200" : "text-slate-500 group-hover:text-white")}>{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </NavLink>
);