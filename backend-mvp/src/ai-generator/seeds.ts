// src/ai-generator/seeds.ts

export const SEEDS_5TO_CLASIFICATORIA = `
PATRÓN 5TO-CL1 (Operaciones decimales):
"Juan tiene 8 latas de refresco de 0,33 L cada una. ¿De qué cantidad de refresco dispone?"
Lógica: 8 × 0,33 = 2,64 L
Trampa: Alternativas con errores de multiplicación (2,74; 2,54; 2,44)
Visual: none
Dificultad: Básica

PATRÓN 5TO-CL2 (Fracciones cotidianas):
"Luis come 1/8 de pizza y su hermano 1/4. ¿Qué fracción queda?"
Lógica: 1 - (1/8 + 1/4) = 1 - (1/8 + 2/8) = 1 - 3/8 = 5/8
Visual: none
Dificultad: Básica

PATRÓN 5TO-CL3 (Proporcionalidad directa):
"En Valorant, por 2 misiones dan 12000 puntos. ¿Cuánto por 3 misiones?"
Lógica: Regla de tres simple: 2/12000 = 3/x → x = 18000
Visual: none
Dificultad: Intermedia

PATRÓN 5TO-CL4 (Estadística - interpretación gráfica):
"Gráfico circular con 20 estudiantes y preferencias de redes sociales. Calcula cuántos prefieren Facebook o TikTok."
Lógica: Sumar porcentajes del gráfico y calcular de 20
Visual: chart_pie con sectores coloreados
Dificultad: Intermedia
`;

export const SEEDS_5TO_FINAL = `
PATRÓN 5TO-F1 (Fracciones compuestas):
"Camila tiene 3/8 de muñecas. De esas, 2/3 son de su personaje favorito. De esas, 4/5 están en buen estado. ¿Qué fracción son muñecas del personaje favorito en mal estado?"
Lógica: (3/8) × (2/3) × (1/5) = 1/20
Trampa: Confundir "en mal estado" con "en buen estado"
Dificultad: Avanzada

PATRÓN 5TO-F2 (Proporcionalidad inversa):
"2 trabajadores descargan 1200 kg en 45 min. ¿Cuántos trabajadores necesarios para 30 min?"
Lógica: Trabajadores × Tiempo = constante → 2×45 = n×30 → n=3
Dificultad: Intermedia

PATRÓN 5TO-F3 (Geometría - áreas compuestas):
"Cuadrado ABCD con perímetro 36 cm. Cuadrado PQRS con lado 1/3 de AB. Hallar perímetro de región sombreada."
Lógica: Lado ABCD = 9 cm, lado PQRS = 3 cm. Perímetro sombreado = perímetro ABCD + 4×lado PQRS
Visual: geometry_mafs con dos cuadrados concéntricos
Dificultad: Avanzada

PATRÓN 5TO-F4 (Sucesión con dos patrones):
"8; 11; 13; 16; 18; 23; 23; 32; ... Hallar suma de los dos siguientes."
Lógica: Patrón 1: +3, +2, +3, +2,... Patrón 2: +5, +7, +9,... 
Dificultad: Avanzada
`;

export const SEEDS_6TO_CLASIFICATORIA = `
PATRÓN 6TO-CL1 (MCD aplicado):
"Agricultor con terrenos 180×144 y 120×72. Dividir en parcelas cuadradas iguales del mayor tamaño posible. ¿Cuántas parcelas?"
Lógica: MCD(180,144)=36, MCD(120,72)=24. Área total/área parcela = (180×144)/(36×36) + (120×72)/(24×24)
Dificultad: Intermedia

PATRÓN 6TO-CL2 (MCM - aplicaciones cotidianas):
"3 líneas de buses salen cada 45, 60 y 75 minutos. Si salen juntos a las 6:00 am, ¿cuándo coincidirán por 5ta vez?"
Lógica: MCM(45,60,75)=900 min = 15h. 4×15=60h = 2 días 12h → Lunes 6:00 pm
Dificultad: Intermedia

PATRÓN 6TO-CL3 (Números primos):
"Hallar suma de primos entre 25 y 55: 29+31+37+41+43+47+53 = 281"
Lógica: Verificar cada número, sumar
Dificultad: Básica

PATRÓN 6TO-CL4 (Proporcionalidad compuesta):
"Ahorro proporcional al cuadrado del ingreso diario. Si ingreso aumenta S/300, ahorro es 8 veces más. Hallar ingreso mensual."
Lógica: k(d)^2 = a, k(d+300)^2 = 8a → (d+300)/d = √8 → d=300/(√8-1) → mensual=25d
Dificultad: Avanzada
`;

export const SEEDS_6TO_FINAL = `
PATRÓN 6TO-F1 (Combinatoria básica):
"Víctor tiene 5 canicas diferentes. ¿De cuántas maneras puede dar 2 a su hermano?"
Lógica: Combinación C(5,2)=10
Dificultad: Intermedia

PATRÓN 6TO-F2 (Geometría 3D - volúmenes):
"Cubo de arista 6 cm lleno de agua. Verter en prisma de base cuadrada 4×4 cm. ¿Qué altura debe tener el prisma?"
Lógica: Volumen cubo = 216 cm³ → 216 = 4×4×h → h=13,5 cm
Visual: geometry_3d con cubo y prisma
Dificultad: Intermedia

PATRÓN 6TO-F3 (Probabilidad compuesta):
"Se lanza un dado de 12 caras. Probabilidad de múltiplo de 3: 4/12 = 1/3"
Lógica: Múltiplos: 3,6,9,12 → 4 casos favorables
Dificultad: Intermedia

PATRÓN 6TO-F4 (Álgebra básica):
"Si x + 1/x = 3, hallar x² + 1/x²"
Lógica: (x + 1/x)² = x² + 2 + 1/x² → 9 = x² + 2 + 1/x² → x² + 1/x² = 7
Dificultad: Avanzada

PATRÓN 6TO-F5 (Caja sin tapa):
"De una cartulina de 28 cm × 24 cm se cortan cuadrados de x cm en las esquinas. Si se dobla para formar una caja sin tapa de volumen 1280 cm³, halla x."
Lógica: (28-2x)(24-2x)x = 1280 → x=4
Visual: net_box con net_dimensions { width:28, height:24, cut_square_side:4 }
Dificultad: Avanzada

PATRÓN 6TO-F6 (Cadena de eslabones):
"Se tiene una cadena formada por 5 eslabones idénticos. Cada eslabón mide 2 cm de largo y 3 cm de ancho. Calcula la longitud total."
Lógica: Longitud = 5*2 + (5-1)*? ... (problema real: 2*5 + 3*(4) = 22 cm)
Visual: chain_links con link_length=2, link_width=3, num_links=5, total_length_label="22 cm"
Dificultad: Intermedia
`;

// Función helper para recuperar semillas
export const getSeeds = (grade: string, stage: string) => {
    if (grade === '5to' && stage === 'clasificatoria') return SEEDS_5TO_CLASIFICATORIA;
    if (grade === '5to' && stage === 'final') return SEEDS_5TO_FINAL;
    if (grade === '6to' && stage === 'clasificatoria') return SEEDS_6TO_CLASIFICATORIA;
    if (grade === '6to' && stage === 'final') return SEEDS_6TO_FINAL;
    return "Genera un problema matemático estándar, variado y creativo.";
};