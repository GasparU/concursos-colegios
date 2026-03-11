export const ANGULOS_CONFIG = {
  // Radios principales – AHORA SÍ, BASTANTE LARGOS
  RADIO_RAYOS: 28.0, // Longitud de los rayos (antes 8.0) – para que lleguen casi al borde
  RADIO_ARCO: -25.0, // Radio del arco (más grande para que sea visible)
  RADIO_TEXTO: 11.0, // Distancia de las etiquetas de los ángulos (un poco más cerca que el rayo)
  RADIO_LETRAS: 30.0, // Distancia de las letras de los puntos (un poco más adentro que el rayo)

  RADIO_PUNTOS: 0.15, // Tamaño de los círculos (ajústalo según prefieras)
  COLOR_PUNTOS: "#2563EB",

  SIMBOLO_FLECHA_OFFSET: 0.5,
  TAMANO_CABEZA_FLECHA: 0.3,

  // Colores
  COLOR_RAYOS: "#36a2eb",
  COLOR_ARCO: "#10B981",
  COLOR_TEXTO: "#1e293b",
  COLOR_RELLENO: "#10B981",
  OPACIDAD_RELLENO: 0.15,
  // Grosores
  GROSOR_RAYOS: 1.5,
  GROSOR_ARCO: 2.0,
  OFFSET_Y: 0.8,
  // Tamaños de letra
  TAMANO_LETRAS_PUNTOS: 20,
  TAMANO_LETRAS_ANGULOS: 15,
};

// src/components/canvas/elements/ConstantesVisuales.ts
export const CONFIG_GEOMETRIA = {
  // Colores
  COLOR_LINEA_PRINCIPAL: "#36a2eb", // azul de segmentos
  COLOR_LINEA_SECUNDARIA: "#10b981", // verde
  COLOR_PUNTO: "#ef4444", // rojo (ya no se usa, pero lo dejamos por si acaso)
  COLOR_TEXTO: "#1e293b", // gris oscuro
  COLOR_RELLENO_ANGULO: "#10b981", // verde para relleno de ángulos
  COLOR_BORDE_ANGULO: "#36a2eb", // verde oscuro para borde de arcos
  OPACIDAD_RELLENO_ANGULO: 0.5, // opacidad del relleno

  // Grosores
  GROSOR_LINEA: 1.5,
  GROSOR_BORDE_ANGULO: 2,

  // Tamaños
  TAMANO_PUNTO: 4,
  TAMANO_TEXTO: 16,
  RADIO_ARCO_ANGULO: 0.2, // radio del arco para ángulos (en unidades del plano) - AUMENTADO
  DISTANCIA_ETIQUETA_ANGULO: 0.5, // distancia desde el vértice para colocar la etiqueta del ángulo

  // Márgenes
  MARGEN_VIEWBOX: 1.8,

  // Factores para paralelas
  RADIO_ARCO_PARALELAS: 0.1, // porcentaje del tamaño de la figura
  DISTANCIA_ETIQUETA_PARALELAS: 2.5, // veces el radio
  OFFSET_LABEL_LINEA: 0.5,
};

export const CONFIG_TRIANGULO_ECUACIONES = {
  MARGEN_VIEWBOX: 1.5,
  MARGEN_PLANO: 1.4,
  ESCALA_ARCO: 0.15,
  VERTICES: [
    {
      id: "A", // Vértice Izquierdo
      tamano: 10,
      distancia: 1.8,
      ajusteX: 0.5,
      ajusteY: -0.1,
      radioArco: 1.1,
    },
    {
      id: "B", // Vértice Derecho
      tamano: 10,
      distancia: 1.8,
      ajusteX: -0.3,
      ajusteY: -0.1,
      radioArco: 1.1,
    },
    {
      id: "C", // Vértice Superior
      tamano: 10,
      distancia: 1.8,
      ajusteX: 0,
      ajusteY: 0.3,
      radioArco: 1.1,
    },
  ],
};

// 🔥 AÑADE ESTO AL FINAL DEL ARCHIVO ConstantesVisuales.ts
export const CONFIG_PARALELAS_ECUACIONES = {
  RADIO_ARCO: 0.6, // Tamaño de la mancha verde de los ángulos
  DISTANCIA_ETIQUETA: 1.5, // Distancia del texto al vértice
  MARGEN_PLANO: 1.5, // "Respiro" de la cámara (zoom out)
};

// 🔥 REEMPLAZA TU CONFIG_PITAGORAS ANTERIOR POR ESTE:
export const CONFIG_PITAGORAS = {
  basico: {
    // 🔍 CONTROL DE ZOOM: Menor valor = Triángulo más gigante. Mayor valor = Más alejado.
    ZOOM_MARGIN: 1.2,
    VERTICES: [
      { id: "C", offset: [-0.6, -0.6] }, // Origen
      { id: "B", offset: [0.6, -0.6] }, // Eje X (Derecha)
      { id: "A", offset: [-0.6, 0.6] }, // Eje Y (Arriba)
    ],
    LADOS: [
      { offset: [0, -1.5] }, // Cateto Base (Abajo)
      { offset: [1.0, 1.0] }, // Hipotenusa (Afuera Derecha-Arriba)
      { offset: [-2, 0] }, // Cateto Altura (Izquierda)
    ],
    ANGULOS: { radio: 2.0, distanciaTexto: 1.5 },
  },
  intermedio: {
    ZOOM_MARGIN: 1.8, // 🔍 Zoom independiente para el intermedio
    VERTICES: [
      { id: "C", offset: [-0.6, -0.6] },
      { id: "B", offset: [0.6, -0.6] },
      { id: "A", offset: [-0.6, 0.6] },
    ],
    LADOS: [
      { offset: [0, -1.0] },
      { offset: [1.5, 1.5] },
      { offset: [-2.0, 0] },
    ],
    ANGULOS: { radio: 2.0, distanciaTexto: 1.5 },
  },
  avanzado: {
    ZOOM_MARGIN: 0.1, // 🔍 Zoom independiente para el avanzado (Ecuaciones largas)
    VERTICES: [
      { id: "C", offset: [-0.2, -0.6] },
      { id: "B", offset: [0.5, -0.6] },
      { id: "A", offset: [-0.5, 0.6] },
    ],
    LADOS: [
      { offset: [0, -0.8] }, // Abajo (muy lejos)
      { offset: [0.8, 0.5] }, // Hipotenusa (muy lejos)
      { offset: [-2, 0] }, // Izquierda (muy lejos)
    ],
    ANGULOS: { radio: 1.4, distanciaTexto: 1.7 },
  },
};

// 🔥 AÑADE ESTO AL FINAL DEL ARCHIVO ConstantesVisuales.ts
export const CONFIG_RECTANGULO = {
  ZOOM_MARGIN: 0.6, // 🔍 Controla el acercamiento/alejamiento general
  ANGULO_RECTO_TAMANO: 0.6, // Tamaño de los cuadraditos verdes de las esquinas
  VERTICES: [
    { id: "A", offset: [-0.6, -0.6] }, // Origen (Abajo-Izquierda)
    { id: "B", offset: [0.6, -0.6] }, // Abajo-Derecha
    { id: "C", offset: [0.6, 0.6] }, // Arriba-Derecha
    { id: "D", offset: [-0.6, 0.6] }, // Arriba-Izquierda
  ],
  LADOS: {
    abajo: { offset: [0, -1.2] }, // Distancia de la ecuación del largo
    izquierda: { offset: [-2.2, 0] }, // Distancia de la ecuación del ancho
  },
};

export const CONFIG_RECTANGULO_DIAGONAL = {
  ZOOM_MARGIN: 1.5,
  ANGULO_RECTO_TAMANO: 0.6,
  PUNTO_COLOR: "#ef4444",
  PUNTO_TAMANO: 5,
  VERTICES: [
    { id: "A", offset: [-0.6, -0.6] },
    { id: "B", offset: [0.6, -0.6] },
    { id: "C", offset: [0.6, 0.6] },
    { id: "D", offset: [-0.6, 0.6] },
  ],
  // 🔥 AÑADE ESTO: Offsets dinámicos dependiendo de en qué lado caiga la P
  PUNTO_P_OFFSETS: [
    [0, 0.6], // 0: Superior (Letra P arriba)
    [0, -0.6], // 1: Inferior (Letra P abajo)
    [0.6, 0], // 2: Derecho (Letra P a la derecha)
    [-0.6, 0], // 3: Izquierdo (Letra P a la izquierda)
  ],
  LADOS: {
    abajo: { offset: [0, -1.0] },
    derecha: { offset: [1.0, 0] },
    // Offsets para el valor de la distancia "dist"
    dist_offsets: [
      [0, 0.8], // 0: Superior
      [0, -0.8], // 1: Inferior
      [0.8, 0], // 2: Derecho
      [-0.8, 0], // 3: Izquierdo
    ],
  },
};

// 🔥 AÑADE ESTO AL FINAL DEL ARCHIVO ConstantesVisuales.ts
export const CONFIG_CUADRADOS_SUPERPUESTOS = {
  ZOOM_MARGIN: 1.5, // 🔍 Control de acercamiento/alejamiento
  VERTICES_GRANDE: [
    { id: "A", offset: [-0.6, -0.6] }, // Abajo Izquierda
    { id: "B", offset: [0.6, -0.6] }, // Abajo Derecha
    { id: "C", offset: [0.6, 0.6] }, // Arriba Derecha
    { id: "D", offset: [-0.6, 0.6] }, // Arriba Izquierda
  ],
  VERTICES_PEQUENO: [
    { id: "P", offset: [-0.5, -0.5] }, // Abajo Izquierda
    { id: "Q", offset: [0.5, -0.5] }, // Abajo Derecha
    { id: "R", offset: [0.5, 0.5] }, // Arriba Derecha
    { id: "S", offset: [-0.5, 0.5] }, // Arriba Izquierda
  ],
};

// 🔥 AÑADE ESTO AL FINAL DEL ARCHIVO ConstantesVisuales.ts
export const CONFIG_AREA_SOMBREADA = {
  ZOOM_MARGIN: 1.5, // 🔍 Control de acercamiento/alejamiento
  VERTICES_CUADRADO: [
    { id: "A", offset: [-0.6, -0.6] }, // Abajo Izquierda
    { id: "B", offset: [0.6, -0.6] }, // Abajo Derecha
    { id: "C", offset: [0.6, 0.6] }, // Arriba Derecha
    { id: "D", offset: [-0.6, 0.6] }, // Arriba Izquierda
  ],
};

// 🔥 AÑADE ESTO AL FINAL DEL ARCHIVO ConstantesVisuales.ts
export const CONFIG_TRIANGULO_CUADRADO_INSCRITO = {
  ZOOM_MARGIN: 1.5,
  VERTICES_TRIANGULO: [
    { id: "A", offset: [-0.6, -0.5] }, // Empujado más a la izquierda
    { id: "C", offset: [0.6, -0.5] }, // Empujado más a la derecha (Es la base AC)
    { id: "B", offset: [0, 0.6] }, // Vértice superior
  ],
  VERTICES_CUADRADO: [
    { id: "P", offset: [0, -0.6] }, // En la base, centrado bajo el punto
    { id: "Q", offset: [0, -0.6] }, // En la base, centrado bajo el punto
    { id: "R", offset: [0.5, 0.5] }, // Esquina superior derecha del cuadradito
    { id: "S", offset: [-0.5, 0.5] }, // Esquina superior izquierda del cuadradito
  ],
};

// 🔥 AÑADE ESTO AL FINAL DEL ARCHIVO ConstantesVisuales.ts
export const CONFIG_REGIONES_COMPUESTAS = {
  ZOOM_MARGIN: 1.5,
  VERTICES: [
    { id: "A", offset: [-0.6, -0.6] }, // Abajo Izq
    { id: "B", offset: [0.6, -0.6] }, // Abajo Der
    { id: "C", offset: [0.6, 0.6] }, // Arriba Der
    { id: "D", offset: [-0.6, 0.6] }, // Arriba Izq
  ],
  PUNTOS_EXTRA: [
    { id: "M", offset: [0.6, 0] }, // Punto en la derecha
    { id: "N", offset: [0, 0.6] }, // Punto arriba
  ],
};

// 🔥 REEMPLAZA ESTO EN ConstantesVisuales.ts
export const CONFIG_ANGULOS_RADIALES = {
  LONGITUD_RAYO: 8,
  RADIO_ARCO_BASE: 1.5,
  RADIO_TEXTO_BASE: 3.6,
  OFFSET_ORIGEN: [-0.4, -0.4],
  OFFSET_ETIQUETA: 1.15,
  ZOOM_MARGIN: 0.5,

  VIEWBOX_DEFAULT_X: [-11, 11],
  VIEWBOX_DEFAULT_Y: [-2, 11],

  // 🔥 AÑADE ESTO: Control individual para los textos de los arcos [X, Y]
  OFFSET_TEXTOS_ARCOS: [
    [0.2, -0.2], // Índice 0: Empuja el primer texto (el de arriba) a la izquierda y arriba
    [-0.2, 0.1], // Índice 1: Empuja el segundo texto (el de abajo) a la izquierda y abajo
    [0, 0], // Índice 2: Por si algún ejercicio tiene un tercer ángulo
    [0, 0], // Índice 3: Por si tiene un cuarto...
    [0, 0], // Índice 4: Por si tiene un quinto...
  ],
};

export const AJUSTES_ESPECIFICOS_RADIALES: Record<string, any> = {
  geo_radiales_suplementarios_01: {
    radioTexto: 1.5, // 🔥 Lo acercamos (estaba en 3.6)
    OFFSET_ETIQUETA: 1,
    viewBoxY: [-0.4, 9], // 🔥 Bajamos la cámara para que no se corte arriba
    offsets: [
      [1, 0.7], // Empuje para 4x + 40 (más arriba)
      [-1, 0.7], // Empuje para 3x (más arriba)
    ],
  },
  // Ajuste para la bisectriz
  geo_bisectriz_basico: {
    viewBoxX: [-11, 11],
    viewBoxY: [-1, 14],
  },
  geo_bisectriz_intermedio: {
    viewBoxX: [-11, 11],
    viewBoxY: [-2, 12],
    radioTexto: 2.5, // Si los quieres más separados en esta figura puntual
  },
  geo_bisectriz_avanzado: {
    viewBoxX: [-11, 11],
    viewBoxY: [-2, 13],
    radioTexto: 3.0, // Como añadimos el arco total gigante, empujamos los textos más afuera
  },
  geo_radiales_experto: {
    viewBoxX: [-9, 9],
    viewBoxY: [-9, 9],
    radioTexto: 3.5, // Máximo espacio para álgebra compleja
  },

  geo_radiales_avanzado: {
    radioTexto: 3.2, // Un poco más alejado del centro
    viewBoxX: [-12, 12],
    viewBoxY: [-12, 12],
    offsets: [
      [0.5, 0.2], // offset para el primer arco (de 0 a ang1)
      [-0.3, 0.5], // offset para el segundo (ang1 a ang1+ang2)
      [0.4, -0.3], // offset para el tercero (ang1+ang2 a posD)
      [0.1, -0.4], // offset para el cuarto (posD a 360) – solo para 4 ángulos
    ],
  },
};

export const AJUSTES_ESPECIFICOS_SECANTES: Record<string, any> = {
  geo_secantes_avanzado: {
    viewBoxX: [-8, 8],
    viewBoxY: [-8, 8],
    radioTexto: 3.8, // Para que los ángulos no se pisen en las rectas
  },
};

// 🔥 Añadimos Record<string, any> para blindar el tipado contra futuros niveles
export const AJUSTES_PARALELAS_POR_NIVEL: Record<string, any> = {
  basico: {
    radioArco: 0.8,
    distanciaEtiqueta: 2.3,
    offsetPolares: [
      [0.2, 0],
      [0.2, 0],
      [0.2, 0],
    ], // 3 ángulos
  },
  intermedio: {
    radioArco: 0.9,
    distanciaEtiqueta: 2.3,
    offsetPolares: [
      [0.4, 1],
      [0.3, 1],
      [0.4, -1],
      [0.4, 1],
    ], // 4 ángulos
  },
  avanzado: {
    radioArco: 1.0,
    distanciaEtiqueta: 2.3,
    offsetPolares: [
      [0.1, -1],
      [0.3, 1],
      [0.5, 4],
    ], // 3 ángulos
  },
  // 🔥 AQUÍ ESTÁ EL NIVEL FALTANTE
  experto: {
    radioArco: 1.1,
    distanciaEtiqueta: 2.4, // Mayor distancia porque hay más texto
    offsetPolares: [
      [-0.5, 1],
      [1, -2],
      [-0.6, -1],
      [-1, 1],
      [-1, 1],
    ], // 4 ángulos
  },
};

// 🔥 Control independiente para múltiples ángulos consecutivos (Índices: [Ang1, Ang2, Ang3])
export const AJUSTES_ANGULOS_MULTIPLES = {
  // Tamaños de los arcos celestes. Alternar tamaños (ej. chico, grande, chico) evita que se pisen.
  radiosArco: [1.1, 1.6, 1.1],

  // Distancia del texto desde el vértice. Alternar distancias evita colisiones de ecuaciones largas.
  distanciasTexto: [1.9, 2.7, 1.9],

  // Offsets polares (en grados). Si un texto choca con una línea, le sumas +5 o -5 grados para moverlo a un lado.
  desfaseGrados: [0, 0, 0],
};

export const CONFIG_RECTANGULO_AREA = {
  VIEWBOX_MARGIN: 2.5, // Ajusta para controlar el zoom
};

// Configuración para perímetro de escalera
// 🔥 Control quirúrgico independiente para los textos de "Perímetro Escalera"
export const AJUSTES_PERIMETRO_ESCALERA = {
  // Distancia del texto hacia afuera.
  // Índices: [Horizontal 1, Vertical 1, Horizontal 2, Vertical 2]
  // Si notas que el lado 3 choca, cambias el tercer valor a 1.0 o 1.2
  distanciasTexto: [0.75, 0.4, 0.4, 0.4],

  // Modificador del tamaño de la fuente para que quepan binomios largos (0.9 = 90%)
  escalaFuente: 0.9,
};

// 🔥 Control quirúrgico independiente para "Área de Rombo"
export const AJUSTES_ROMBO = {
  // Distancia del texto a la línea: [Horizontal, Vertical]
  // Al reducirlo a 0.5, el texto se pega más a la línea, evitando que la cámara se aleje
  distanciasTexto: [0.7, 0.3],

  // 🔥 Letra mucho más pequeña (75%) para que el rombo sea el protagonista
  escalaFuente: 0.75,
};
export const CONFIG_TRAPECIO = {
  VIEWBOX_MARGIN: 2.0,
};
export const CONFIG_PARALELOGRAMO = {
  VIEWBOX_MARGIN: 2.0,
};

// 🔥 Control quirúrgico independiente para "Área de Trapecio"
export const AJUSTES_TRAPECIO = {
  // Distancias de empuje: [Base Mayor, Base Menor, Altura interior]
  distanciasTexto: [0.6, 0.6, 0.8],
  // Letra al 80% para que los binomios entren perfectos
  escalaFuente: 0.8,
};

// 🔥 Control quirúrgico independiente para "Área de Paralelogramo"
export const AJUSTES_PARALELOGRAMO = {
  // Distancias de empuje: [Base, Altura Interior, Lado Oblicuo (Experto)]
  distanciasTexto: [0.6, 0.6, 0.8],
  escalaFuente: 0.8,
};

// 🔥 Control quirúrgico independiente para "Volumen Prisma"
export const AJUSTES_PRISMA = {
  // Distancias de empuje independientes:
  // [0] = Largo (Frontal Abajo)
  // [1] = Alto (Frontal Izquierda)
  // [2] = Ancho/Profundidad (Lateral Derecha) -> Requiere más espacio por la perspectiva
  distanciasTexto: [0.4, 0.9, 0.5],

  // Letra reducida (75%) para que no compita visualmente con el bloque 3D
  escalaFuente: 0.75,
};

// 🔥 Control quirúrgico para "Volumen Prisma Triangular"
export const AJUSTES_PRISMA_TRIANGULAR = {
  // [0] = Base Frontal, [1] = Altura Interior, [2] = Profundidad 3D
  distanciasTexto: [0.6, 0.4, 0.9],
  escalaFuente: 0.75,
};

// 🔥 Control quirúrgico para "Ángulos en Circunferencia"
export const AJUSTES_CIRCUNFERENCIA = {
  // Letra un poco más ajustada para que quepa en los vértices sin desbordar
  escalaFuente: 0.8,
  COLOR_CIRCULO: "#e2e8f0", // Gris pastel sutil para el fondo
};

// 🔥 Control quirúrgico para "Segmentos en Circunferencia"
export const AJUSTES_SEGMENTOS_CIRCUNFERENCIA = {
  escalaFuente: 0.85,
};

export const CONFIG_TRIANGULOS = {
  ALTURA_MINIMA: 4,
  BASE_ANCHO: 7,
  RADIO_ARCO: 0.8, // Ángulos internos
  RADIO_ARCO_EXTERIOR: 1.1, // 🔥 Más grande para que no se pisen en externos
  DISTANCIA_ETIQUETA: 1.2,
  DISTANCIA_ETIQUETA_EXTERIOR: 1.6,
  COLOR_VERTICES: "#64748b",
  TAMANO_LETRA_VERTICE: 14,
  COLORES_ANGULOS: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
  MARGEN_VIEWBOX: 2.5,
};

export const ESTILO_HALO_TEXTO = {
  fontWeight: "bold",
  paintOrder: "stroke fill",
  stroke: "#ffffff",
  strokeWidth: 5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ESTILO_HALO_TRIANGULO: React.CSSProperties = {
  paintOrder: "stroke", // Dibuja el borde por debajo del relleno
  stroke: "#ffffff", // Borde blanco
  strokeWidth: "5px", // Grosor del halo
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "#0f172a", // slate-900 (Color del texto interior)
};

export const ESTILO_HALO_ROBUSTO: React.CSSProperties = {
  paintOrder: "stroke fill",
  stroke: "white",
  strokeWidth: "6px",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fontWeight: "600", // Un poco más de peso para que resalte
};

export const CONSTANTES_PITAGORAS: Record<number, any> = {
  15: {
    // La Escalera Quebrada
    posiciones: {
      suma_x: [0, -3.8],
      suma_y: [3.8, 0],
      nodo_A: [-3.5, -3.5],
      nodo_C: [3.5, 3.5],
      incognita: [-2, 1.8], // El "x = AC" lejos de los peldaños
    },
  },
  18: {
    // Esquina de Cuadrado
    posiciones: {
      lado: [0, 3.5],
      c1: [-3.5, -1],
      c2: [-0.5, -3.5],
      nodo_A: [-3.5, -3.5],
      nodo_B: [2.5, -3.5],
      nodo_C: [-3.5, 1.5],
      leyenda: [1, 1.5],
    },
  },
  19: {
    // Equilátero
    posiciones: {
      lado: [-1.5, 2.5],
      incognita: [0.9, 1.2], // El x√3 con LaTeX centrado
    },
  },
};

// 🔥 CONSTANTES VISUALES: CONTROL TOTAL DE GEOMETRÍA 🔥
export const ConstantsVisualesAreaTriangulo = {
  grosorLineaFina: 1.2,
  grosorLineaPunteada: 1.0,
  fillOpacity: 0.1, // Relleno azul muy sutil
  colorGeometria: "#16a34a", // green-600 (Editorial)
  colorAngulo90: "#dc2626", // red-600
  colorTextoHalo: "#1e293b", // slate-800
  colorTextoAreaPerim: "#dc2626", // red-600 (Aura)
  
  // 🔥 AJUSTE INDEPENDIENTE DE DISTANCIAS (Aumentar para alejar)
  offsetBase: 1.6,       // Aleja el texto de la base (x+4) hacia abajo
  offsetAltura: 1.5,     // Aleja el texto de la altura (h=) hacia la derecha/izquierda
  offsetHipotenusa: 1.4, // Aleja el texto de la hipotenusa (12cm) inclinada
  offsetAlgebra: 1.3,    // Aleja los textos x+2, 4x, etc.
  
  // 🔥 AJUSTE INDEPENDIENTE DEL ÁNGULO DE 90°
  sizeAngulo90: 1.2,     // ¡Agrandado! Estaba en 0.8. Súbelo a 1.5 o 2 si quieres.
  offsetSímbolo90: 0.2   // Pequeño margen para que el cuadrado no toque el vértice
};