import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { GET_VARIABILITY_RULES } from '../variability.manager';
import { getSeeds } from '../../seeds';

export const MONEY_EXCHANGE_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Aritmética (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('ARITHMETIC', difficulty)}

====================================================================
📌 PROBLEMAS DE CANJE MONETARIO (UNA SOLA EQUIVALENCIA)
====================================================================
- Debes generar problemas donde se relacionen monedas y billetes, con una incógnita.
- El problema puede involucrar una o varias operaciones (sumas, restas, multiplicaciones) pero al final se reduce a una ecuación lineal simple.
- El enunciado debe ser **rico en contexto y narrativo**, similar a los problemas de exámenes reales. Incluye personajes, situaciones cotidianas 
(compras, viajes, ahorros, cambios de moneda, etc.), y datos realistas (billetes de 10,20,50,100 soles; dólares; euros; monedas de 0,10; 0,20; 0,50; 1; 2; 5 soles).
- La incógnita debe aparecer en **negrita** (por ejemplo: "**x** soles").
- Proporciona la ecuación en 'math_data' con el formato indicado. Si el problema requiere varios pasos, el 'math_data' debe contener solo la ecuación final que relaciona la incógnita con los datos conocidos.
- NO resuelvas el problema. El backend calculará la solución.

====================================================================
📌 FORMATO DE MATH_DATA
====================================================================
{
  "type": "money_exchange_simple",
  "params": {
    "equation": { "left": "8x", "right": "50" },
    "variable": "x"
  }
}

Nota: "left" debe ser una expresión como "ax" donde a es el número de monedas, y "right" es el valor del billete (número entero).

====================================================================
📌 EJEMPLOS DE ENUNCIADOS (question_markdown)
====================================================================
- "Ana desea llamar a su casa desde un teléfono público, el cual solo acepta monedas de S/0,10 o
S/0,20. Si Ana tiene solo una moneda de S/2, ¿por cuántas monedas solo de S/0,10 o solo de
S/0,20, respectivamente, le podrán cambiar su moneda de S/2 para que pueda hacer la llamada?"
- ""Katiuska quiere comprar pelotas de básquet para regalar a sus sobrinos. Con el dinero que tiene, 
puede comprar 3 pelotas de básquet iguales y todavía le sobran S/143. Pero si quisiera comprar 5 pelotas de básquet del mismo tipo, 
le faltarían S/97. ¿Cuánto cuesta cada pelota de básquet y cuánto dinero tiene Katiuska?"
- "Rosa quiere cambiar un billete de S/100 utilizando únicamente monedas de S/1 y de S/5. 
Ella puede recibir las monedas en diferentes combinaciones, siempre y cuando la suma total sea exactamente S/100 y 
recibe al menos una moneda de cada tipo. ¿De cuántas formas diferentes puede cambiar el billete?"
- "Un grupo de estudiantes quiere comprar una torta para el cumpleaños de su profesor. Si cada uno de ellos aporta S/6, 
faltaría S/8 para comprar la torta; pero si cada uno de ellos aporta S/10, sobraría S/8. ¿Cuánto debe aportar cada uno para comprar la torta y pagar la cuenta exacta? "
- "Teresa tiene 4 billetes de S/10, 3 monedas de S/5 y 2 monedas de S/1. Si ella compra un juguete de S/17, ¿cuánto dinero le quedará a Teresa luego de pagar por el juguete que compró? "
- "Úrsula no tenía dinero en su cartera, por lo que fue al cajero automático a retirar efectivo. El cajero le entregó tres billetes de S/100, un 
billete de S/50 y dos billetes de S/20. Después, fue a comprar víveres y pagó en la caja con un billete de S/100 y un billete de S/50. La cajera le devolvió como vuelto 
tres monedas de S/1, cinco monedas de S/0,50 y una moneda de S/0,20. ¿Cuánto dinero le queda a Úrsula después de esta compra?"
- "Claudia compró 4 chocolates por S/8 cada uno, 4 chupetines por S/1,5 cada uno y dos gaseosas grandes por S/9,5 cada una. Si pagó con un billete de S/100, ¿cuánto de vuelto debe recibir?"
- "Dante acompaña a su mamá al mercado y registra las compras que realiza su mamá, las cuales se detallan a continuación: • 4,5 kg de arroz de S/5,20 el kg. 
• 2,75 kg de papa amarilla de S/4,00 el kg. • 2 botellas de aceite de S/9,50 la botella. • 3,25 kg de carne de cerdo de S/16,80 el kg. 
¿Cuál es el gasto total en las compras que realizó la mamá de Dante?"

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
