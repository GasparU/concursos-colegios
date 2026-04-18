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
    { nombre: "Ecuaciones Fraccionarias I", tipo: "conamat", subtipos: ["ecuacion_frac_num_mcm_simple", "ecuacion_frac_num_3_terminos", "ecuacion_frac_num_planteo_dinero", "ecuacion_frac_num_fraccion_restante"] },
    { nombre: "Ecuaciones Fraccionarias II", tipo: "conamat", subtipos: ["ecuacion_frac_den_homogenea", "ecuacion_frac_den_aspa_binomio", "ecuacion_frac_den_traduccion_costo", "ecuacion_frac_den_trampa_dominio"] },
    { nombre: "Ecuaciones de 2do Grado Básicas", tipo: "conamat", subtipos: ["ecuacion_cuadratica_incompleta_pura", "ecuacion_cuadratica_factorizada_raices", "ecuacion_cuadratica_planteo_narrativo", "ecuacion_cuadratica_geometria_raiz_directa"] },

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
    { nombre: "Sólidos Geométricos: Cubo y Prisma", tipo: "geometria", subtipos: ["cubo_conamat_area_volumen", "cubo_conamat_aristas", "cubo_grafico_volumen_basico", "cubo_grafico_area_intermedio"] },
    { nombre: "El Cono", tipo: "conamat", categoria: "GEOMETRIA", subtipos: ["cono_basico", "cono_basico_diametro", "cono_basico_areabase", "cono_inverso", "cono_equilatero", "cono_variacion", "cono_notable", "cono_texto_proporcional", "cono_texto_areas", "cono_algebraico", "cono_semejanza", "cono_desarrollo"] },

    // ESTADÍSTICA Y PROBABILIDAD
    { nombre: "Gráficos estadísticos (barras, poligonales, circulares)", tipo: "conamat", subtipos: ["grafico_barras", "grafico_barras_doble", "grafico_circular", "tabla_frecuencias", "pictograma"] },
    { nombre: "Sucesos numéricos probables e improbables", tipo: "conamat", subtipos: ["probabilidad_basica", "probabilidad_fraccion", "suceso_contrario", "extraccion_doble"] },
    { nombre: "Términos Semejantes", tipo: "conamat", subtipos: ["reduccion_basica", "ecuacion_exponentes", "reduccion_avanzada", "sistema_ecuaciones"] },
    { nombre: "Orden de Información", tipo: "conamat", subtipos: ["verdades_mentiras", "orden_vertical", "orden_circular", "orden_matriz"] },
    { nombre: "Reducción de Términos Semejantes", tipo: "conamat", subtipos: ["reduc_semej_operativo_basico", "reduc_semej_signos_intermedio", "reduc_semej_exponente_avanzado", "reduc_semej_sistema_experto"] },

    // RAZONAMIENTO MATEMÁTICO
    { nombre: "Sucesiones numéricas y alfabéticas",tipo: "conamat", subtipos: ["sucesion_numerica", "sucesion_alfabetica","sucesion_alfanumerica", "sucesion_algebraica", "sucesion_intercalada", "sucesion_cuadratica"] },
    { nombre: "Operadores Matemáticos", tipo: "conamat", subtipos: ["basico_directo", "basico_anidado", "basico_inverso", "inter_cambio_var", "inter_ecuacion", "inter_condicional", "avanz_compuesto", "avanz_cond_magnitud", "avanz_cambio_doble", "experto_recursivo", "experto_induccion", "experto_implicito"] },
    { nombre: "Criptoaritmética Pro", tipo: "conamat", subtipos: ["cripto_v2_suma_basico", "cripto_v2_resta_intermedio", "cripto_v2_mult_avanzado", "cripto_v2_div_experto"] },


    { nombre: "Problemas de Edades", tipo: "conamat", subtipos: ["problemas_edades"] },
    { nombre: "Planteo de Ecuaciones", tipo: "conamat", subtipos: ["planteo_ecuaciones"] },
    { nombre: "Relojes I: Ángulos", tipo: "conamat", subtipos: ["relojes_ang_basico", "relojes_ang_intermedio", "relojes_ang_avanzado", "relojes_ang_experto"] },
    { nombre: "Relojes II: Cronometría", tipo: "conamat", subtipos: ["relojes_time_basico", "relojes_time_intermedio", "relojes_time_avanzado", "relojes_time_experto"] },

    // 🔵 TEMARIO ACADEMIA (Requisitos y Complementos)
    { nombre: "MCD y MCM (Requisito)", tipo: "academia", subtipos: ["coincidencia_tiempo", "encuentro_amigos", "reparto_equitativo", "baldosas_piso"] },
    { nombre: "Descomposición Polinómica (Requisito)", tipo: "academia", subtipos: ["descomposicion_polinomica"] },
    { nombre: "Leyes de Exponentes I", tipo: "academia", subtipos: ["teoria_exp_producto_cociente", "teoria_exp_descomposicion_bases", "teoria_exp_factor_comun", "teoria_exp_ecuacion_implicita"] },
     { nombre: "Leyes de Exponentes II", tipo: "academia", subtipos: ["teoria_exp_potencia_vs_cadena", "teoria_exp_cadenas_anidadas", "teoria_exp_ecuacion_torres", "teoria_exp_analogia_compuesta"] },
     { nombre: "Grado de Polinomio: Absoluto y Relativo", tipo: "academia", subtipos: ["grados_monomio_sistema", "grados_polinomio_trampa", "grados_operaciones_basicas", "grados_sistema_ecuaciones"] },
     { nombre: "Polinomios Especiales: Idénticos y Homogeneos", tipo: "academia", subtipos: ["polinomio_especial_homogeneo", "polinomio_especial_identicos", "polinomio_especial_completo_ordenado", "polinomio_especial_identicamente_nulo"] },
    { nombre: "Radicación", tipo: "academia", subtipos: ["radicacion_raiz_de_raiz", "radicacion_indices_diferentes", "radicacion_sucesiva_sandwich", "radicacion_indices_variables"] },

    { nombre: "Ecuaciones e Inecuaciones (Requisito)", tipo: "academia", subtipos: ["lineal", "sueldo_minimo", "punto_equilibrio", "area_maxima", "maximizar_productos"] },
    { nombre: "Teorema de Pitágoras y T. Notables (Requisito)", tipo: "academia", subtipos: ["teorema_pitagoras", "triangulos_notables"] },
    { nombre: "Promedios (Requisito)", tipo: "academia", subtipos: ["agregar_numero", "promedio_ponderado", "promedio_geometrico", "eliminar_numero"] },
    { nombre: "Analogías Numéricas (Requisito)", tipo: "academia", subtipos: ["analogias_numericas"] },

    { nombre: "Distribuciones Gráficas (Requisito)", tipo: "academia", subtipos: ["distribucion_grafica"] },
    { nombre: "Métodos Operativos: Cangrejo y Rectángulo (Requisito)", tipo: "academia", subtipos: ["cangrejo_3_pasos", "cangrejo_4_pasos", "rectangulo_entero", "rectangulo_decimal"] },
    { nombre: "Sólidos 3D: Cilindros (Complemento)", tipo: "academia", subtipos: ["solidos_3d_cilindro"] },

// 2. Tema exclusivo para Pirámides (Mapea al subtipo de tus JSON de pirámides)
    { nombre: "Sólidos 3D: Pirámides (Complemento)", tipo: "academia", subtipos: ["volumen_piramide", "area_piramide"] },
    { nombre: "Polinomios: Valor Numérico (Complemento)", tipo: "academia", subtipos: ["polinomios_reemplazo_negativo", "polinomios_igualacion_previa", "polinomios_evaluacion_multiple", "polinomios_composicion"] },
    { nombre: "Plano Cartesiano y Distancias (Complemento)", tipo: "academia", subtipos: ["plano_cartesiano"] },
    { nombre: "Intervalos Numéricos (Complemento)", tipo: "academia", subtipos: ["intervalos"] },
    { nombre: "Circunferencia y Propiedades (Complemento)", tipo: "academia", subtipos: ["angulos_circunferencia", "propiedades_circunferencia", "segmentos_circunferencia"] },
    { nombre: "Conteo de Figuras y Paginación (Complemento)", tipo: "academia", subtipos: ["conteo_figuras", "paginacion_1cifra", "paginacion_2cifras", "paginacion_3cifras", "paginacion_general"] },
    { nombre: "Conjuntos y Diagramas de Venn (Extra)", tipo: "academia", subtipos: ["dos_conjuntos_sin_fuera", "dos_conjuntos_con_fuera", "tres_conjuntos_solo_chocolate", "porcentajes_ninguno", "venn_grafico_elementos", "conjunto_unitario", "comprension_conjuntos"] },
    { nombre: "Fracciones Especiales: Grifos y Caños (Extra)", tipo: "academia", subtipos: ["dos_llenan", "llena_y_vacia", "tres_llenan", "con_apertura_diferida"] },
    { nombre: "Teorema de Thales (Extra)", tipo: "academia", subtipos: ["thales"] },
    { nombre: "Adición y Sustracción en Z", tipo: "algebra", subtipos: ["z_adicion_sustraccion"] },
    { nombre: "Multiplicación y División en Z", tipo: "algebra", subtipos: ["z_multiplicacion_division"] },


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
    { id: "rv_6_conectores", nombre: "Conectores Lógicos y Coherencia Textual", tipo: "academia", categoria: "COMUNICACION" },
   
  ],
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