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
    // --- TEMARIO OFICIAL CONAMAT (Rojo/Rosado) ---
    { nombre: "Conjuntos y Diagramas de Venn", tipo: "conamat", subtipos: ["dos_conjuntos_sin_fuera", "dos_conjuntos_con_fuera", "tres_conjuntos_solo_chocolate", "porcentajes_ninguno"] },
    { nombre: "Números naturales: operaciones y propiedades", tipo: "conamat", subtipos: [] }, 
    { nombre: "Cuatro operaciones", tipo: "conamat", subtipos: [] },
    { nombre: "Relaciones de mayor, menor e igual", tipo: "conamat", subtipos: ["sueldo_minimo", "punto_equilibrio", "area_maxima", "maximizar_productos"] },
    { nombre: "Ecuaciones e inecuaciones", tipo: "conamat", subtipos: ["lineal", "sueldo_minimo", "punto_equilibrio", "area_maxima", "maximizar_productos"] },
    { nombre: "Teoría de números: divisibilidad", tipo: "conamat", subtipos: ["criterios_divisibilidad", "multiplos", "propiedades_multiplos"] },
    { nombre: "Números primos", tipo: "conamat", subtipos: [] },
    { nombre: "MCD y MCM", tipo: "conamat", subtipos: ["coincidencia_tiempo", "encuentro_amigos", "reparto_equitativo", "baldosas_piso"] },
    
    // 🔥 EL ARREGLO DE FRACCIONES (Sin Caños)
    { nombre: "Fracciones: clases y operaciones", tipo: "conamat", subtipos: ["reparto_sucesivo", "consumo_volumen", "fraccion_de_una_fraccion", "suma_resta_fracciones", "comparacion_fracciones", "fracciones_basicas"] },
    { nombre: "Fracción de una fracción", tipo: "conamat", subtipos: ["reparto_sucesivo", "consumo_volumen", "fraccion_de_una_fraccion"] },
    { nombre: "Suma y Resta de Fracciones", tipo: "conamat", subtipos: ["suma_resta_fracciones"] },
    
    { nombre: "Números decimales", tipo: "conamat", subtipos: [] },
    { nombre: "Operaciones combinadas con decimales", tipo: "conamat", subtipos: ["operaciones_combinadas"] },
    { nombre: "Cuadrado y cubo de un número menor que 20", tipo: "conamat", subtipos: [] },
    { nombre: "Equivalencia y cambio monetario", tipo: "conamat", subtipos: ["vuelto_compra", "presupuesto_gastos"] },
    { nombre: "Proporcionalidad directa e inversa", tipo: "conamat", subtipos: ["magnitudes_proporcionales", "rendimiento_equipo", "directa", "rendimiento"] },
    { nombre: "Regla de tres simple", tipo: "conamat", subtipos: ["directa"] },
    { nombre: "Promedios", tipo: "conamat", subtipos: ["agregar_numero", "promedio_ponderado", "promedio_geometrico", "eliminar_numero"] },
    
    // Geometría y Estadística (Conectados a sus subtipos)
    { nombre: "Segmentos", tipo: "conamat", subtipos: ["segmentos"] },
    { nombre: "Ángulos y Bisectriz", tipo: "conamat", subtipos: ["angulos_radiales", "angulos_teoricos", "conteo_angulos"] },
    { nombre: "Rectas paralelas y perpendiculares", tipo: "conamat", subtipos: ["paralelas_ecuaciones", "paralelas_serrucho", "rectas_secantes"] },
    { nombre: "Triángulos", tipo: "conamat", subtipos: ["area_triangulo", "triangulo_perimetro"] },
    { nombre: "Figuras planas: Áreas y perímetros", tipo: "conamat", subtipos: ["area_triangulo", "area_rectangulo", "area_rombo", "area_trapecio", "area_paralelogramo"] },
    { nombre: "Área de regiones sombreadas", tipo: "conamat", subtipos: ["area_sombreada"] },
    { nombre: "Gráficos estadísticos (barras, poligonales, circulares)", tipo: "conamat", subtipos: ["grafico_barras", "grafico_circular", "tabla_frecuencias", "pictograma"] },
    { nombre: "Sucesos numéricos y no numéricos probables e improbables", tipo: "conamat", subtipos: ["probabilidad_fraccion", "suceso_contrario", "extraccion_doble"] },
    { nombre: "Sucesiones numéricas y alfabéticas", tipo: "conamat", subtipos: [] },
    { nombre: "Operadores Matemáticos", tipo: "conamat", subtipos: ["lineal", "cuadratico", "fraccionario", "anidado"] },
    { nombre: "Habilidad y situaciones matemáticas", tipo: "conamat", subtipos: ["cangrejo_3_pasos", "cangrejo_4_pasos", "rectangulo_entero", "rectangulo_decimal"] },

    // --- TEMAS "TIGRE" DE ACADEMIA PRE-U (Azul) ---
    { nombre: "Magnitudes Proporcionales (Tablas DP e IP)", tipo: "academia", subtipos: ["magnitudes_proporcionales"] },
    { nombre: "Descomposición Polinómica", tipo: "academia", subtipos: ["descomposicion_polinomica"] },
    { nombre: "Sucesiones Numéricas (Doble Criterio)", tipo: "academia", subtipos: [] },
    { nombre: "Problemas de Edades", tipo: "academia", subtipos: ["problemas_edades"] },
    { nombre: "Planteo de Ecuaciones (Método Rombo)", tipo: "academia", subtipos: ["planteo_ecuaciones"] },
    { nombre: "Métodos Operativos (Cangrejo y Rectángulo)", tipo: "academia", subtipos: ["cangrejo_3_pasos", "cangrejo_4_pasos", "rectangulo_entero", "rectangulo_decimal"] },
    
    // 🔥 LOS CAÑOS ESTÁN AQUÍ AISLADOS
    { nombre: "Fracciones Especiales (Grifos y Caños)", tipo: "academia", subtipos: ["dos_llenan", "llena_y_vacia", "tres_llenan", "con_apertura_diferida"] },
    
    { nombre: "Conteo de Números (Paginación)", tipo: "academia", subtipos: ["paginacion_1cifra", "paginacion_2cifras", "paginacion_3cifras", "paginacion_general"] },
    // Como bonus, añadí los de RM que tenías sueltos en el JSON
    { nombre: "Distribuciones gráficas", tipo: "academia", subtipos: ["distribucion_grafica"] },
    { nombre: "Criptoaritmética", tipo: "academia", subtipos: ["criptoaritmetica"] },
    { nombre: "Conteo de figuras", tipo: "academia", subtipos: ["conteo_figuras"] }
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
