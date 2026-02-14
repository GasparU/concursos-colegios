// 🔥 TEMARIO OFICIAL CONAMAT (5to y 6to Grado Primaria)
// Fuente: Bases oficiales + Syllabus Minedu

export const CONAMAT_TOPICS = {
  ARITMETICA: [
    // --- NÚMEROS Y OPERACIONES ---
    "Conjuntos: Pertenencia, Inclusión y Operaciones",
    "Numeración y Valor Posicional (Hasta millones)",
    "Cuatro Operaciones (Naturales, Decimales, Fracciones)",
    "Operaciones Combinadas (Resultado decimal aprox. al centésimo)",
    "Sucesiones Numéricas (Dos criterios de formación)",
    "Sucesiones Alfanuméricas",
    "Divisibilidad, Números Primos y Compuestos",
    "MCD y MCM",
    "Potenciación: Cuadrado y Cubo (< 50)",
    "Radicación Básica",

    // --- FRACCIONES Y DECIMALES ---
    "Fracciones: Adición/Sustracción (Homogéneas/Heterogéneas)",
    "Fracción de una Fracción",
    "Números Decimales: Operaciones y Generatriz",

    // --- PROPORCIONALIDAD Y FINANZAS ---
    "Razones y Proporciones",
    "Magnitudes Directa e Inversamente Proporcionales",
    "Regla de Tres Simple (Directa e Inversa)",
    "Porcentajes (Aplicaciones comerciales)",
    "Equivalencia y Canje Monetario",
    "Impuestos e Intereses Simples",
  ],

  ALGEBRA: [
    "Teoría de Exponentes",
    "Expresiones Algebraicas y Grados",
    "Polinomios: Valor Numérico",
    "Productos Notables (Binomio al cuadrado)",
    "Factorización (Factor común)",
    "Ecuaciones de Primer Grado",
    "Inecuaciones Lineales",
    "Sistema de Ecuaciones",
    "Planteo de Ecuaciones (Edades, Móviles)",
  ],

  GEOMETRIA: [
    "Segmentos Colineales",
    "Ángulos Consecutivos",
    "Segmentos y Ángulos (Clasificación)",
    "Rectas Paralelas y Perpendiculares",
    "Triángulos: Propiedades, Líneas Notables, Congruencia",
    "Polígonos y Cuadriláteros",
    "Circunferencia y Círculo",
    "Perímetros de Figuras Planas",
    "Áreas de Regiones Triangulares y Cuadrangulares",
    "Sólidos: Prismas y Cubos (Área Lateral, Total y Volumen)",
  ],

  ESTADISTICA: [
    "Tablas de Frecuencia (Absoluta, Media, Moda)",
    "Gráficos de Barras, Poligonales y Circulares",
    "Sucesos Numéricos y No Numéricos",
    "Probabilidades: Eventos Seguros, Probables e Improbables",
    "Experimentos Aleatorios (Dados, Monedas, Urnas)",
  ],
  FISICA: [
    "Análisis Dimensional (Básico)",
    "Vectores: Resultante y Módulo",
    "Cinemática: MRU (Movimiento Rectilíneo Uniforme)",
    "Cinemática: MRUV (Acelerado)",
    "Caída Libre Vertical",
    "Estática: Diagrama de Cuerpo Libre (DCL)",
    "Estática: Primera Condición de Equilibrio",
    "Dinámica Lineal (F = m.a)",
    "Energía Mecánica",
  ],
} as const;

// Helper para el buscador (Lista plana)
export const ALL_TOPICS = [
    ...CONAMAT_TOPICS.ARITMETICA,
    ...CONAMAT_TOPICS.ALGEBRA,
    ...CONAMAT_TOPICS.GEOMETRIA,
    ...CONAMAT_TOPICS.ESTADISTICA,
    ...CONAMAT_TOPICS.FISICA
].sort()