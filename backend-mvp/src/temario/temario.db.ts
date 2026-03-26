export const TEMARIO_MAESTRO = {
  '3ro': [
    // 🔵 TEMAS PREVIOS (ACADEMIA)
    {
      id: '3_posicional',
      nombre: 'Sistema posicional (hasta 4 cifras)',
      tipo: 'academia',
    },
    {
      id: '3_orden',
      nombre: 'Relación de orden (<, >, =) hasta 4 cifras',
      tipo: 'academia',
    },
    {
      id: '3_operaciones',
      nombre: 'Operaciones combinadas (+, -, ×, ÷) naturales',
      tipo: 'academia',
    },
    {
      id: '3_multiplos',
      nombre: 'Doble, triple, cuádruple y mitad',
      tipo: 'academia',
    },
    {
      id: '3_fracciones_graf',
      nombre: 'Fracciones: Representación gráfica',
      tipo: 'academia',
    },
    {
      id: '3_fracciones_homo',
      nombre: 'Suma/Resta de fracciones homogéneas',
      tipo: 'academia',
    },
    {
      id: '3_fracciones_eq',
      nombre: 'Fracciones equivalentes',
      tipo: 'academia',
    },

    // 🔴 TEMAS OFICIALES (CONAMAT)
    {
      id: '3_progresion',
      nombre: 'Progresión aritmética simple',
      tipo: 'conamat',
    },
    {
      id: '3_triangulos',
      nombre: 'Triángulos y clasificación',
      tipo: 'conamat',
    },
    {
      id: '3_cuadrilateros',
      nombre: 'Cuadriláteros (trapecio, rectángulo, cuadrado)',
      tipo: 'conamat',
    },
    {
      id: '3_simetria',
      nombre: 'Simetría y figuras simétricas',
      tipo: 'conamat',
    },
    {
      id: '3_perimetro',
      nombre: 'Perímetro de figuras básicas',
      tipo: 'conamat',
    },
    {
      id: '3_area',
      nombre: 'Área de figuras geométricas (cuadrícula/fórmula)',
      tipo: 'conamat',
    },
    { id: '3_tablas', nombre: 'Tablas de doble entrada', tipo: 'conamat' },
    {
      id: '3_graficos',
      nombre: 'Gráfico de barras y pictogramas',
      tipo: 'conamat',
    },
    {
      id: '3_sucesos',
      nombre: 'Sucesos seguros, probables e improbables',
      tipo: 'conamat',
    },
  ],
  '4to': [
    // 🔵 TEMAS PREVIOS (ACADEMIA)
    {
      id: '4_descomposicion',
      nombre: 'Descomposición polinómica (4 cifras)',
      tipo: 'academia',
    },
    {
      id: '4_op_combinadas',
      nombre: 'Operaciones combinadas (+, -, ×, ÷)',
      tipo: 'academia',
    },
    {
      id: '4_fracciones_eq',
      nombre: 'Fracciones equivalentes',
      tipo: 'academia',
    },
    {
      id: '4_fracciones_het',
      nombre: 'Suma/Resta de fracciones heterogéneas',
      tipo: 'academia',
    },
    {
      id: '4_decimales',
      nombre: 'Suma/Resta de decimales (al décimo)',
      tipo: 'academia',
    },
    {
      id: '4_monedas',
      nombre: 'Equivalencias y canjes con monedas',
      tipo: 'academia',
    },
    { id: '4_progresion', nombre: 'Progresión aritmética', tipo: 'academia' },

    // 🔴 TEMAS OFICIALES (CONAMAT)
    {
      id: '4_proporcionalidad',
      nombre: 'Tabla de proporcionalidad directa',
      tipo: 'conamat',
    },
    {
      id: '4_segmentos_angulos',
      nombre: 'Segmentos y ángulos (clasificación)',
      tipo: 'conamat',
    },
    {
      id: '4_poligonos',
      nombre: 'Polígonos (elementos y clasificación)',
      tipo: 'conamat',
    },
    { id: '4_circulo', nombre: 'Círculo y circunferencia', tipo: 'conamat' },
    {
      id: '4_solidos',
      nombre: 'Sólidos: cubo, prisma regular',
      tipo: 'conamat',
    },
    {
      id: '4_area_perim',
      nombre: 'Áreas y perímetros combinados',
      tipo: 'conamat',
    },
    {
      id: '4_probabilidad',
      nombre: 'Sucesos numéricos y no numéricos probables e improbables',
      tipo: 'conamat',
    },
    {
      id: '4_graficos',
      nombre: 'Gráfico de barras, pictogramas y gráfico de líneas',
      tipo: 'conamat',
    },
  ],
  "5to": [
    // =========================================================
    // 🔴 TEMARIO OFICIAL CONAMAT (Competencia Directa)
    // =========================================================
    // ARITMÉTICA
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


    // =========================================================
    // 🔵 TEMARIO ACADEMIA (Requisitos y Complementos)
    // =========================================================
    // REQUISITOS BASE (Obligatorios para entender CONAMAT)
    { nombre: "MCD y MCM (Requisito)", tipo: "academia", subtipos: ["coincidencia_tiempo", "encuentro_amigos", "reparto_equitativo", "baldosas_piso"] },
    { nombre: "Descomposición Polinómica (Requisito)", tipo: "academia", subtipos: ["descomposicion_polinomica"] },
    { nombre: "Leyes de Exponentes y Radicación (Requisito)", tipo: "academia", subtipos: ["teoria_exponentes", "radicacion"] },
    { nombre: "Ecuaciones e Inecuaciones (Requisito)", tipo: "academia", subtipos: ["lineal", "sueldo_minimo", "punto_equilibrio", "area_maxima", "maximizar_productos"] },
    { nombre: "Teorema de Pitágoras y T. Notables (Requisito)", tipo: "academia", subtipos: ["teorema_pitagoras", "triangulos_notables"] },
    { nombre: "Promedios (Requisito)", tipo: "academia", subtipos: ["agregar_numero", "promedio_ponderado", "promedio_geometrico", "eliminar_numero"] },
    { nombre: "Analogías Numéricas (Requisito)", tipo: "academia", subtipos: ["analogias_numericas"] },

    { nombre: "Distribuciones Gráficas (Requisito)", tipo: "academia", subtipos: ["distribucion_grafica"] },
    { nombre: "Métodos Operativos: Cangrejo y Rectángulo (Requisito)", tipo: "academia", subtipos: ["cangrejo_3_pasos", "cangrejo_4_pasos", "rectangulo_entero", "rectangulo_decimal"] },
    { 
      nombre: "Adición y Sustracción en Z", 
      tipo: "algebra", 
      subtipos: ["z_adicion_sustraccion"] 
    },

    // COMPLEMENTOS (Temas de las 16 Semanas Escolares)
    { nombre: "Sólidos 3D: Cilindros (Complemento)", tipo: "academia", subtipos: ["solidos_3d_cilindro"] },

// 2. Tema exclusivo para Pirámides (Mapea al subtipo de tus JSON de pirámides)
    { nombre: "Sólidos 3D: Pirámides (Complemento)", tipo: "academia", subtipos: ["volumen_piramide"] },  
    { nombre: "Polinomios: Valor Numérico (Complemento)", tipo: "academia", subtipos: ["polinomios"] },
    { nombre: "Plano Cartesiano y Distancias (Complemento)", tipo: "academia", subtipos: ["plano_cartesiano"] },
    { nombre: "Intervalos Numéricos (Complemento)", tipo: "academia", subtipos: ["intervalos"] },
    { nombre: "Circunferencia y Propiedades (Complemento)", tipo: "academia", subtipos: ["angulos_circunferencia", "propiedades_circunferencia", "segmentos_circunferencia"] },
    { nombre: "Conteo de Figuras y Paginación (Complemento)", tipo: "academia", subtipos: ["conteo_figuras", "paginacion_1cifra", "paginacion_2cifras", "paginacion_3cifras", "paginacion_general"] },
    
    // TEMAS AISLADOS / EXTRAS
    { nombre: "Conjuntos y Diagramas de Venn (Extra)", tipo: "academia", subtipos: ["dos_conjuntos_sin_fuera", "dos_conjuntos_con_fuera", "tres_conjuntos_solo_chocolate", "porcentajes_ninguno", "enn_grafico_elementos", "venn_grafico_elementos", "conjunto_unitario", "comprension_conjuntos"] },
    { nombre: "Fracciones Especiales: Grifos y Caños (Extra)", tipo: "academia", subtipos: ["dos_llenan", "llena_y_vacia", "tres_llenan", "con_apertura_diferida"] },
    { nombre: "Teorema de Thales (Extra)", tipo: "academia", subtipos: ["thales"] }
],
  '6to': [
    // 🔵 TEMAS PREVIOS (ACADEMIA)
    { id: '6_primos', nombre: 'Números primos y compuestos', tipo: 'academia' },
    {
      id: '6_cuadrados_perf',
      nombre: 'Cuadrados perfectos (1-50)',
      tipo: 'academia',
    },
    {
      id: '6_fracciones_dec',
      nombre: 'Operaciones combinadas con fracciones y decimales',
      tipo: 'academia',
    },
    { id: '6_interes', nombre: 'Intereses simples básicos', tipo: 'academia' },

    // 🔴 TEMAS OFICIALES (CONAMAT)
    {
      id: '6_mcd_mcm',
      nombre: 'MCD y MCM aplicado a problemas prácticos',
      tipo: 'conamat',
    },
    {
      id: '6_prop_compuesta',
      nombre: 'Proporcionalidad compuesta (directa/inversa)',
      tipo: 'conamat',
    },
    {
      id: '6_moneda_comision',
      nombre: 'Cambio monetario con comisiones',
      tipo: 'conamat',
    },
    {
      id: '6_angulos_paralelas',
      nombre: 'Ángulos entre paralelas',
      tipo: 'conamat',
    },
    {
      id: '6_perim_area_tri',
      nombre: 'Perímetro y área de triángulos',
      tipo: 'conamat',
    },
    {
      id: '6_circunferencia',
      nombre: 'Circunferencia básica',
      tipo: 'conamat',
    },
    {
      id: '6_solidos',
      nombre: 'Sólidos: prismas y cubos (área lateral, total y volumen)',
      tipo: 'conamat',
    },
    { id: '6_frecuencias', nombre: 'Tablas de frecuencia', tipo: 'conamat' },
    {
      id: '6_media_moda',
      nombre: 'Media aritmética y Moda aplicadas',
      tipo: 'conamat',
    },
    {
      id: '6_probabilidad_comp',
      nombre: 'Probabilidad de eventos compuestos',
      tipo: 'conamat',
    },
    {
      id: '6_graficas_comb',
      nombre: 'Gráficas estadísticas combinadas',
      tipo: 'conamat',
    },
  ],
} as const;
