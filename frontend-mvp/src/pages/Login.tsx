import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, User, ShieldCheck, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [selectedRole, setSelectedRole] = useState<"ariana" | "papa" | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);

  // 🔥 TUS CORREOS REALES OCULTOS
  const PERFILES = {
    ariana: { 
      email: "estudiante@example.com",
      title: "Soy Ariana",
      subtitle: "Código de Misión",
      icon: <User className="text-emerald-400" size={32} />,
      color: "emerald"
    },
    papa: { 
      email: "docente@example.com",
      title: "Soy Papá",
      subtitle: "Clave de Acceso",
      icon: <ShieldCheck className="text-indigo-400" size={32} />,
      color: "indigo"
    }
  };

  // Auto-focus en el input cuando se selecciona un rol
  useEffect(() => {
    if (selectedRole && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedRole]);

  const handleRoleSelect = (role: "ariana" | "papa") => {
    setError("");
    setPassword("");
    setSelectedRole(role);
  };

  const handleBack = () => {
    setError("");
    setPassword("");
    setSelectedRole(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !password) return;

    setError(""); 
    setLoading(true);

    try {
      const email = PERFILES[selectedRole].email;
      
      const res = await api.post("/auth/login", { 
        email: email, 
        password: password 
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      setUser(user);

      if (user.role === "DOCENTE") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }

    } catch (err: any) {
      console.error("Error login:", err);
      setError(err.response?.data?.message || "Contraseña incorrecta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center p-4 font-sans text-slate-200">
      
      {/* 🚀 LOGO Y TÍTULO */}
      <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
          <Rocket size={32} className="text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 text-center">
          ARIANA MATH QUEST
        </h1>
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase text-center">
          {selectedRole ? "Autenticación requerida" : "Selecciona tu perfil"}
        </p>
      </div>

      {/* ⚠️ MENSAJE DE ERROR */}
      {error && (
        <div className="w-full max-w-md mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-medium text-center animate-in shake">
          {error}
        </div>
      )}

      <div className="w-full max-w-md relative min-h-[220px]">
        
        {/* 🎮 ESTADO 1: SELECTOR DE PERFILES */}
        {!selectedRole && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            {/* BOTÓN ARIANA */}
            <button
              onClick={() => handleRoleSelect("ariana")}
              className="w-full group relative flex items-center p-5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 text-left overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0 mr-4 group-hover:scale-110 transition-transform">
                <User className="text-emerald-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  Soy Ariana
                </h2>
                <p className="text-sm text-slate-400">Acceso a Misiones</p>
              </div>
            </button>

            {/* BOTÓN PAPÁ */}
            <button
              onClick={() => handleRoleSelect("papa")}
              className="w-full group relative flex items-center p-5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 text-left overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0 mr-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-indigo-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  Soy Papá
                </h2>
                <p className="text-sm text-slate-400">Configuración y Reportes</p>
              </div>
            </button>
          </div>
        )}

        {/* 🔐 ESTADO 2: INGRESO DE CONTRASEÑA */}
        {selectedRole && (
          <form 
            onSubmit={handleLogin} 
            className="absolute inset-0 w-full bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${PERFILES[selectedRole].color}-500/20`}>
                {PERFILES[selectedRole].icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {PERFILES[selectedRole].title}
                </h2>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                  {PERFILES[selectedRole].subtitle}
                </p>
              </div>
            </div>

            <div className="relative mb-6 flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <KeyRound size={18} className="text-slate-500" />
              </div>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-${PERFILES[selectedRole].color}-500/50 focus:border-${PERFILES[selectedRole].color}-500 transition-all`}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                loading || !password 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : `bg-${PERFILES[selectedRole].color}-600 hover:bg-${PERFILES[selectedRole].color}-500 hover:-translate-y-0.5`
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> 
                  Verificando...
                </>
              ) : (
                "INICIAR MISIÓN"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}