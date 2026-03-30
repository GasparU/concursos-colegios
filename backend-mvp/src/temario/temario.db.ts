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
    { nombre: "Operaciones en Q: Adición y sustracción", tipo: "conamat", subtipos: ["adicion_sustraccion_q"] },
    { nombre: "Operaciones en Q: Multiplicación y división", tipo: "conamat", subtipos: ["multiplicacion_division_q"] },
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
    { nombre: "Adición y Sustracción en Z", tipo: "algebra", subtipos: ["z_adicion_sustraccion"] },
    { nombre: "Multiplicación y División en Z", tipo: "algebra", subtipos: ["z_multiplicacion_division"] },

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
    { nombre: "Teorema de Thales (Extra)", tipo: "academia", subtipos: ["thales"] },


    // 🔵 COMUNICACIÓN Y LENGUAJE (Nivel Olimpiada 369 / Tesla)
    { id: "com_5_com_def", nombre: "La Comunicación: definición, clases y elementos (Ruido, Canal, Contexto)", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_leng_hum", nombre: "El Lenguaje Humano: características y funciones", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_leng_hab", nombre: "Lengua y Habla: relaciones y diferencias", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_var_ling", nombre: "Variación Lingüística: dialecto, dialecto estándar e idioma", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_fon_sup", nombre: "Fonemas Suprasegmentales: El acento, el tono y la entonación", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_silaba", nombre: "La Sílaba: estructura y clases", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_sec_voc", nombre: "Secuencias Vocálicas: diptongos, triptongos y hiatos", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_acento_ton", nombre: "Clases de palabras según la sílaba tónica (Agudas, Graves, Esdrújulas)", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_sustantivo", nombre: "El Sustantivo: definición, clases y accidentes gramaticales", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_articulo", nombre: "El Artículo: funciones y normativa", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_adjetivo", nombre: "El Adjetivo: calificativos, determinativos y grados", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_pronombre", nombre: "El Pronombre: clases y reemplazo pronominal", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "com_5_verbo", nombre: "El Verbo: persona, tiempo, modo y conjugación", tipo: "Letras", categoria: "COMUNICACION" },

    // 🟢 RAZONAMIENTO VERBAL / HABILIDAD VERBAL (Nivel Concurso)
    { id: "rv_5_semantica", nombre: "Relaciones Semánticas: Sinonimia, Antonimia, Paronimia y Homonimia", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "rv_5_series", nombre: "Series Verbales y Término Excluido", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "rv_5_analogias", nombre: "Analogías: Relaciones lógicas y pares análogos", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "rv_5_or_inc", nombre: "Oraciones Incompletas y Conectores Lógicos", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "rv_5_comp_lect", nombre: "Comprensión Lectora: Idea principal y Tema central", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "rv_5_jerarquia", nombre: "Jerarquía Textual: Título, Idea principal y de apoyo", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "rv_5_metodo_lect", nombre: "Método y Técnicas de Lectura (Niveles de comprensión)", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "rv_5_plan_red", nombre: "Plan de Redacción y Eliminación de Oraciones", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "rv_5_tipos_texto", nombre: "Tipos de Texto: Intención, Temática, Dialécticos y Mixtos", tipo: "Letras", categoria: "COMUNICACION" },

    // --- HISTORIA DEL PERÚ (HP) ---
    { id: "hp_5_poblamiento_am", nombre: "Poblamiento Americano: Teorías y Rutas", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_litico_arcaico", nombre: "Poblamiento del Perú: Periodo Lítico y Arcaico (Caral)", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_formativo", nombre: "Horizonte Temprano: Chavín (Estado Teocrático) y Paracas", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_intermedio_tem", nombre: "Intermedio Temprano: Mochica y Nasca (Ingeniería Hidráulica)", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_horizonte_med", nombre: "Horizonte Medio: Tiahuanaco y el Imperio Wari", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_intermedio_tar", nombre: "Intermedio Tardío: Chimú (Chan Chan) y Chincha", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_incas_politica", nombre: "El Tahuantinsuyo: Proceso Histórico, Política y Educación", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_incas_economia", nombre: "El Tahuantinsuyo: Economía (Reciprocidad) y Sociedad (Ayllu)", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_invasion", nombre: "Invasión a los Andes: Viajes de Pizarro y Caída del Imperio", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_resistencia", nombre: "Resistencia Andina (Incas de Vilcabamba) y Guerras Civiles", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_virreinato_pol", nombre: "Virreinato: Instituciones Coloniales y Administración", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_virreinato_eco", nombre: "Virreinato: Economía (Mita, Potosí) y Sociedad de Castas", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_reformas", nombre: "Reformas Borbónicas y Rebeliones Indígenas (Túpac Amaru II)", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_precursores", nombre: "Independencia: Precursores, Próceres y Crisis Española", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_corriente_sur", nombre: "Corriente Libertadora del Sur: San Martín y el Protectorado", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_corriente_nor", nombre: "Corriente Libertadora del Norte: Simón Bolívar y la Dictadura", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_republica_ini", nombre: "Primer Militarismo y la Confederación Peruano-Boliviana", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_prosperidad", nombre: "La Prosperidad Falaz: El Boom del Guano y Ramón Castilla", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hp_5_guerra_chile", nombre: "Guerra con Chile: Campaña Marítima y Campaña de la Breña", tipo: "Letras", categoria: "COMUNICACION" },

    // --- HISTORIA UNIVERSAL (HU) ---
    { id: "hu_5_prehistoria", nombre: "Prehistoria: Edad de Piedra y de los Metales", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hu_5_egipto", nombre: "Cultura Egipto: Pirámides, Faraones y Organización", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hu_5_mesopotamia", nombre: "Mesopotamia: Primeras Ciudades y Escritura Cuneiforme", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hu_5_grecia", nombre: "Grecia Antigua: Esparta, Atenas y las Guerras Médicas", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hu_5_roma", nombre: "Roma: Monarquía, República e Imperio", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hu_5_media", nombre: "Edad Media: Feudalismo, Cruzadas y el Imperio Carolingio", tipo: "Letras", categoria: "COMUNICACION" },
    { id: "hu_5_moderna", nombre: "Edad Moderna: Humanismo, Renacimiento y Descubrimientos", tipo: "Letras", categoria: "COMUNICACION" },
    
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

    // 🔵 COMUNICACIÓN Y LENGUAJE (Nivel Olimpiada 369 / Tesla - 6to Grado)
    { id: "com_6_base", nombre: "La Comunicación, Lenguaje y Variaciones (Repaso avanzado)", tipo: "conamat", categoria: "COMUNICACION" },
    { id: "com_6_fonemas", nombre: "Fonemas Suprasegmentales y Secuencias Vocálicas complejas", tipo: "conamat", categoria: "COMUNICACION" },
    { id: "com_6_oracion", nombre: "La Oración: Unimembre y Bimembre", tipo: "conamat", categoria: "COMUNICACION" },
    { id: "com_6_sujeto", nombre: "El Sujeto: definición, estructura y sus clases", tipo: "conamat", categoria: "COMUNICACION" },
    { id: "com_6_predicado", nombre: "El Predicado: núcleo y modificadores (Objeto Directo/Indirecto)", tipo: "conamat", categoria: "COMUNICACION" },
    { id: "com_6_mayusculas", nombre: "Uso de Mayúsculas y Normativa de Grafías", tipo: "conamat", categoria: "COMUNICACION" },
    { id: "com_6_categorias", nombre: "Categorías Gramaticales: Sustantivo, Pronombre, Adjetivo y Verbo", tipo: "conamat", categoria: "COMUNICACION" },
    
    // 🟢 RAZONAMIENTO VERBAL (Refuerzo 6to)
    { id: "rv_6_jerarquia", nombre: "Jerarquía Textual Avanzada y Tipos de Preguntas (Inferencia/Extrapolación)", tipo: "conamat", categoria: "COMUNICACION" },
    { id: "rv_6_conectores", nombre: "Conectores Lógicos y Coherencia Textual", tipo: "academia", categoria: "COMUNICACION" }
  ],
} as const;
