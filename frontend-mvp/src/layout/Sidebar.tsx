import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// 🔥 IMPORTANTE: Ahora solo usamos uiStore (themeStore ya no existe)
import { useUiStore } from "../store/uiStore";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  // 🔥 CONEXIÓN AL STORE UNIFICADO
  // Extraemos 'theme' y 'toggleTheme' del mismo lugar que 'sidebarOpen'
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useUiStore();

  // Helper para saber si es modo oscuro
  const isDark = theme === "dark";

  // En móvil SIEMPRE está expandido visualmente (ocupa todo el drawer)
  const isOpen = isMobile ? true : sidebarOpen;

  const menuItems =
    user?.role === "DOCENTE"
      ? [
          { icon: LayoutDashboard, label: "Dashboard", path: "/teacher" },
          { icon: FileText, label: "Exámenes", path: "/teacher/exams" },
          { icon: Users, label: "Estudiantes", path: "/teacher/students" },
        ]
      : [
          { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
          { icon: FileText, label: "Exámenes", path: "/student/exams" },
          { icon: Users, label: "Resultados", path: "/student/results" },
        ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`
        h-full bg-white dark:bg-gray-900 shadow-xl flex flex-col transition-all duration-300 
        ${isMobile ? "w-full" : "border-r border-gray-200 dark:border-gray-700"} 
        ${!isMobile && (isOpen ? "w-64" : "w-20")}
      `}
    >
      {/* HEADER DEL SIDEBAR */}
      <div
        className={`p-6 flex items-center justify-between ${
          !isOpen && !isMobile ? "justify-center px-2" : ""
        }`}
      >
        {/* LOGO - Oculto si está colapsado en desktop */}
        {(isOpen || isMobile) && (
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              STEM AI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {user?.role === "DOCENTE" ? "Profesor" : "Estudiante"}
            </p>
          </div>
        )}

        {/* BOTÓN COLAPSAR: SOLO visible en Desktop (!isMobile) */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        )}
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={isMobile ? onClose : undefined} // Cerrar al clickear en móvil
            className={`
              flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
              ${
                isActive(item.path)
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }
              ${!isOpen && !isMobile ? "justify-center px-2" : ""}
            `}
            title={!isOpen ? item.label : ""}
          >
            <item.icon
              size={20}
              className={`shrink-0 ${
                isActive(item.path)
                  ? "text-primary-600"
                  : "group-hover:text-primary-600"
              }`}
            />

            {/* Texto: Visible en móvil O si está abierto en desktop */}
            {(isOpen || isMobile) && (
              <span className="ml-3 font-medium truncate">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* BOTÓN MODO OSCURO (CONECTADO A UI STORE) */}
        <button
          onClick={toggleTheme}
          className={`flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition ${
            !isOpen && !isMobile ? "justify-center px-2" : ""
          }`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}

          {(isOpen || isMobile) && (
            <span className="ml-3 text-sm">
              {isDark ? "Modo claro" : "Modo oscuro"}
            </span>
          )}
        </button>

        <button
          onClick={logout}
          className={`flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition ${
            !isOpen && !isMobile ? "justify-center px-2" : ""
          }`}
        >
          <LogOut size={18} />
          {(isOpen || isMobile) && <span className="ml-3 text-sm">Salir</span>}
        </button>
      </div>
    </aside>
  );
}
