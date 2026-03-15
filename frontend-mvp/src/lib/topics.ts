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
    // --- TEMARIO OFICIAL CONAMAT (Rojo/Rosado) ---
    { nombre: "Conjuntos y Diagramas de Venn", tipo: "conamat" },
    { nombre: "Números naturales: operaciones y propiedades", tipo: "conamat" },
    { nombre: "Cuatro operaciones", tipo: "conamat" },
    { nombre: "Relaciones de mayor, menor e igual", tipo: "conamat" },
    { nombre: "Ecuaciones e inecuaciones", tipo: "conamat" },
    { nombre: "Teoría de números: divisibilidad", tipo: "conamat" },
    { nombre: "Números primos", tipo: "conamat" },
    { nombre: "MCD y MCM", tipo: "conamat" },
    { nombre: "Fracciones: clases y operaciones", tipo: "conamat" },
    { nombre: "Fracción de una fracción", tipo: "conamat" },
    { nombre: "Suma y Resta de Fracciones", tipo: "conamat" },
    { nombre: "Números decimales", tipo: "conamat" },
    { nombre: "Operaciones combinadas con decimales", tipo: "conamat" },
    { nombre: "Cuadrado y cubo de un número menor que 20", tipo: "conamat" },
    { nombre: "Equivalencia y cambio monetario", tipo: "conamat" },
    { nombre: "Proporcionalidad directa e inversa", tipo: "conamat" },
    { nombre: "Regla de tres simple", tipo: "conamat" },
    { nombre: "Promedios", tipo: "conamat" },
    { nombre: "Segmentos", tipo: "conamat" },
    { nombre: "Ángulos y Bisectriz", tipo: "conamat" },
    { nombre: "Rectas paralelas y perpendiculares", tipo: "conamat" },
    { nombre: "Triángulos", tipo: "conamat" },
    { nombre: "Figuras planas: Áreas y perímetros", tipo: "conamat" },
    { nombre: "Área de regiones sombreadas", tipo: "conamat" },
    { nombre: "Gráficos estadísticos (barras, poligonales, circulares)", tipo: "conamat" },
    { nombre: "Sucesos numéricos y no numéricos probables e improbables", tipo: "conamat" },
    { nombre: "Sucesiones numéricas y alfabéticas", tipo: "conamat" },
    { nombre: "Operadores Matemáticos", tipo: "conamat" },
    { nombre: "Habilidad y situaciones matemáticas", tipo: "conamat" },

    // --- TEMAS "TIGRE" DE ACADEMIA PRE-U (Azul) ---
    { nombre: "Magnitudes Proporcionales (Tablas DP e IP)", tipo: "academia" },
    { nombre: "Descomposición Polinómica", tipo: "academia" },
    { nombre: "Sucesiones Numéricas (Doble Criterio)", tipo: "academia" },
    { nombre: "Problemas de Edades", tipo: "academia" },
    { nombre: "Planteo de Ecuaciones (Método Rombo)", tipo: "academia" },
    { nombre: "Métodos Operativos (Cangrejo y Rectángulo)", tipo: "academia" },
    { nombre: "Fracciones Especiales (Grifos y Caños)", tipo: "academia" },
    { nombre: "Conteo de Números (Paginación)", tipo: "academia" }
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
): any[] => {
  const topics = TOPICS_BY_GRADE_ONLY[grade] || [];
  
  // Mapeamos la lista: si es un texto viejo, lo vuelve objeto. Si ya es objeto, lo deja igual.
  return topics.map(t => 
    typeof t === 'string' ? { nombre: t, tipo: "conamat" } : t
  );
};

// Para compatibilidad con código antiguo, mantenemos la función anterior pero la redirigimos
export const getTopicsByGradeAndStage = (
  grade: string,
): any[] => { // 🔥 Cambiado a any[] para que acepte los objetos con colores
  // Validamos que grade sea una clave válida
  if (
    grade === "3ro" ||
    grade === "4to" ||
    grade === "5to" ||
    grade === "6to"
  ) {
    return getTopicsByGrade(grade as keyof typeof TOPICS_BY_GRADE_ONLY);
  }
  return [];
};

// Lista plana de todos los temas (para búsqueda global si se desea)
export const ALL_TOPICS = Object.values(TOPICS_BY_GRADE_ONLY).flat().sort();