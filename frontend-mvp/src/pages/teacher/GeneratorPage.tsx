import { useEffect, useRef, useState } from 'react';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { useExamStore } from '../../store/examStore';
import { useUiStore } from '../../store/uiStore';
import { MafsGeometryRenderer } from '../../components/canvas/renderers/MafsGeometryRenderer';
import { PureSvgPhysicsRenderer } from '../../components/canvas/renderers/PureSvgPhysicsRenderer';
import ReactMarkdown from 'react-markdown';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useNavigate } from 'react-router-dom';
import { ALL_TOPICS } from '../../lib/topics';
import { normalizeText } from '../../lib/utils';
import { 
    Sparkles, Dices, Search, Zap, Brain, 
    ChevronDown, Save,
     ZoomIn, ZoomOut, Eye 
} from 'lucide-react';
import clsx from 'clsx';
import axios from 'axios';
import { Toaster, toast } from "sonner";
import remarkBreaks from "remark-breaks";

// 🔥 CSS PARA LATEX INLINE CORREGIDO
import 'katex/dist/katex.min.css'; 


export const GeneratorPage = () => {
  const { generate } = useProblemGenerator();
  const setGlobalProblem = useExamStore((state) => state.setProblem);
  const { fontSize, theme, increaseFont, decreaseFont, sidebarOpen, toggleSidebar } = useUiStore();
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragPos, setDragPos] = useState({ x: 20, y: 20 });
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const abortControllerRef = useRef(false); 

  const fontSizes = { 0: 'text-xs', 1: 'text-sm', 2: 'text-base', 3: 'text-lg' };
  const currentFont = fontSizes[fontSize as keyof typeof fontSizes];

  useEffect(() => {
    const startX = window.innerWidth / 2 - 160;
    const startY = window.innerHeight / 2 - 100;
    setDragPos({ x: startX, y: startY });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingPanel) return;
      setDragPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const handleMouseUp = () => setIsDraggingPanel(false);

    if (isDraggingPanel) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingPanel]);

  const startDrag = (e: React.MouseEvent) => {
    setIsDraggingPanel(true);
    dragOffset.current = {
      x: e.clientX - dragPos.x,
      y: e.clientY - dragPos.y,
    };
  };

  const [config, setConfig] = useState({
    grade: '6to',
    stage: 'clasificatoria',
    difficulty: 'Intermedio',
    model: 'deepseek' as 'deepseek' | 'gemini',
    quantity: 1
  });

  const handleChange = (field: string, value: any) => setConfig(prev => ({ ...prev, [field]: value }));

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTopic(val);
    if (val.length > 1) {
      const search = normalizeText(val);
      const filtered = ALL_TOPICS.filter(t => normalizeText(t).includes(search));
      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  };

  const selectTopic = (t: string) => {
    setTopic(t);
    setSuggestions([]);
  };
 
  const handleGenerate = async () => {
    abortControllerRef.current = false;
    setSuggestions([]);
    if (!topic) return;
    
    // Limpiamos para examen nuevo
    setProblems([]); 
    setIsGenerating(true);
    setProgress(0); // Reiniciamos barra
    if (sidebarOpen) toggleSidebar();

    const totalToGenerate = config.quantity; // Ej: 20
    let successCount = 0;
    const MAX_SAFETY_ATTEMPTS = totalToGenerate * 4;

    let generatedCount = 0;
    let safetyAttempts = 0;
    // 🔥 AQUI ESTÁ EL FOR QUE FALTABA
    // En lugar de pedir 'config.quantity' de golpe, hacemos un bucle.
    while (generatedCount < totalToGenerate && safetyAttempts < MAX_SAFETY_ATTEMPTS) {
      if (abortControllerRef.current) {
        console.log("🛑 Generación abortada por el usuario");
        setIsGenerating(false);
        break; 
      }

      safetyAttempts++;
      try {
        const randomTotal = Math.floor(Math.random() * (250 - 30) + 30);
        const forbiddenCoef = [2, 3, 5][Math.floor(Math.random() * 3)];
        const newCoef = Math.floor(Math.random() * 7) + 4; // Genera coeficientes entre 4 y 10
        const variable = ["x", "y", "m", "k", "a"][
          Math.floor(Math.random() * 5)
        ];

        // 1. Preparamos Estilos para dar variedad (Caos)
        const chaosInstruction = `
            VARIACIÓN OBLIGATORIA ${generatedCount + 1}:
            - Usa la variable '${variable}' como incógnita.
            - El valor TOTAL o resultado final debe rondar: ${randomTotal}.
            - PROHIBIDO usar el coeficiente ${forbiddenCoef}x. Usa otros como ${newCoef}${variable}.
            - Asegura que la respuesta sea un número entero o decimal simple.
            `;

        // 2. Pedimos SOLO 1 problema (quantity: 1)
        // Esto tarda 40s, que es aceptable y no da Timeout.
        const result = await generate(
          topic,
          config.grade,
          config.stage,
          config.difficulty,
          config.model,
          1,
          chaosInstruction,
        );

        if (result) {
          const rawData = (result as any).data || result;
          // 3. Pintamos INMEDIATAMENTE al recibirlo
          const newProblem = Array.isArray(rawData) ? rawData[0] : rawData;

          if (newProblem) {
            setProblems((prev) => {
              // Si es el primero, lo ponemos como global para preview inmediata
              if (prev.length === 0) setGlobalProblem(newProblem);
              return [...prev, newProblem];
            });
            successCount++;
            generatedCount++;
          }
          
          // Scroll suave hacia abajo
          setTimeout(
            () =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              }),
            100,
          );
        }
      } catch (e) {
        console.error(
          `⚠️ Falló problema ${e}, pero seguimos con el resto.`,
        );
      }
      // D. Actualizamos Barra de Progreso
      const porcentaje = Math.round((generatedCount / totalToGenerate) * 100);
      setProgress(porcentaje);

      // Scroll suave para que el profe vea que aparecen
      // window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
    const porcentaje = Math.round((generatedCount / totalToGenerate) * 100);
    setProgress(porcentaje); 

    setIsGenerating(false);
    if (successCount === 0) {
      toast.error("No se pudo generar ningún problema. Intenta con otro tema.");
    } else {
      toast.success(`¡Examen listo! ${successCount} problemas generados.`);
    }
  };

  const regenerateOne = async (index: number, currentProblem: any) => {
    // 1. Feedback visual inmediato
    // Ponemos un estado de "cargando" temporal en ese índice (opcional, o usamos toast)
    toast.loading(`Regenerando problema ${index + 1}...`);

    try {
      // 2. Usamos la misma config pero forzamos cantidad 1
      const result = await generate(
        topic,
        config.grade,
        config.stage,
        config.difficulty,
        config.model,
        1,
        `VARIACIÓN ÚNICA: Regeneración del problema ${index + 1}. Usa valores diferentes.`,
      );

      if (result) {
        const rawData = (result as any).data || result;
        const newProblem = Array.isArray(rawData) ? rawData[0] : rawData;

        if (newProblem) {
          // 3. Reemplazo Quirúrgico en el Array
          setProblems((prev) => {
            const updated = [...prev];
            updated[index] = newProblem; // 🔥 Reemplazamos solo este
            return updated;
          });
          toast.dismiss();
          toast.success(`Problema ${index + 1} actualizado.`);
        }
      }
    } catch (e) {
      toast.error("Error al regenerar.");
      console.error(e);
    }
  };

  const handleSaveToDB = async () => {
      if (problems.length === 0) return;
      setIsSaving(true);
      try {
          await axios.post('http://localhost:3000/api/problems/batch', { problems });
          alert("¡Guardado!");
      } catch (error) {
          console.error(error);
          alert("Error al guardar.");
      } finally {
          setIsSaving(false);
      }
  };

  // ⚫ BOTÓN OSCURO: SIMULACRO TIPO CONAMAT (20 Preguntas Variadas)
  const handleSimulacro = async () => {
    // 1. Limpieza inicial
    setSuggestions([]);
    setProblems([]); // Borramos lo anterior para empezar el examen limpio
    setIsGenerating(true);
    if (sidebarOpen) toggleSidebar();

    // 2. Definimos los temas del examen (Mezcla de cursos)
    // Puedes personalizar esta lista si quieres más de un curso que de otro
    const examTopics = [
        "Aritmética: Operaciones Combinadas", "Aritmética: Conjuntos", "Aritmética: Fracciones", "Aritmética: Porcentajes", "Aritmética: Divisibilidad",
        "Álgebra: Ecuaciones", "Álgebra: Potenciación", "Álgebra: Polinomios", "Álgebra: Inecuaciones", "Álgebra: Planteo de Ecuaciones",
        "Geometría: Segmentos y Ángulos", "Geometría: Triángulos", "Geometría: Polígonos", "Geometría: Áreas", "Geometría: Circunferencia",
        "RM: Sucesiones", "RM: Operadores Matemáticos", "RM: Conteo de Figuras", "RM: Planteo de Ecuaciones", "RM: Edades"
    ];

    // Mezclamos los temas al azar
    const shuffledTopics = examTopics.sort(() => Math.random() - 0.5);

    // 3. BUCLE: 20 Preguntas (Una por una)
    for (let i = 0; i < 20; i++) {
        const currentTopic = shuffledTopics[i];
        
        try {
            const randomTotal = Math.floor(Math.random() * (120 - 30) + 30);
            const variable = ['x', 'n', 'y', 'z'][Math.floor(Math.random() * 4)];
            
            const chaosInstruction = `
            PREGUNTA ${i+1} DEL SIMULACRO (${currentTopic}):
            - Usa la variable '${variable}'.
            - Usa valores numéricos cercanos a ${randomTotal}.
            - Evita repetir estructuras de preguntas anteriores.
            `;
            // Pedimos 1 pregunta del tema actual
            const result = await generate(
                currentTopic, 
                config.grade, 
                config.stage, 
                // En simulacro, la dificultad suele ser variada o la que elijas. 
                // Aquí usamos 'Intermedio' o 'Avanzado' según la etapa.
                config.stage === 'final' ? 'Avanzado' : 'Intermedio', 
                config.model, 
                1, 
                chaosInstruction
            );

            if (result) {
                const newProblems = Array.isArray(result) ? result : [result];
                setProblems(prev => {
                    // Si es la primera, la mostramos en grande (opcional)
                    if (prev.length === 0 && newProblems.length > 0) setGlobalProblem(newProblems[0]);
                    return [...prev, ...newProblems];
                });
                
                // Scroll suave para que el profe vea que van llegando
                setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
            }
        } catch (e) {
            console.error(`Error en pregunta ${i+1} del simulacro:`, e);
        }
        
        // Pausa técnica
        await new Promise(r => setTimeout(r, 50));
    }

    setIsGenerating(false);
  };
  
  const renderVisualEmbed = (visualData: any, mathData?: any) => {
    // 1. Filtro básico de existencia
    if (!visualData || visualData.type === "none") return null;

    // 2. 🔥 FILTRO ANTI-BASURA (Nuevo)
    // Si es geometry_mafs, verificamos que tenga elementos VÁLIDOS.
    if (visualData.type === "geometry_mafs") {
      // Si no hay params (nuevo) NI elements (viejo), es basura.
      const tieneDataNueva = mathData && mathData.params;
      const tieneDataVieja =
        visualData.elements && visualData.elements.length > 0;

      if (!tieneDataNueva && !tieneDataVieja) return null;
    }

    return (  
      <div className="my-3 flex justify-center w-full select-none">
        <div className="w-full md:max-w-[500px] h-[300px] bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
          {visualData.type === "geometry_mafs" ? (
            /* 🔥 CLAVE: Le damos prioridad a mathData porque tiene los PARAMS que necesita el nuevo Mafs */
            <MafsGeometryRenderer datosMatematicos={mathData || visualData} />
          ) : visualData.type === "physics_ariana" ? (
            <PureSvgPhysicsRenderer visualData={visualData} />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-400">
              Gráfico: {visualData.type}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`h-full flex flex-col overflow-hidden font-sans transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      {/* HEADER COMPACTO Y FUNCIONAL */}
      <header
        className={`h-auto md:h-14 border-b flex flex-col md:flex-row items-center px-4 gap-2 shrink-0 shadow-sm z-40 sticky top-0 transition-colors ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        {/* CENTRO: BARRA DE HERRAMIENTAS (Sin Título gigante) */}
        <div className="flex-1 flex flex-wrap md:flex-nowrap items-center gap-2 w-full">
          {/* GRADO / ETAPA / DIFICULTAD */}
          <select
            value={config.grade}
            onChange={(e) => handleChange("grade", e.target.value)}
            className={`h-8 text-xs font-bold rounded-lg px-2 outline-none border ${theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
          >
            <option value="5to">5to</option>
            <option value="6to">6to</option>
          </select>
          <select
            value={config.stage}
            onChange={(e) => handleChange("stage", e.target.value)}
            className={`h-8 text-xs font-bold rounded-lg px-2 outline-none border ${theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
          >
            <option value="clasificatoria">Clasificatoria</option>
            <option value="final">Final</option>
          </select>
          <select
            value={config.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className={`h-8 text-xs font-bold rounded-lg px-2 outline-none border w-24 ${theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
          >
            <option value="Básico" disabled={config.stage === "final"}>
              Básico
            </option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
            <option value="Concurso">Nivel Dios</option>
          </select>

          {/* 🔥 SELECTOR DE MODELO (RECUPERADO) */}
          <div
            className={`flex rounded-lg border p-0.5 gap-0.5 h-8 items-center ${theme === "dark" ? "bg-slate-700 border-slate-600" : "bg-slate-100 border-slate-200"}`}
          >
            <button
              onClick={() => handleChange("model", "deepseek")}
              className={`h-full px-2 rounded-md transition-all flex items-center gap-1 text-[10px] font-bold ${config.model === "deepseek" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              title="DeepSeek (Razonamiento)"
            >
              <Brain size={14} /> DS
            </button>
            <button
              onClick={() => handleChange("model", "gemini")}
              className={`h-full px-2 rounded-md transition-all flex items-center gap-1 text-[10px] font-bold ${config.model === "gemini" ? "bg-white text-orange-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              title="Gemini (Velocidad)"
            >
              <Zap size={14} /> GM
            </button>
          </div>

          {/* BUSCADOR */}
          <div className="relative flex-1 min-w-[140px]">
            <Search
              size={14}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={topic}
              onChange={handleInput}
              className={`w-full h-8 pl-8 pr-2 text-xs border rounded-lg outline-none ${theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200"}`}
              placeholder="Tema..."
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <div
                className={`absolute top-full left-0 w-full border rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto z-[100] ${theme === "dark" ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
              >
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => selectTopic(s)}
                    className={`px-3 py-2 text-xs cursor-pointer border-b last:border-0 ${theme === "dark" ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-indigo-50"}`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CANTIDAD Y BOTONES */}
          <input
            type="number"
            min="1"
            max="20"
            value={config.quantity}
            onChange={(e) =>
              handleChange("quantity", parseInt(e.target.value) || 1)
            }
            className={`w-10 h-8 text-center text-xs font-bold rounded-lg border outline-none ${theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className="bg-indigo-600 text-white px-4 h-8 rounded-lg text-xs font-bold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center gap-1 shrink-0"
          >
            {isGenerating ? (
              <span className="animate-spin">↻</span>
            ) : (
              <Sparkles size={14} />
            )}{" "}
            Crear
          </button>

          <button
            onClick={handleSimulacro}
            disabled={isGenerating}
            className="bg-slate-700 text-white px-3 h-8 rounded-lg text-xs font-bold hover:bg-slate-800 transition shadow-sm flex items-center gap-1 shrink-0"
          >
            <Dices size={14} />
          </button>
        </div>

        {/* DERECHA: TOOLS */}
        <div className="hidden md:flex items-center gap-2 border-l pl-3 ml-1 border-slate-200 dark:border-slate-700">
          {problems.length > 0 && (
            <>
              <button
                onClick={handleSaveToDB}
                disabled={isSaving}
                className="text-xs bg-emerald-600 text-white px-3 h-8 rounded-lg font-bold hover:bg-emerald-700 transition flex items-center gap-1"
                title="Guardar"
              >
                {isSaving ? (
                  <span className="animate-spin">↻</span>
                ) : (
                  <Save size={14} />
                )}
              </button>
              <button
                onClick={() => navigate("/student/exam")}
                className="text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-3 h-8 rounded-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1"
                title="Ver como Alumno"
              >
                <Eye size={14} />
              </button>
            </>
          )}
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          <button
            onClick={decreaseFont}
            className="p-1.5 text-slate-400 hover:text-indigo-500"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={increaseFont}
            className="p-1.5 text-slate-400 hover:text-indigo-500"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </header>

      {/* BODY */}
      <div
        className={`flex-1 overflow-y-auto p-4 scrollbar-thin relative ${theme === "dark" ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div className="w-full px-2 mx-auto flex flex-col gap-3 pb-20">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {problems.map((prob, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-sm border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
              >
                <div
                  className={`px-4 py-2 border-b flex justify-between items-center ${theme === "dark" ? "bg-slate-700/50 border-slate-700" : "bg-slate-50/80 border-slate-100"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {index + 1}
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-wide">
                      Pregunta {index + 1}
                    </span>
                    <button
                      onClick={() => regenerateOne(index, prob)}
                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                      title="Regenerar solo esta pregunta"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-refresh-cw"
                      >
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M8 16H3v5" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold uppercase">
                    {prob.topic}
                  </span>
                </div>
                <div className="p-2">
                  {" "}
                  {/* Padding mínimo */}
                  {/* 🔥 ARREGLO DE LATEX: Usamos ReactMarkdown con renderer customizado para <p> que contiene <Latex> */}
                  <div
                    className={`prose prose-slate dark:prose-invert max-w-none mb-3 ${currentFont}`}
                  >
                    {/* Definimos el renderizador seguro fuera o dentro (aquí inline para que sea quirúrgico) */}
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        // 1. Párrafos (Texto normal)
                        p: ({ children }) => (
                          <p
                            className={`mb-2 leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}
                          >
                            {children}
                          </p>
                        ),
                        // 2. Elementos de Lista (Vital para los pasos 1, 2, 3...)
                        li: ({ children }) => (
                          <li
                            className={`ml-4 list-disc ${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}
                          >
                            {children}
                          </li>
                        ),
                        // 3. Títulos (H1, H2, H3...) - Para "Análisis", "Resolución"
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold mt-4 mb-2">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-bold mt-3 mb-2">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-md font-bold mt-3 mb-1 text-indigo-600 dark:text-indigo-400">
                            {children}
                          </h3>
                        ),
                        // 4. Negritas (Strong) - Para que no rompa el LaTeX si hay algo en negrita
                        strong: ({ children }) => (
                          <strong className="font-bold">{children}</strong>
                        ),
                      }}
                    >
                      {/* Renderizamos pregunta o solución usando las mismas reglas */}
                      {prob.question_markdown}
                      {/* (Nota: Haz lo mismo abajo para solution_markdown si están separados) */}
                    </ReactMarkdown>
                  </div>
                  {renderVisualEmbed(prob.visual_data, prob.math_data)}
                  {prob.options && (
                    <div className="flex flex-wrap gap-2 mb-2 items-center justify-center">
                      {" "}
                      {/* Flex wrap para seguridad, pero intenta una línea */}
                      {Object.entries(prob.options).map(([key, val]) => (
                        <div
                          key={key}
                          className={clsx(
                            "flex items-center gap-1.5 px-2 py-1 rounded border transition-all cursor-pointer hover:bg-slate-50",
                            currentFont, // Mantiene tu control de fuente
                            key === prob.correct_answer
                              ? theme === "dark"
                                ? "bg-emerald-900/30 border-emerald-700 text-emerald-400"
                                : "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : theme === "dark"
                                ? "bg-slate-800 border-slate-700 text-slate-300"
                                : "bg-white border-slate-200 text-slate-600",
                          )}
                        >
                          {/* Círculo de la letra (A, B...) más pequeño */}
                          <span
                            className={clsx(
                              "w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold shrink-0",
                              key === prob.correct_answer
                                ? "bg-emerald-600 text-white"
                                : theme === "dark"
                                  ? "bg-slate-700 text-slate-400"
                                  : "bg-slate-100 text-slate-500",
                            )}
                          >
                            {key}
                          </span>

                          {/* Valor de la opción en LaTeX */}
                          <span className="font-medium">
                            <Latex strict={false}>{String(val)}</Latex>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <details className="group border-t pt-1 mt-1 border-slate-100 dark:border-slate-800">
                    <summary className="text-[9px] font-bold text-slate-400 cursor-pointer select-none hover:text-indigo-500 flex items-center gap-1 w-fit">
                      <span>SOLUCIÓN</span>
                      <ChevronDown size={10} />
                    </summary>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed overflow-x-auto">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkBreaks]} // añadido remarkBreaks
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2">{children}</p>
                          ),
                          li: ({ children }) => (
                            <li className="ml-4 list-disc">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold">{children}</strong>
                          ),
                        }}
                      >
                        {prob.solution_markdown}
                      </ReactMarkdown>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
          {isGenerating && (
            <div className="flex justify-center py-4">
              <span className="flex items-center gap-2 text-xs font-bold text-indigo-500 bg-indigo-50 px-4 py-2 rounded-full animate-pulse">
                <Sparkles size={14} className="animate-spin" /> Generando...
              </span>
            </div>
          )}
        </div>
        {/* 🔥 BARRA DE PROGRESO FLOTANTE Y ARRASTRABLE 🔥 */}
        {isGenerating && (
          <div
            // Evento para iniciar el arrastre
            onMouseDown={startDrag}
            className={`fixed w-80 bg-white p-4 rounded-xl shadow-2xl border border-indigo-100 z-[9999] select-none transition-shadow ${isDraggingPanel ? "cursor-grabbing shadow-inner" : "cursor-grab hover:shadow-lg"}`}
            // Aquí aplicamos las coordenadas X e Y dinámicas
            style={{
              left: dragPos.x,
              top: dragPos.y,
              touchAction: "none", // Evita scroll en móviles al arrastrar
            }}
          >
            {/* Cabecera del Widget */}
            <div className="flex justify-between items-center mb-2 pointer-events-none">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                <span className="animate-spin text-lg">↻</span> IA Trabajando
              </span>
              <span className="text-xl font-black text-slate-700">
                {progress}%
              </span>
            </div>

            {/* Barra de Progreso */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2 pointer-events-none">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Texto de Estado */}
            <p className="text-[10px] text-slate-400 font-medium text-center pointer-events-none">
              Generando ejercicio {problems.length + 1} de {config.quantity}...
            </p>

            <button
              onClick={() => {
                abortControllerRef.current = true;
              }} // ⚡ Activa la señal
              className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-md hover:bg-rose-100 transition-colors border border-rose-100"
            >
              CANCELAR
            </button>

            {/* Indicador visual de "Arrástrame" (Opcional) */}
            <div className="absolute top-2 right-2 text-slate-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="19" r="1" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <Toaster richColors position="top-center" closeButton />
    </div>
  );
};