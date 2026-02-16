// src/lib/topics.ts

// Temario original (lo mantenemos por si acaso, pero no lo usaremos para el autocompletado)
export const TOPICS_BY_GRADE = {
  '3ro': {
    clasificatoria: [ /* ... lista original ... */ ],
    final: [ /* ... lista original ... */ ]
  },
  '4to': { /* ... */ },
  '5to': { /* ... */ },
  '6to': { /* ... */ }
};

// 🔥 NUEVO: Temario por grado SIN DISTINCIÓN DE ETAPA
export const TOPICS_BY_GRADE_ONLY = {
  '3ro': [
    // Temas de 3ro (clasificatoria + final, sin repetir)
    "Sistema posicional (hasta 4 cifras)",
    "Relación de orden (<, >, =) hasta 4 cifras",
    "Operaciones combinadas (+, -, ×, ÷) naturales",
    "Doble, triple, cuádruple y mitad (hasta 3 cifras)",
    "Equivalencias de monedas y billetes (hasta S/200)",
    "Fracciones: Representación gráfica",
    "Suma/Resta de fracciones homogéneas",
    "Fracciones equivalentes",
    "Progresión aritmética simple",
    "Triángulos y clasificación",
    "Cuadriláteros (trapecio isósceles, rectángulo, cuadrado)",
    "Simetría y figuras simétricas",
    "Perímetro de figuras básicas",
    "Área de figuras geométricas (cuadrícula/fórmula)",
    "Tablas de doble entrada",
    "Gráfico de barras y pictogramas",
    "Sucesos seguros, probables e improbables",
    // Final
    "Fracciones equivalentes (avanzado)",
    "Progresión aritmética (problemas)",
    "Simetría avanzada",
    "Área de figuras compuestas",
    "Sucesos numéricos y no numéricos",
    "Tablas de doble entrada complejas",
    "Operaciones combinadas con problemas de texto"
  ],
  '4to': [
    // Clasificatoria
    "Descomposición polinómica (4 cifras)",
    "Operaciones combinadas (+, -, ×, ÷)",
    "Equivalencias y canjes con monedas y billetes",
    "Fracciones equivalentes",
    "Suma/Resta de fracciones heterogéneas",
    "Suma/Resta de decimales (al décimo)",
    "Progresión aritmética",
    "Tabla de proporcionalidad directa",
    "Segmentos y ángulos (clasificación)",
    "Polígonos (elementos y clasificación)",
    "Círculo y circunferencia",
    "Sólidos: cubo, prisma regular",
    "Tabla de doble entrada",
    "Gráfico de barras, pictogramas y gráfico de líneas",
    "Sucesos numéricos y no numéricos probables e improbables",
    // Final
    "Progresión aritmética avanzada",
    "Proporcionalidad directa (problemas)",
    "Áreas y perímetros combinados",
    "Sólidos: área lateral y volumen",
    "Probabilidad de sucesos",
    "Gráficos estadísticos complejos"
  ],
  '5to': [
    // Clasificatoria
    "Operaciones combinadas con decimales (2 decimales)",
    "Suma/Resta de fracciones homogéneas y heterogéneas",
    "Fracción de una fracción",
    "Sucesiones con un patrón",
    "Proporcionalidad directa simple",
    "Equivalencia y canjes de monedas",
    "Ángulos y clasificación",
    "Rectas paralelas y perpendiculares",
    "Perímetro de figuras básicas",
    "Área de triángulos y cuadriláteros",
    "Sucesos numéricos y no numéricos (probables e improbables)",
    "Gráficas estadísticas: barras y poligonales",
    // Final
    "Operaciones combinadas decimales (avanzado)",
    "Fracción de una fracción (problemas)",
    "Sucesiones con dos patrones intercalados",
    "Proporcionalidad inversa",
    "Canjes monetarios complejos",
    "Bisectriz de ángulos",
    "Perímetro de figuras compuestas",
    "Área de regiones sombreadas",
    "Probabilidad básica (dados)",
    "Gráficos circulares e interpretación",
    "Promedio simple"
  ],
  '6to': [
    // Clasificatoria
    "MCD aplicado a problemas prácticos",
    "MCM aplicado a intervalos",
    "Números primos y compuestos",
    "Cuadrados perfectos (1-50)",
    "Proporcionalidad directa/inversa compuesta",
    "Cambio monetario con comisiones",
    "Ángulos entre paralelas",
    "Perímetro y área de triángulos",
    "Circunferencia básica",
    "Tablas de frecuencia",
    "Media aritmética simple",
    "Probabilidad de eventos",
    // Final
    "Operaciones combinadas con fracciones y decimales",
    "MCD y MCM problemas complejos",
    "Números primos avanzados",
    "Proporcionalidad compuesta (doble)",
    "Intereses simples básicos",
    "Sólidos: prismas y cubos (área lateral, total y volumen)",
    "Volumen de sólidos regulares",
    "Probabilidad de eventos compuestos",
    "Gráficas estadísticas combinadas",
    "Moda y media aplicadas"
  ]
} as const;

// Función para obtener temas por grado (sin etapa)
export const getTopicsByGrade = (
  grade: keyof typeof TOPICS_BY_GRADE_ONLY,
): string[] => {
  return TOPICS_BY_GRADE_ONLY[grade]?.slice() || [];
};

// Para compatibilidad con código antiguo, mantenemos la función anterior pero la redirigimos
export const getTopicsByGradeAndStage = (
  grade: string,
  stage?: string,
): string[] => {
  // Validamos que grade sea una clave válida
  if (
    grade === "3ro" ||
    grade === "4to" ||
    grade === "5to" ||
    grade === "6to"
  ) {
    return getTopicsByGrade(grade);
  }
  return [];
};

// Lista plana de todos los temas (para búsqueda global si se desea)
export const ALL_TOPICS = Object.values(TOPICS_BY_GRADE_ONLY).flat().sort();