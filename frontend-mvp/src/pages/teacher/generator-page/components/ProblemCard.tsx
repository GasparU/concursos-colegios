import { useState } from "react";
import { ChevronDown, RefreshCw, Pencil, Check, X, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import Latex from "react-latex-next";
import clsx from "clsx";
import { renderVisualEmbed } from "../utils/visualHelpers";

interface ProblemCardProps {
  problem: any;
  index: number;
  theme: string;
  currentFont: string;
  onRegenerate: () => void;
  onUpdate: (newText: string) => void; // 🔥 Nueva prop para guardar la edición
  onDelete: () => void;
}


// 🔥 PARSER QUIRÚRGICO: Limpia asteriscos e interpreta tags [COL]
const renderCustomText = (text: string, isDark: boolean) => {
  if (!text) return null;
  // Primero exterminamos asteriscos que la IA mande por error
  const cleanText = text.replace(/\*\*/g, "");
  // Separamos por nuestros tags personalizados
  const parts = cleanText.split(/(\[COL\].*?\[\/COL\])/g);

  return parts.map((part, i) => {
    if (part.startsWith("[COL]") && part.endsWith("[/COL]")) {
      const content = part.replace("[COL]", "").replace("[/COL]", "");
      return (
        <span
          key={i}
          className={clsx(
            "font-extrabold px-1 rounded-md transition-colors mx-0.5",
            isDark ? "text-indigo-300 bg-indigo-900/30" : "text-indigo-700 bg-indigo-50"
          )}
        >
          {content}
        </span>
      );
    }
    return part;
  });
};


export default function ProblemCard({
  problem,
  index,
  theme,
  currentFont,
  onRegenerate,
  onUpdate,
  onDelete,
}: ProblemCardProps) {
  const isDark = theme === "dark";

  // Estado local para la edición
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(problem.question_markdown);

  const handleSaveEdit = () => {
    onUpdate(editedText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(problem.question_markdown);
    setIsEditing(false);
  };

  // Colores definidos
  const textBodyColor = isDark ? "text-slate-300" : "text-slate-800";
  const textStrongColor = isDark ? "text-indigo-300" : "text-indigo-700";
  const solutionBg = isDark ? "bg-slate-900/50" : "bg-slate-50";
  const solutionText = isDark ? "text-slate-300" : "text-slate-700";

  return (
    <div
      className={`rounded-xl shadow-sm border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 ${
        isDark
          ? "bg-slate-800 border-slate-700 shadow-slate-900/50"
          : "bg-white border-slate-200"
      }`}
    >
      {/* HEADER */}
      <div
        className={`px-3 py-1.5 border-b flex justify-between items-center ${
          isDark
            ? "bg-slate-700/50 border-slate-700"
            : "bg-slate-50/80 border-slate-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              isDark
                ? "bg-indigo-500/20 text-indigo-300"
                : "bg-indigo-100 text-indigo-700"
            }`}
          >
            {index + 1}
          </span>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? "text-indigo-300" : "text-indigo-600"
            }`}
          >
            Pregunta {index + 1}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span
            className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-tight mr-2 ${
              isDark
                ? "bg-slate-700 text-slate-400"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {problem.topic}
          </span>

          {/* 🔥 BOTÓN ELIMINAR */}
          {!isEditing && (
            <button
              onClick={onDelete}
              className={`p-1.5 rounded-full transition-colors ${
                isDark
                  ? "text-slate-400 hover:text-red-400 hover:bg-slate-700"
                  : "text-slate-400 hover:text-red-600 hover:bg-red-50"
              }`}
              title="Eliminar este problema"
            >
              <Trash2 size={14} />
            </button>
          )}
          {/* 🔥 BOTÓN EDITAR */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={`p-1.5 rounded-full transition-colors ${
                isDark
                  ? "text-slate-400 hover:text-amber-300 hover:bg-slate-700"
                  : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
              }`}
              title="Editar manualmente"
            >
              <Pencil size={14} />
            </button>
          )}

          {/* BOTÓN REGENERAR (Solo visible si no editas) */}
          {!isEditing && (
            <button
              onClick={onRegenerate}
              className={`p-1.5 rounded-full transition-colors ${
                isDark
                  ? "text-slate-400 hover:text-indigo-300 hover:bg-slate-700"
                  : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
              title="Regenerar con IA"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="p-2">
        {/* 🔥 ZONA DE EDICIÓN O VISUALIZACIÓN */}
        {isEditing ? (
          <div className="mb-4 animate-in fade-in zoom-in-95 duration-200">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className={`w-full h-32 p-3 text-sm rounded-lg border focus:ring-2 outline-none transition-all resize-y ${
                isDark
                  ? "bg-slate-900 border-slate-600 text-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                  : "bg-white border-slate-300 text-slate-800 focus:border-indigo-500 focus:ring-indigo-200"
              }`}
              placeholder="Escribe aquí la pregunta..."
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
              >
                <X size={14} /> Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition shadow-sm"
              >
                <Check size={14} /> Confirmar Cambios
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`prose max-w-none mb-1 ${currentFont} ${isDark ? "prose-invert" : "prose-slate"}`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[
                [
                  rehypeKatex,
                  {
                    strict: false, // 🔥 ESTO: Le dice a KaTeX que no sea tan llorón con la Ñ
                    throwOnError: false, // Evita que la app se rompa si hay un error de sintaxis
                  },
                ],
              ]}
              components={{
                p: ({ children }) => (
                  <p className={`mb-3 leading-relaxed ${textBodyColor}`}>
                    {typeof children === 'string' ? renderCustomText(children, isDark) : children}
                  </p>
                ),
                li: ({ children }) => (
                  <li className={`ml-4 ${textBodyColor}`}>
                    {typeof children === 'string' ? renderCustomText(children, isDark) : children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className={textStrongColor}>{children}</strong>
                ),
                h1: ({ children }) => (
                  <h1
                    className={`text-xl font-bold mt-4 mb-2 ${isDark ? "text-slate-100" : "text-slate-900"}`}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    className={`text-lg font-bold mt-3 mb-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}
                  >
                    {children}
                  </h2>
                ),
              }}
            >
              {problem.question_markdown}
            </ReactMarkdown>
          </div>
        )}

       {/* GRAFICO (Lienzo blanco intacto) */}
        {!isEditing && problem.visual_data && (
          <div className="my-1 flex justify-center overflow-hidden border border-transparent">
            <div className="w-full flex items-center justify-center">
              {(() => {         
                let parsedVisual = problem.visual_data;
                
                if (parsedVisual?.visualData) {
                  parsedVisual = parsedVisual.visualData;
                }
                return renderVisualEmbed(parsedVisual, problem.math_data);
              })()}
            </div>
          </div>
        )}

        {/* 🔥 ALTERNATIVAS EN LISTA VERTICAL (ESTILO PROFESIONAL LETRAS) */}
        {problem.options && !isEditing && (
          <div className="flex flex-col gap-2 mb-4 mt-2 px-1">
            {Object.entries(problem.options).map(([key, val]) => (
              <div
                key={key}
                className={clsx(
                  "flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-default shadow-sm",
                  key === problem.correct_answer
                    ? isDark
                      ? "bg-emerald-900/20 border-emerald-500/50 text-emerald-300"
                      : "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : isDark
                      ? "bg-slate-900/40 border-slate-700 text-slate-400"
                      : "bg-slate-50/50 border-slate-100 text-slate-700",
                )}
              >
                {/* Letra indicadora (A, B, C...) */}
                <span
                  className={clsx(
                    "shrink-0 w-6 h-6 flex items-center justify-center rounded-md font-black text-[10px] shadow-sm",
                    key === problem.correct_answer
                      ? "bg-emerald-500 text-white"
                      : isDark
                        ? "bg-slate-700 text-slate-500"
                        : "bg-white text-slate-400 border border-slate-200",
                  )}
                >
                  {key}
                </span>

                {/* Texto de la opción - Alineado a la izquierda y sin truncate */}
                <div className="flex-1 text-[13px] font-bold leading-tight pt-0.5">
                  <Latex strict={false}>{String(val)}</Latex>
                </div>

                {/* Check de "Correcta" para el Docente */}
                {key === problem.correct_answer && (
                  <Check size={14} className="text-emerald-500 shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* 🔥 SOLUCIÓN COMPACTA */}
        <details
          className={`group border-t pt-2 mt-1 transition-colors ${
            isDark ? "border-slate-700" : "border-slate-100"
          }`}
        >
          <summary
            className={`flex items-center gap-2 cursor-pointer select-none font-bold text-xs mb-3 transition-colors w-fit px-2 py-1 rounded ${
              isDark
                ? "text-slate-400 hover:text-indigo-300 hover:bg-slate-700"
                : "text-slate-400 hover:text-indigo-600 hover:bg-slate-50"
            }`}
          >
            <span>VER SOLUCIÓN PASO A PASO</span>
            <ChevronDown
              size={14}
              className="group-open:rotate-180 transition-transform"
            />
          </summary>

          <div
            className={`p-4 rounded-lg leading-relaxed overflow-x-auto ${currentFont} ${solutionBg} ${solutionText}`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkBreaks]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0">
                    {typeof children === 'string' ? renderCustomText(children, isDark) : children}
                  </p>
                ),
                li: ({ children }) => (
                  <li className="ml-4 mb-1 marker:text-indigo-400">
                    {typeof children === 'string' ? renderCustomText(children, isDark) : children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className={textStrongColor}>{children}</strong>
                ),
              }}
            >
              {problem.solution_markdown}
            </ReactMarkdown>
          </div>
        </details>
      </div>
    </div>
  );
}
