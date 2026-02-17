import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useUiStore } from "../store/uiStore";

export default function DocenteLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sidebarOpen } = useUiStore();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen">
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-primary-600 text-white rounded-md shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      <div
        className={
          isMobile ? "fixed inset-0 z-40 pointer-events-none" : "block"
        }
      >
        {isMobile && mobileOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 pointer-events-auto"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <div
          className={`
            transition-transform duration-300 ease-in-out
            ${isMobile ? "absolute top-0 left-0 h-full pointer-events-auto" : ""}
            ${isMobile && !mobileOpen ? "-translate-x-full" : "translate-x-0"}
          `}
        >
          <Sidebar />
        </div>
      </div>

      <main
        className={`flex-1 p-4 transition-all duration-300 ${
          !isMobile && sidebarOpen
            ? "ml-64"
            : !isMobile && !sidebarOpen
              ? "ml-20"
              : "ml-0"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
