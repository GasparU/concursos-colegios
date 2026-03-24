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
  "5to": [
    // 🔴 TEMARIO OFICIAL CONAMAT
    { nombre: "Cuatro operaciones y Operaciones combinadas", tipo: "conamat", subtipos: ["operaciones_combinadas"] },
    { nombre: "Teoría de números: Divisibilidad", tipo: "conamat", subtipos: ["criterios_divisibilidad", "multiplos", "propiedades_multiplos"] },
    { nombre: "Números primos", tipo: "conamat", subtipos: [] },
    { nombre: "Fracciones: Clases y operaciones", tipo: "conamat", subtipos: ["suma_resta_fracciones", "comparacion_fracciones", "fracciones_basicas"] },
    { nombre: "Fracción de una fracción", tipo: "conamat", subtipos: ["fraccion_de_una_fraccion", "reparto_sucesivo", "consumo_volumen"] },
    { nombre: "Números decimales (Operaciones)", tipo: "conamat", subtipos: [] },
    { nombre: "Equivalencia y cambio monetario", tipo: "conamat", subtipos: ["canje_monetario", "vuelto_compra", "presupuesto_gastos"] },
    { nombre: "Proporcionalidad directa e inversa", tipo: "conamat", subtipos: ["magnitudes_proporcionales", "magnitudes_prop."] },
    { nombre: "Regla de tres simple y compuesta", tipo: "conamat", subtipos: ["directa", "rendimiento", "rendimiento_equipo"] },
    { nombre: "Porcentajes y Descuentos", tipo: "conamat", subtipos: ["descuento", "aumento"] },
     { nombre: "Magnitudes Proporcionales (DP e IP)", tipo: "aritmetica", subtipos: ["magnitudes_proporcionales_dp", "magnitudes_proporcionales_ip", "magnitudes_proporcionales_mixta", "magnitudes_proporcionales_ecuacion"] },

    // GEOMETRÍA
    { nombre: "Segmentos", tipo: "conamat", subtipos: ["segmentos"] },
    { nombre: "Ángulos y Bisectriz", tipo: "conamat", subtipos: ["angulos_radiales", "angulos_teoricos"] },
    { nombre: "Rectas paralelas y perpendiculares", tipo: "conamat", subtipos: ["paralelas_ecuaciones", "paralelas_serrucho", "paralelas_abanico", "rectas_secantes"] },
    { nombre: "Triángulos (Propiedades y Perímetros)", tipo: "conamat", subtipos: ["triangulo_angulos", "triangulo_perimetro", "perimetro_escalera"] },
    { nombre: "Figuras planas: Áreas y perímetros", tipo: "conamat", subtipos: ["area_triangulo", "area_rectangulo", "area_rombo", "area_trapecio", "area_paralelogramo"] },
    { nombre: "Área de regiones sombreadas", tipo: "conamat", subtipos: ["area_sombreada"] },
    { nombre: "Sólidos 3D: Prisma y Paralelepípedo", tipo: "conamat", subtipos: ["volumen_prisma", "volumen_prisma_triangular"] },
    { 
      nombre: "Sólidos Geométricos: Cubo y Prisma", 
      tipo: "geometria", 
      subtipos: ["cubo_conamat_area_volumen", "cubo_conamat_aristas", "cubo_grafico_volumen_basico", "cubo_grafico_area_intermedio"] 
    },

    // ESTADÍSTICA Y PROBABILIDAD
    { nombre: "Gráficos estadísticos (barras, poligonales, circulares)", tipo: "conamat", subtipos: ["grafico_barras", "grafico_barras_doble", "grafico_circular", "tabla_frecuencias", "pictograma"] },
    { nombre: "Sucesos numéricos probables e improbables", tipo: "conamat", subtipos: ["probabilidad_basica", "probabilidad_fraccion", "suceso_contrario", "extraccion_doble"] },

    // RAZONAMIENTO MATEMÁTICO
    { nombre: "Sucesiones numéricas y alfabéticas",tipo: "conamat", subtipos: ["sucesion_numerica", "sucesion_alfabetica","sucesion_alfanumerica", "sucesion_algebraica", "sucesion_intercalada", "sucesion_cuadratica"] },
    { nombre: "Operadores Matemáticos", tipo: "conamat", subtipos: ["lineal", "cuadratico", "fraccionario", "anidado"] },
    { nombre: "Criptoaritmética", tipo: "conamat", subtipos: ["criptoaritmetica"] },
    { nombre: "Problemas de Edades", tipo: "conamat", subtipos: ["problemas_edades"] },
    { nombre: "Planteo de Ecuaciones", tipo: "conamat", subtipos: ["planteo_ecuaciones"] },

    // 🔵 TEMARIO ACADEMIA (Requisitos y Complementos)
    { nombre: "MCD y MCM (Requisito)", tipo: "academia", subtipos: ["coincidencia_tiempo", "encuentro_amigos", "reparto_equitativo", "baldosas_piso"] },
    { nombre: "Descomposición Polinómica (Requisito)", tipo: "academia", subtipos: ["descomposicion_polinomica"] },
    { nombre: "Leyes de Exponentes y Radicación (Requisito)", tipo: "academia", subtipos: ["teoria_exponentes", "radicacion"] },
    { nombre: "Ecuaciones e Inecuaciones (Requisito)", tipo: "academia", subtipos: ["lineal", "sueldo_minimo", "punto_equilibrio", "area_maxima", "maximizar_productos"] },
    { nombre: "Teorema de Pitágoras y T. Notables (Requisito)", tipo: "academia", subtipos: ["teorema_pitagoras", "triangulos_notables"] },
    { nombre: "Promedios (Requisito)", tipo: "academia", subtipos: ["agregar_numero", "promedio_ponderado", "promedio_geometrico", "eliminar_numero"] },
    { nombre: "Analogías Numéricas (Requisito)", tipo: "academia", subtipos: ["analogias_numericas"] },

    { nombre: "Distribuciones Gráficas (Requisito)", tipo: "academia", subtipos: ["distribucion_grafica"] },
    { nombre: "Métodos Operativos: Cangrejo y Rectángulo (Requisito)", tipo: "academia", subtipos: ["cangrejo_3_pasos", "cangrejo_4_pasos", "rectangulo_entero", "rectangulo_decimal"] },
    { nombre: "Sólidos 3D: Cilindros y Pirámides (Complemento)", tipo: "academia", subtipos: ["volumen_cilindro", "volumen_piramide"] },
    { nombre: "Polinomios: Valor Numérico (Complemento)", tipo: "academia", subtipos: ["polinomios"] },
    { nombre: "Plano Cartesiano y Distancias (Complemento)", tipo: "academia", subtipos: ["plano_cartesiano"] },
    { nombre: "Intervalos Numéricos (Complemento)", tipo: "academia", subtipos: ["intervalos"] },
    { nombre: "Circunferencia y Propiedades (Complemento)", tipo: "academia", subtipos: ["angulos_circunferencia", "propiedades_circunferencia", "segmentos_circunferencia"] },
    { nombre: "Conteo de Figuras y Paginación (Complemento)", tipo: "academia", subtipos: ["conteo_figuras", "paginacion_1cifra", "paginacion_2cifras", "paginacion_3cifras", "paginacion_general"] },
    { nombre: "Conjuntos y Diagramas de Venn (Extra)", tipo: "academia", subtipos: ["dos_conjuntos_sin_fuera", "dos_conjuntos_con_fuera", "tres_conjuntos_solo_chocolate", "porcentajes_ninguno", "venn_grafico_elementos", "conjunto_unitario", "comprension_conjuntos"] },
    { nombre: "Fracciones Especiales: Grifos y Caños (Extra)", tipo: "academia", subtipos: ["dos_llenan", "llena_y_vacia", "tres_llenan", "con_apertura_diferida"] },
    { nombre: "Teorema de Thales (Extra)", tipo: "academia", subtipos: ["thales"] },
    { 
      nombre: "Adición y Sustracción en Z", 
      tipo: "algebra", 
      subtipos: ["z_adicion_sustraccion"] 
    },
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