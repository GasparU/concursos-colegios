import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Sparkles, LayoutGrid } from "lucide-react";
import ExamCard from "../../components/exam/ExamCard";

export default function StudentExamList() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 💡 Aseguramos que empiece cargando
    setLoading(true); 

    api.get("/exams/student/list")
      .then((res) => {
        setExams(res.data);
      })
      .catch((err) => {
        console.error("❌ Error al cargar lista:", err);
      })
      .finally(() => {
        // 🔥 El 'finally' se ejecuta siempre (si sale bien o mal)
        // así ahorras líneas y te aseguras de apagar el cargando.
        setLoading(false); 
      });
  }, []);

  // 🚀 LÓGICA DE ENRUTAMIENTO ESTUDIANTE
  const handleAction = (id: string, isCompleted: boolean) => {
    if (isCompleted) {
      // Si ya la hizo, va a ver qué falló y la explicación de la IA
      navigate(`/student/results/${id}`);
    } else {
      // Si no la ha hecho, va a la pantalla de pre-aviso antes de iniciar
      navigate(`/student/exam-prestart/${id}`);
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-black text-indigo-600 dark:text-indigo-400 animate-pulse uppercase tracking-widest">
      Preparando tus prácticas...
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* Encabezado del Estudiante */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tighter">
            <LayoutGrid className="text-indigo-600" /> Mis Exámenes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Entrena duro para ser la mejor en CONAMAT. ¡Tú puedes, ARiana!
          </p>
        </div>
        
        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-2">
          <Sparkles className="text-indigo-600 dark:text-indigo-400" size={18} />
          <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
            {exams.filter(e => e.isCompleted).length} / {exams.length} Pruebas Listas
          </span>
        </div>
      </div>

      {/* Grid de Cards (Sin tachitos de basura) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {exams.map((exam) => (
          <ExamCard 
            key={exam.id} 
            exam={exam} 
            onAction={handleAction} 
          />
        ))}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-[2rem] border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No hay exámenes asignados por ahora.</p>
        </div>
      )}
    </div>
  );
}