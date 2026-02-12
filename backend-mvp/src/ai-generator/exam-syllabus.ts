export const TEMARIO_3RO = {
    clasificatoria: [
        "Sistema posicional (hasta 4 cifras)",
        "Relación de orden (<, >, =) hasta 4 cifras",
        "Operaciones combinadas (+, -, x, ÷) naturales",
        "Doble, triple, cuádruple y mitad (hasta 3 cifras)",
        "Equivalencias de monedas y billetes (hasta S/200)",
        "Fracciones: Representación gráfica",
        "Suma/Resta de fracciones homogéneas",
        "Geometría: Triángulos y clasificación",
        "Cuadriláteros (Trapecio, rectángulo, cuadrado)",
        "Perímetro de figuras básicas",
        "Estadística: Gráfico de barras y pictogramas"
    ],
    final: [
        "Fracciones equivalentes",
        "Progresión aritmética simple",
        "Simetría y figuras simétricas",
        "Área de figuras geométricas (cuadricula/fórmula)",
        "Sucesos seguros, probables e improbables",
        "Tablas de doble entrada complejas",
        "Operaciones combinadas con problemas de texto"
    ]
};

export const TEMARIO_4TO = {
    clasificatoria: [
        "Descomposición polinómica (4 cifras)",
        "Operaciones combinadas (+, -, x, ÷)",
        "Fracciones equivalentes",
        "Suma/Resta de fracciones heterogéneas",
        "Decimales: Suma/Resta (al décimo)",
        "Geometría: Segmentos y Ángulos",
        "Polígonos (elementos y clasificación)",
        "Círculo y Circunferencia",
        "Estadística: Tablas de doble entrada"
    ],
    final: [
        "Progresión aritmética avanzada",
        "Tabla de proporcionalidad directa",
        "Sólidos: Cubo y Prisma regular",
        "Gráficos de líneas y pictogramas complejos",
        "Probabilidad: Sucesos numéricos",
        "Problemas de canjes monetarios complejos",
        "Áreas y Perímetros combinados"
    ]
};

export const TEMARIO_5TO = {
    clasificatoria: [
        "Operaciones con decimales (2 decimales)",
        "Fracciones homogéneas/heterogéneas",
        "Sucesiones con un patrón",
        "Proporcionalidad directa simple",
        "Equivalencia de monedas (S/.)",
        "Ángulos agudos, rectos, obtusos",
        "Rectas paralelas y perpendiculares",
        "Perímetro de cuadrados y rectángulos",
        "Área de triángulos rectángulos",
        "Sucesos seguro/imposible/probable",
        "Gráficos de barras simples"
    ],
    final: [
        "Operaciones combinadas decimales",
        "Fracción de una fracción",
        "Sucesiones con dos patrones intercalados",
        "Proporcionalidad inversa",
        "Canjes monetarios complejos",
        "Bisectriz de ángulos",
        "Perímetro de figuras compuestas",
        "Área de regiones sombreadas",
        "Probabilidad básica (dados)",
        "Gráficos circulares interpretación",
        "Promedio simple"
    ]
};

export const TEMARIO_6TO = {
    clasificatoria: [
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
        "Media aritmética simple"
    ],
    final: [
        "Operaciones combinadas con fracciones y decimales",
        "MCD y MCM problemas complejos",
        "Números primos avanzados",
        "Proporcionalidad compuesta (doble)",
        "Intereses simples básicos",
        "Geometría de sólidos: prismas, cubos",
        "Volumen de sólidos regulares",
        "Probabilidad de eventos compuestos",
        "Gráficas estadísticas combinadas",
        "Moda y media aplicadas"
    ]
};


export const SYLLABUS_DB: any = {
    "3ro": TEMARIO_3RO,
    "4to": TEMARIO_4TO,
    "5to": TEMARIO_5TO,
    "6to": TEMARIO_6TO
};

export const EXAM_BLUEPRINT: any = {
    '3ro': {
        clasificatoria: [
            { course: 'Números y Operaciones', quantity: 10 },
            { course: 'Geometría Básica', quantity: 6 },
            { course: 'Estadística Básica', quantity: 4 }
        ],
        final: [
            { course: 'Números y Operaciones', quantity: 9 },
            { course: 'Geometría Básica', quantity: 7 },
            { course: 'Estadística Básica', quantity: 4 }
        ]
    },
    '4to': {
        clasificatoria: [
            { course: 'Números y Operaciones', quantity: 9 },
            { course: 'Geometría Básica', quantity: 7 },
            { course: 'Estadística Básica', quantity: 4 }
        ],
        final: [
            { course: 'Números y Operaciones', quantity: 8 },
            { course: 'Geometría Básica', quantity: 8 },
            { course: 'Estadística Básica', quantity: 4 }
        ]
    },
    '5to': {
        clasificatoria: [
            { course: 'Aritmética', quantity: 9 },
            { course: 'Álgebra', quantity: 5 },
            { course: 'Geometría', quantity: 6 }
        ],
        final: [
            { course: 'Aritmética', quantity: 8 },
            { course: 'Álgebra', quantity: 6 },
            { course: 'Geometría', quantity: 6 }
        ]
    },
    '6to': {
        clasificatoria: [
            { course: 'Aritmética', quantity: 8 },
            { course: 'Álgebra', quantity: 6 },
            { course: 'Geometría', quantity: 6 }
        ],
        final: [
            { course: 'Aritmética', quantity: 7 },
            { course: 'Álgebra', quantity: 7 },
            { course: 'Geometría', quantity: 6 }
        ]
    }
};