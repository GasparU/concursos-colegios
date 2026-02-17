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
import { useThemeStore } from "../store/themeStore";
import { useUiStore } from "../store/uiStore";

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { sidebarOpen, toggleSidebar } = useUiStore();

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
      className={`bg-white dark:bg-gray-900 h-screen shadow-lg flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo y botón colapsar */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {sidebarOpen && (
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            STEM AI
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            } ${!sidebarOpen ? "justify-center" : ""}`}
            title={!sidebarOpen ? item.label : ""}
          >
            <item.icon size={20} className={sidebarOpen ? "mr-3" : ""} />
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className={`flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition ${
            !sidebarOpen ? "justify-center" : ""
          }`}
          title={!sidebarOpen ? (darkMode ? "Modo claro" : "Modo oscuro") : ""}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {sidebarOpen && (
            <span className="ml-3">
              {darkMode ? "Modo claro" : "Modo oscuro"}
            </span>
          )}
        </button>
        <button
          onClick={logout}
          className={`flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition ${
            !sidebarOpen ? "justify-center" : ""
          }`}
          title={!sidebarOpen ? "Cerrar sesión" : ""}
        >
          <LogOut size={18} />
          {sidebarOpen && <span className="ml-3">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
