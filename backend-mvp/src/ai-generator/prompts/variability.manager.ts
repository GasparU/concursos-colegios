// ============================================================================
// 🛡️ REGLAS UNIVERSALES DE COMPORTAMIENTO (NO TOCAR)
// Estas reglas aplican a TODOS los cursos y dificultades.
// ============================================================================
const UNIVERSAL_PROTOCOLS = `
3. VERIFICACIÓN SILENCIOSA:
   - Asegúrate de que la geometría/matemática sea posible (ej: no existen longitudes negativas).

🔴 PROHIBIDO escribir tu proceso de tanteo o errores en la respuesta ("Sin embargo...", "Vamos a corregir..."). Solo entrega el producto final perfecto.

4. REGLA DE COHERENCIA TEXTO-IMAGEN (CRÍTICO):
   - Si el enunciado empieza con "En la figura..." o "Según el gráfico...", ES OBLIGATORIO llenar 'visual_data' con elementos válidos.
   - Si decides NO generar gráfico (visual_data: { type: "none" }), el enunciado DEBE ser descriptivo.

5. REGLA DE SILENCIO ABSOLUTO (ANTI-ALUCINACIÓN):
   - PROHIBIDO escribir tu proceso de corrección ("Me equivoqué", "Asumamos otro valor").
   - Si tus números no cuadran, CORRIGELOS EN SILENCIO (recalcula internamente) y solo escribe el resultado final.
   - El usuario NO DEBE SABER que tuviste que recalcular.
   - JAMÁS digas "Ver gráfico" si no vas a generar uno.

6. 🔥 PROTOCOLO DE INTEGRIDAD DE DATOS (CRÍTICO):
   - Los valores que escribas en el 'question_markdown' SON LA VERDAD ABSOLUTA.
   - Cuando generes el 'visual_data' (o math_data), DEBES USAR exactamente esos mismos valores.
   - PROHIBIDO cambiar un signo o un número en el gráfico "para que se vea mejor".
   - Si en el texto dice "2x + 10", en el gráfico DEBE decir "2x + 10". Si difieren, ES UN ERROR FATAL.
`;

// ============================================================================
// 🧠 GENERADOR DE REGLAS DINÁMICAS (NUMÉRICAS)
// ============================================================================
export const GET_VARIABILITY_RULES = (
  subject: 'GEOMETRY' | 'ALGEBRA' | 'ARITHMETIC' | 'STATISTICS',
  difficulty: string,
) => {
  const isBasic =
    difficulty.toLowerCase().includes('basic') ||
    difficulty.toLowerCase().includes('básico');
  const isInter = difficulty.toLowerCase().includes('inter');
  // Si no es básico ni intermedio, asumimos avanzado

  let numberRules = '';

  // -------------------------------------------------------------------------
  // 📐 GEOMETRÍA
  // -------------------------------------------------------------------------
  if (subject === 'GEOMETRY') {
    if (isBasic) {
      numberRules = `
            1. DEFINIR OBJETIVO (BÁSICO):
               - ✅ USA SOLO ENTEROS PEQUEÑOS: Tu variable 'x' y los resultados deben ser enteros positivos (2 a 12).
               - ⛔ PROHIBIDO: Decimales, fracciones o raíces.
               - ⛔ PROHIBIDO: Inventar un 'Total' al azar. Calcula el total sumando tus segmentos.
               - EJEMPLO: x=5, x=10.`;
    } else if (isInter) {
      numberRules = `
            1. DEFINIR OBJETIVO (INTERMEDIO):
               - ✅ USA ENTEROS MEDIANOS: Tu variable 'x' debe ser un entero entre 13 y 19.
               - ⛔ PROHIBIDO: Decimales inexactos (ej: 17.253).
               - RETO: Aumenta la dificultad de la ECUACIÓN (algebraica), no de los NÚMEROS.`;
    } else {
      numberRules = `
            1. DEFINIR OBJETIVO (AVANZADO):
               - ✅ NIVEL RETADOR: Puedes usar enteros grandes (12-50) O decimales "limpios" (0.5, 2.5) o fracciones (1/3, 7/9).
               - OPCIONAL: Fracciones simples si el renderizado lo permite.
               - IMPORTANTE: Si la respuesta es decimal (ej: 17.5), asegúrate de que las alternativas también lo sean.`;
    }
  }

  // -------------------------------------------------------------------------
  // ✖️ ÁLGEBRA
  // -------------------------------------------------------------------------
  else if (subject === 'ALGEBRA') {
    if (isBasic) {
      numberRules = `1. DEFINIR OBJETIVO (BÁSICO): Usa coeficientes enteros (-10 a 10). Evita fracciones.`;
    } else if (isInter) {
      numberRules = `1. DEFINIR OBJETIVO (INTERMEDIO): Introduce fracciones simples (1/2, 3/4).`;
    } else {
      numberRules = `1. DEFINIR OBJETIVO (AVANZADO): Usa radicales (√2, √3) y fracciones complejas.`;
    }
  }

  // -------------------------------------------------------------------------
  // 📊 ESTADÍSTICA
  // -------------------------------------------------------------------------
  else if (subject === 'STATISTICS') {
    if (isBasic) {
      numberRules = `1. DEFINIR OBJETIVO (BÁSICO): Usa datos enteros pequeños (1-10), pocas categorías (3-4). Ejemplo: ventas de lunes a viernes.`;
    } else if (isInter) {
      numberRules = `1. DEFINIR OBJETIVO (INTERMEDIO): Introduce decimales simples (0.5, 1.2) y más categorías (5-6). Ejemplo: temperaturas medias.`;
    } else {
      numberRules = `1. DEFINIR OBJETIVO (AVANZADO): Usa datos con decimales, porcentajes, frecuencias relativas. Ejemplo: distribución de edades.`;
    }
  }

  // -------------------------------------------------------------------------
  // 🔢 ARITMÉTICA
  // -------------------------------------------------------------------------
  else {
    numberRules = `1. DEFINIR OBJETIVO: Usa números acordes al nivel (Enteros para básico, Decimales para avanzado).`;
  }

  // 🔥 FUSIÓN: REGLAS DINÁMICAS + REGLAS ESTÁTICAS DE SEGURIDAD
  return `
    🔥 REGLAS MAESTRAS DE GENERACIÓN (${subject} - ${difficulty.toUpperCase()}):
    Para evitar errores de cálculo o incoherencias, sigue este algoritmo SIEMPRE:

    ${numberRules}

    2. CONSTRUIR ENUNCIADO (INGENIERÍA INVERSA):
       - Inventa las ecuaciones o condiciones alrededor de tu valor 'x' elegido en el paso 1.
       - Calcula el TOTAL o la igualdad final usando tu 'x'.
       - *Ejemplo:* Si elegiste x=4 y quieres AB=3x+2, entonces AB=14. El dato del problema será "AB mide 14".

    ${UNIVERSAL_PROTOCOLS}
    `;
};