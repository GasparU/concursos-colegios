// src/ai-generator/seeds.ts

export const SEEDS_3RO_CLASIFICATORIA = `
PATRÓN 3-CL1 (Operaciones combinadas básicas):
Ejemplo 1: "Oliver tiene S/12; su hermano Juan, el cuádruple; su primo Miguel, la mitad de Juan. ¿Cuánto tienen entre los tres?"
Ejemplo 2: "María tiene 8 canicas; su amiga Ana tiene el triple; y su prima Luisa tiene la mitad de Ana. ¿Cuántas canicas tienen entre todas?"
Ejemplo 3: "Un agricultor cosecha 15 kg de papas; su vecino cosecha el doble; y otro amigo cosecha la tercera parte del vecino. ¿Cuántos kg cosecharon en total?"
Lógica: Calcular cada cantidad y sumar.
Trampa: Errores al multiplicar/dividir (ej. 12×4=44, 48÷2=22).
Visual: none
Dificultad: Básica

PATRÓN 3-CL2 (Ecuaciones simples):
Ejemplo 1: "Mi edad es tal que si le sumo el doble, triple y cuádruple, obtengo 6 decenas. ¿Cuál es mi edad?"
Ejemplo 2: "Si a un número le sumo su triple y su quíntuple, obtengo 90. ¿Cuál es el número?"
Ejemplo 3: "La suma del doble y el triple de un número es 60. Halla el número."
Lógica: Plantear ecuación lineal simple.
Trampa: Olvidar sumar la propia edad (solo doble+triple+cuádruple).
Visual: none
Dificultad: Básica

PATRÓN 3-CL3 (Fracciones equivalentes con gráfico):
Ejemplo 1: "Halla la suma de los números que faltan en cada par de fracciones equivalentes." (con diagrama de barras)
Ejemplo 2: "Observa las fracciones representadas en los gráficos. ¿Cuál es el valor de A + B?"
Ejemplo 3: "Completa las fracciones equivalentes y calcula el producto de los numeradores."
Lógica: Identificar la fracción representada y hallar el término que falta usando equivalencia.
Trampa: Confundir numerador con denominador.
Visual: chart_bar con barras de fracciones
Dificultad: Intermedia

PATRÓN 3-CL4 (Sucesión aritmética):
Ejemplo 1: "349; 342; 335; 328; ... Halla el primer término menor que 300."
Ejemplo 2: "5; 9; 13; 17; ... ¿Cuál es el décimo término?"
Ejemplo 3: "Una sucesión empieza en 100 y disminuye de 7 en 7. ¿Cuál es el primer término negativo?"
Lógica: Identificar la diferencia y usar término general.
Trampa: Contar mal los términos (empezar en n=0).
Visual: none
Dificultad: Intermedia

PATRÓN 3-CL5 (Perímetro con figuras):
Ejemplo 1: "Calcula el perímetro de la región sombreada." (figura compuesta por cuadrados)
Ejemplo 2: "La figura muestra un rectángulo dividido en cuadrados. Halla su perímetro."
Ejemplo 3: "Determina el perímetro de la figura formada por 3 cuadrados de lado 2 cm."
Lógica: Sumar las longitudes de los lados exteriores.
Trampa: Contar lados de más o de menos.
Visual: geometry_mafs con polígonos y medidas
Dificultad: Intermedia

PATRÓN 3-CL6 (Fracciones sucesivas):
Ejemplo 1: "De los 600 mL de gaseosa, Boris se toma la mitad; luego, del resto, la tercera parte; luego, del nuevo resto, la cuarta parte. ¿Cuánto queda?"
Ejemplo 2: "Un depósito de agua de 240 litros pierde la tercera parte de su contenido, luego la cuarta parte de lo que queda, y finalmente la quinta parte del nuevo resto. ¿Cuántos litros quedan?"
Ejemplo 3: "María gasta la mitad de su dinero en un libro, luego la tercera parte del resto en un cuaderno, y aún le quedan S/20. ¿Cuánto tenía?"
Lógica: Aplicar fracciones sucesivas al resto.
Trampa: Aplicar la fracción al total en lugar de al resto.
Visual: none
Dificultad: Avanzada

PATRÓN 3-CL7 (Cambio de monedas con condiciones):
Ejemplo 1: "Ana tiene una moneda de S/2. Quiere cambiarla solo por monedas de S/0,10 o solo por monedas de S/0,20. ¿Por cuántas monedas de cada tipo le pueden cambiar?"
Ejemplo 2: "Juan tiene un billete de S/10 y desea cambiarlo solo por monedas de S/0,50 y S/1,00. ¿De cuántas formas puede hacerlo si debe recibir al menos una de cada tipo?"
Ejemplo 3: "Con un billete de S/20, ¿cuántas combinaciones de monedas de S/2 y S/5 se pueden obtener si se usa al menos una de cada?"
Lógica: Encontrar todas las combinaciones enteras no negativas que sumen el valor.
Trampa: No considerar todas las combinaciones.
Visual: none
Dificultad: Avanzada
`;

export const SEEDS_3RO_FINAL = `
PATRÓN 3-F1 (Sistema de ecuaciones con edades):
Ejemplo 1: "Mariana y Alexander multiplicaron sus edades. Mariana sumó la suma de sus edades al producto y obtuvo 107; Alexander restó la suma al producto y obtuvo 69. ¿Qué edad tendrá Alexander cuando Mariana cumpla 18?"
Ejemplo 2: "Dos números enteros positivos son tales que su producto más su suma es 23, y su producto menos su suma es 15. Halla el mayor."
Ejemplo 3: "La suma de dos números es 12 y su producto es 35. Halla la diferencia de sus cuadrados."
Lógica: Plantear sistema de ecuaciones.
Trampa: No plantear correctamente el sistema.
Visual: none
Dificultad: Avanzada

PATRÓN 3-F2 (Progresión aritmética y producto):
Ejemplo 1: "Mildred empezó a ahorrar el 1 de noviembre con cierta cantidad y cada día posterior ahorra S/5 más. Multiplicó lo ahorrado hasta el 18 de noviembre con lo del 9 de noviembre y obtuvo S/6300. ¿Cuánto tendrá hasta el 1 de diciembre?"
Ejemplo 2: "Un agricultor planta árboles cada día. El primer día planta 5, y cada día siguiente planta 3 más que el anterior. El producto de lo plantado en el día 8 y el día 5 es 528. ¿Cuántos árboles plantó en total en los primeros 10 días?"
Ejemplo 3: "Una sucesión aritmética de razón 4 tiene como términos a y b. Si a×b = 140 y a < b, halla a+b."
Lógica: Usar término general y resolver ecuación cuadrática.
Trampa: Confundir días con términos.
Visual: none
Dificultad: Avanzada

PATRÓN 3-F3 (Probabilidad con triángulos):
Ejemplo 1: "Una varilla de 70 cm tiene marcas equidistantes cada 10 cm (6 puntos). Se corta en dos de esas marcas. ¿Cuál es la probabilidad de que con los tres trozos obtenidos pueda formar un triángulo isósceles?"
Ejemplo 2: "Se tienen 8 puntos sobre una recta. Se eligen 3 al azar. ¿Probabilidad de que puedan formar un triángulo (no degenerado)?"
Ejemplo 3: "De una barra de 1 m se marcan puntos cada 20 cm. Si se corta en dos puntos al azar, ¿probabilidad de que los tres trozos formen un triángulo?"
Lógica: Combinatoria y desigualdad triangular.
Trampa: Contar combinaciones que no cumplen la desigualdad.
Visual: none
Dificultad: Avanzada

PATRÓN 3-F4 (Enumeración de páginas):
Ejemplo 1: "Una enciclopedia de tres tomos iguales. La numeración del tercer tomo empezó en 841. ¿Cuántas cifras se utilizaron en la enumeración de este tercer tomo?"
Ejemplo 2: "Un libro tiene 500 páginas. ¿Cuántas cifras se usan para numerarlas?"
Ejemplo 3: "Para numerar las páginas de un libro se usaron 300 dígitos. ¿Cuántas páginas tiene?"
Lógica: Contar dígitos según rango de páginas.
Trampa: No considerar el cambio de 1 a 2 cifras, etc.
Visual: none
Dificultad: Avanzada
`;

export const SEEDS_4TO_CLASIFICATORIA = `
PATRÓN 4-CL1 (Fracciones de un total):
Ejemplo 1: "En un pueblo, la tercera parte cultiva papa; los 3/4 del resto cultivan maíz; los restantes 40 cultivan lechuga. ¿Cuántos habitantes tiene?"
Ejemplo 2: "De un terreno, se siembran 2/5 con maíz, luego 1/3 del resto con trigo, y quedan 200 m² sin sembrar. ¿Cuál es el área total?"
Ejemplo 3: "Un tanque de agua tiene 3/8 de su capacidad. Si se vacía 1/4 de lo que tiene, quedan 90 litros. ¿Cuál es la capacidad total?"
Lógica: Resolver con ecuaciones fraccionarias.
Trampa: Sumar incorrectamente las fracciones.
Visual: none
Dificultad: Intermedia

PATRÓN 4-CL2 (Ecuaciones de edades):
Ejemplo 1: "Pedro tiene el cuádruple de Laura. Ambas edades suman 45. ¿Qué edad tendrá Laura dentro de 5 años?"
Ejemplo 2: "La edad de Juan es el triple de la de Ana. Hace 5 años, la suma de sus edades era 30. ¿Cuántos años tiene Ana?"
Ejemplo 3: "Dentro de 10 años, la edad de Carlos será el doble de la que tenía hace 5 años. ¿Cuál es su edad actual?"
Lógica: Plantear ecuación lineal.
Trampa: No considerar el tiempo transcurrido.
Visual: none
Dificultad: Básica

PATRÓN 4-CL3 (Operaciones con decimales):
Ejemplo 1: "Rosa compra 2 kg de arroz a S/3,6/kg, 3 tarros de leche a S/3,2 c/u, 1 kg de avena a S/4,5. Paga con S/25. ¿Cuánto recibe de vuelto?"
Ejemplo 2: "Luis compra 1,5 kg de manzanas a S/4,80/kg, 2,3 kg de plátanos a S/2,50/kg y 0,8 kg de uvas a S/6,20/kg. Paga con S/30. ¿Cuánto vuelto recibe?"
Ejemplo 3: "María compra 3 cuadernos a S/5,40 cada uno, 2 lapiceros a S/1,80 cada uno y 1 borrador a S/0,90. Si paga con S/20, ¿cuánto le devuelven?"
Lógica: Sumar productos y restar del pago.
Trampa: Errores de multiplicación o suma decimal.
Visual: none
Dificultad: Básica

PATRÓN 4-CL4 (Regla de tres compuesta):
Ejemplo 1: "Un albañil sabe que con 3/4 de bolsa de cemento construye 1/2 bloque. ¿Cuántas bolsas necesitará para construir 7 bloques completos?"
Ejemplo 2: "Con 5 kg de harina se hacen 80 panes. ¿Cuántos panes se harán con 8 kg?"
Ejemplo 3: "Si 4 obreros hacen una obra en 12 días, ¿cuántos días tardarán 6 obreros en la misma obra?"
Lógica: Proporcionalidad directa o inversa.
Trampa: Confundir directa con inversa.
Visual: none
Dificultad: Intermedia

PATRÓN 4-CL5 (Sucesión y producto):
Ejemplo 1: "En una juguería, cada día asisten 3 personas más que el día anterior. El producto del número de clientes del sexto y séptimo día es 340. ¿Cuántos clientes tuvo el primer día?"
Ejemplo 2: "Una progresión aritmética de razón 5 tiene como términos a y b. Si a×b = 84 y a < b, halla a+b."
Ejemplo 3: "El primer término de una PA es 2 y la razón es 3. El producto de los términos de lugares 4 y 5 es 770. Halla el término 6."
Lógica: Usar término general y resolver ecuación cuadrática.
Trampa: No plantear correctamente la ecuación.
Visual: none
Dificultad: Avanzada

PATRÓN 4-CL6 (Probabilidad con dados):
Ejemplo 1: "Al lanzar un dado común, indica qué alternativa es correcta sobre la probabilidad de obtener cierto puntaje."
Ejemplo 2: "Se lanza un dado. ¿Cuál es la probabilidad de obtener un número primo?"
Ejemplo 3: "Se lanza un dado dos veces. ¿Probabilidad de que la suma sea 7?"
Lógica: Calcular casos favorables y totales.
Trampa: No contar correctamente los casos.
Visual: none
Dificultad: Intermedia

PATRÓN 4-CL7 (Canje monetario con contexto):
Ejemplo 1: "Ana necesita hacer una llamada desde un teléfono público que solo acepta monedas de S/0,10. Ella tiene una moneda de S/2 y la cambia en la cabina. Si recibe **x** monedas de S/0,10, ¿cuál es el valor de **x**?"
Lógica: 0,10x = 2 → x = 20.
Trampa: Confundir 0,10 con 10 céntimos, o hacer 2/10 = 0,2.
Visual: none
Dificultad: Básica

Ejemplo 2: "Úrsula fue al cajero automático y retiró tres billetes de S/100, un billete de S/50 y dos billetes de S/20. Luego fue a comprar víveres y pagó con un billete de S/100 y uno de S/50. La cajera le devolvió de vuelto tres monedas de S/1, cinco monedas de S/0,50 y una moneda de S/0,20. Si el costo de los víveres fue de **x** soles, halla **x**."
Lógica: Dinero inicial = 3×100 + 50 + 2×20 = 300+50+40 = 390. Pagó con 100+50 = 150, por lo tanto el vuelto debería ser 150 - x. El vuelto real en monedas suma 3×1 + 5×0,5 + 1×0,2 = 3 + 2,5 + 0,2 = 5,7. Entonces 150 - x = 5,7 → x = 144,3. (Puede simplificarse con números enteros si se usan monedas de S/0,50 y S/0,20, pero da decimal. Se puede ajustar para que dé entero cambiando las monedas.)
Trampa: Sumar mal las monedas o los billetes.
Visual: none
Dificultad: Intermedia

Ejemplo 3: "Arleth realizó una compra por internet de 2 polos a S/19,80 cada uno y 3 pantalones a S/43,50 cada uno. Antes de la compra tenía un saldo de S/358,60. ¿Cuál es su nuevo saldo? (Expresa el nuevo saldo como **x** soles)."
Lógica: Gasto = 2×19,80 + 3×43,50 = 39,60 + 130,50 = 170,10. Nuevo saldo = 358,60 - 170,10 = 188,50. Ecuación: x = 358,60 - (2×19,80 + 3×43,50). Es una ecuación lineal, pero la incógnita ya está despejada. Para que tenga una incógnita en la ecuación, podríamos plantear: "Si el precio de cada polo es **y** soles y cada pantalón es **z** soles, y se sabe que 2y+3z = 170,10, con y=19,80, halla z." Pero eso es más complejo. Mejor mantener la incógnita como el nuevo saldo.
Trampa: Errores de suma o multiplicación.
Visual: none
Dificultad: Intermedia

`;

export const SEEDS_4TO_FINAL = `
PATRÓN 4-F1 (Identificar números primos):
Ejemplo 1: "De la lista: 17; 27; 37; 41; 91; 57; 31; 89; 103; 59; 39; 79, ¿cuántos son primos?"
Ejemplo 2: "¿Cuántos números primos hay entre 50 y 70?"
Ejemplo 3: "Suma los números primos de dos cifras que terminan en 3."
Lógica: Reconocer primalidad.
Trampa: Confundir 91 (7×13) o 57 (3×19).
Visual: none
Dificultad: Intermedia

PATRÓN 4-F2 (Operaciones combinadas con fracciones y decimales):
Ejemplo 1: "Calcule: 7 13/12 + 2 1/4 - 6 + 0,3"
Ejemplo 2: "Resuelve: 3,5 - 1/4 + 2/3 - 0,75"
Ejemplo 3: "Halla el valor de: (2/5 + 0,6) × (1 - 1/3)"
Lógica: Convertir todo a fracción o decimal y operar.
Trampa: Error en conversión.
Visual: none
Dificultad: Avanzada

PATRÓN 4-F3 (Fracción equivalente con suma de términos):
Ejemplo 1: "Una fracción equivalente a 42/78 tiene suma de términos igual a 220. Halla la suma de cifras del numerador."
Ejemplo 2: "Halla una fracción equivalente a 15/25 tal que la suma de sus términos sea 80. Da el numerador."
Ejemplo 3: "Simplifica 36/48. Luego, encuentra una fracción equivalente con denominador 20. Suma sus términos."
Lógica: Simplificar y encontrar la constante de proporcionalidad.
Trampa: Olvidar simplificar primero.
Visual: none
Dificultad: Intermedia

PATRÓN 4-F4 (Proporcionalidad en áreas):
Ejemplo 1: "Un pintor tarda 48 min en pintar una pared cuadrada de 3 m de lado. ¿Cuánto tardará en pintar otra pared de 4 m de altura por 6 m de largo?"
Ejemplo 2: "Para pavimentar una calle de 100 m de largo y 8 m de ancho se necesitan 40 obreros. ¿Cuántos obreros se necesitan para una calle de 150 m de largo y 10 m de ancho?"
Ejemplo 3: "Una máquina produce 120 botellas en 2 horas. ¿Cuántas producirá en 5 horas si trabaja al mismo ritmo?"
Lógica: Proporcionalidad directa (área o producción).
Trampa: Usar perímetro en lugar de área.
Visual: none
Dificultad: Intermedia

PATRÓN 4-F5 (Ángulos en progresión aritmética):
Ejemplo 1: "Los ángulos interiores de un cuadrilátero están en progresión aritmética de razón 30°. Calcula el mayor ángulo."
Ejemplo 2: "Las medidas de los ángulos de un triángulo están en PA. Si el menor mide 40°, halla los otros."
Ejemplo 3: "En un pentágono, los ángulos están en PA de razón 10°. Halla el ángulo central."
Lógica: Suma de ángulos internos y término general.
Trampa: No recordar la suma de ángulos (triángulo 180°, cuadrilátero 360°).
Visual: geometry_mafs con ángulos
Dificultad: Intermedia

PATRÓN 4-F6 (Multiplicación con cifras ocultas):
Ejemplo 1: "Completa la multiplicación y halla la suma de cifras del producto." (típico de examen)
Ejemplo 2: "En la siguiente multiplicación, cada asterisco es una cifra. Reconstruye la operación y halla la suma de cifras del multiplicando."
Ejemplo 3: "Si 3*4 × 5 = 1720, halla la cifra que falta."
Lógica: Resolver la multiplicación parcial deduciendo cifras.
Trampa: Errores en la multiplicación parcial.
Visual: none
Dificultad: Avanzada
`;

// Seeds para 5to (ampliados con más ejemplos)
export const SEEDS_5TO_CLASIFICATORIA = `
PATRÓN 5-CL1 (Operaciones decimales):
Ejemplo 1: "Juan tiene 8 latas de refresco de 0,33 L cada una. ¿De qué cantidad de refresco dispone?"
Ejemplo 2: "María compra 5 paquetes de arroz de 0,75 kg cada uno. ¿Cuántos kg tiene en total?"
Ejemplo 3: "Un litro de leche cuesta S/3,50. ¿Cuánto cuestan 2,5 litros?"
Lógica: Multiplicación de decimales.
Trampa: Errores de multiplicación (2,64; 2,74; etc.)
Visual: none
Dificultad: Básica

PATRÓN 5-CL2 (Fracciones cotidianas):
Ejemplo 1: "Luis come 1/8 de pizza y su hermano 1/4. ¿Qué fracción queda?"
Ejemplo 2: "María se come 1/3 de una torta y luego su amiga se come 1/5 del resto. ¿Qué fracción queda?"
Ejemplo 3: "De un depósito de agua, se extrae primero 2/5 y luego 1/3 del resto. ¿Qué fracción queda?"
Lógica: Restar fracciones, considerar restos.
Trampa: Sumar directamente sin considerar el resto.
Visual: none
Dificultad: Básica

PATRÓN 5-CL3 (Proporcionalidad directa):
Ejemplo 1: "En Valorant, por 2 misiones dan 12000 puntos. ¿Cuánto por 3 misiones?"
Ejemplo 2: "Si 3 kg de manzanas cuestan S/12, ¿cuánto costarán 5 kg?"
Ejemplo 3: "Un auto recorre 120 km en 2 horas. ¿Cuánto recorrerá en 5 horas a la misma velocidad?"
Lógica: Regla de tres simple.
Trampa: Invertir la proporción.
Visual: none
Dificultad: Intermedia

PATRÓN 5-CL4 (Estadística - interpretación gráfica):
Ejemplo 1: "Gráfico circular con 20 estudiantes y preferencias de redes sociales. Calcula cuántos prefieren Facebook o TikTok."
Ejemplo 2: "En un diagrama de barras, las ventas de lunes a viernes son 40, 60, 50, 70, 80. ¿Cuál es el promedio?"
Ejemplo 3: "La siguiente tabla muestra las edades de 10 personas: 12, 14, 15, 14, 16, 15, 13, 14, 15, 16. Halla la moda."
Lógica: Leer gráfico o tabla, calcular frecuencias.
Trampa: Malinterpretar la escala.
Visual: chart_pie o chart_bar según corresponda
Dificultad: Intermedia

PATRÓN 5-CL5 (Gráfico de barras con total):
Ejemplo: "Las ventas del lunes fueron 18, martes 20, miércoles 25, jueves 30, viernes 6k, sábado 15, domingo 12. Si el total de ventas de la semana fue 165 mil soles, halla k."
Lógica: 18+20+25+30+15+12 = 120, 120 + 6k = 165 → 6k = 45 → k = 7.5
Visual: chart_bar con los datos.
Dificultad: Intermedia

PATRÓN 5-CL6 (Canje con cambio de divisas):
Ejemplo 1: "María viaja a España y desea cambiar 1200 USD a euros. La casa de cambio cobra 1,5% de comisión sobre los dólares antes de la conversión. El tipo de cambio es 1 USD = 0,92 EUR. Luego de la conversión, le cobran 3 EUR adicionales por gastos administrativos. ¿Cuántos euros recibe finalmente? (Expresa el resultado como **x** euros)."
Lógica: Dólares netos = 1200 - 1,5% de 1200 = 1200 - 18 = 1182 USD. Luego euros = 1182 × 0,92 = 1087,44 EUR. Finalmente, x = 1087,44 - 3 = 1084,44 EUR.
Trampa: Olvidar restar la comisión o los gastos.
Visual: none
Dificultad: Avanzada 

Ejemplo 2: "En una tienda, un cliente paga con 7 monedas de **x** soles y 3 billetes de S/10. El vendedor le devuelve S/5 de vuelto. Si el precio del producto es S/90, halla **x**." (Ajustar números para que x sea entero o decimal simple.)
Lógica: 7x + 30 - 5 = 90 → 7x = 65 → x = 65/7 ≈ 9,2857. Para que sea entero, cambiar a 7x + 30 - 5 = 86 → 7x = 61 → no. Mejor usar números que den x entero: por ejemplo, 8x + 30 - 5 = 90 → 8x = 65 → no. Podemos diseñar con x entero: 5x + 30 - 5 = 90 → 5x = 65 → x = 13. Entonces enunciado: "Un cliente paga con 5 monedas de **x** soles y 3 billetes de S/10, recibe S/5 de vuelto y el producto cuesta S/90. Halla x." Esto funciona.
Trampa: Confundir el vuelto con el pago.
Visual: none
Dificultad: Avanzada 


`;

export const SEEDS_5TO_FINAL = `
PATRÓN 5-F1 (Fracciones compuestas):
Ejemplo 1: "Camila tiene 3/8 de muñecas. De esas, 2/3 son de su personaje favorito. De esas, 4/5 están en buen estado. ¿Qué fracción son muñecas del personaje favorito en mal estado?"
Ejemplo 2: "En un salón, 2/5 de los alumnos son mujeres. De ellas, 3/4 usan lentes. ¿Qué fracción del total son mujeres que usan lentes?"
Ejemplo 3: "Un depósito tiene agua hasta 3/4 de su capacidad. Se consume 2/3 del agua. ¿Qué fracción del total queda?"
Lógica: Producto de fracciones.
Trampa: Confundir "en mal estado" con "en buen estado".
Visual: none
Dificultad: Avanzada

PATRÓN 5-F2 (Proporcionalidad inversa):
Ejemplo 1: "2 trabajadores descargan 1200 kg en 45 min. ¿Cuántos trabajadores necesarios para 30 min?"
Ejemplo 2: "4 máquinas producen 1000 piezas en 6 horas. ¿Cuántas horas tardarán 6 máquinas en producir la misma cantidad?"
Ejemplo 3: "A 80 km/h, un auto tarda 3 horas en un viaje. ¿A qué velocidad debe ir para tardar 2 horas?"
Lógica: Producto constante (trabajadores×tiempo, velocidad×tiempo).
Trampa: Usar proporcionalidad directa.
Visual: none
Dificultad: Intermedia

PATRÓN 5-F3 (Geometría - áreas compuestas):
Ejemplo 1: "Cuadrado ABCD con perímetro 36 cm. Cuadrado PQRS con lado 1/3 de AB. Hallar perímetro de región sombreada."
Ejemplo 2: "Un rectángulo de 10 cm × 6 cm tiene un triángulo en su interior. Calcula el área sombreada."
Ejemplo 3: "Un círculo de radio 5 cm tiene un cuadrado inscrito. Halla el área de la región fuera del cuadrado."
Lógica: Calcular áreas de figuras compuestas.
Trampa: No considerar superposiciones.
Visual: geometry_mafs
Dificultad: Avanzada

PATRÓN 5-F4 (Sucesión con dos patrones):
Ejemplo 1: "8; 11; 13; 16; 18; 23; 23; 32; ... Hallar suma de los dos siguientes."
Ejemplo 2: "2; 4; 7; 11; 16; ... ¿Cuál es el décimo término?"
Ejemplo 3: "Una sucesión tiene dos patrones intercalados: +3, +2, +3, +2,... y +5, +7, +9,... Halla el término 15."
Lógica: Identificar y combinar patrones.
Trampa: Mezclar los patrones incorrectamente.
Visual: none
Dificultad: Avanzada
`;

export const SEEDS_6TO_CLASIFICATORIA = `
PATRÓN 6-CL1 (MCD aplicado):
Ejemplo 1: "Agricultor con terrenos 180×144 y 120×72. Dividir en parcelas cuadradas iguales del mayor tamaño posible. ¿Cuántas parcelas?"
Ejemplo 2: "Se tienen 240 manzanas y 180 naranjas. Se quieren empaquetar en bolsas iguales con la mayor cantidad posible sin mezclar. ¿Cuántas bolsas se necesitan?"
Ejemplo 3: "Tres varillas de 90 cm, 120 cm y 150 cm se quieren cortar en trozos iguales del mayor tamaño posible. ¿Cuántos trozos se obtienen?"
Lógica: MCD y luego división de áreas o longitudes.
Trampa: Calcular MCM en lugar de MCD.
Visual: none
Dificultad: Intermedia

PATRÓN 6-CL2 (MCM - aplicaciones cotidianas):
Ejemplo 1: "3 líneas de buses salen cada 45, 60 y 75 minutos. Si salen juntos a las 6:00 am, ¿cuándo coincidirán por 5ta vez?"
Ejemplo 2: "Dos amigos visitan a su abuela cada 12 y 18 días. Si hoy coinciden, ¿dentro de cuántos días volverán a coincidir?"
Ejemplo 3: "Un semáforo cambia a verde cada 30 segundos, otro cada 45 segundos. Si están en verde juntos a las 8:00, ¿a qué hora volverán a estar juntos en verde?"
Lógica: MCM y sumar intervalos.
Trampa: Multiplicar por el número de veces sin considerar la primera.
Visual: none
Dificultad: Intermedia

PATRÓN 6-CL3 (Números primos):
Ejemplo 1: "Hallar suma de primos entre 25 y 55: 29+31+37+41+43+47+53 = 281"
Ejemplo 2: "¿Cuántos números primos hay entre 1 y 50?"
Ejemplo 3: "Suma los números primos de dos cifras que empiezan con 1."
Lógica: Identificar primos y sumar.
Trampa: Incluir 1 o números compuestos.
Visual: none
Dificultad: Básica

PATRÓN 6-CL4 (Proporcionalidad compuesta):
Ejemplo 1: "Ahorro proporcional al cuadrado del ingreso diario. Si ingreso aumenta S/300, ahorro es 8 veces más. Hallar ingreso mensual."
Ejemplo 2: "La fuerza de atracción es inversamente proporcional al cuadrado de la distancia. Si a 2 m la fuerza es 50 N, ¿cuál será a 5 m?"
Ejemplo 3: "El área de un círculo es proporcional al cuadrado del radio. Si un círculo de radio 3 cm tiene área 28,26 cm², ¿qué área tiene un círculo de radio 5 cm?"
Lógica: Plantear proporción con potencias.
Trampa: Usar proporción lineal en lugar de cuadrática.
Visual: none
Dificultad: Avanzada

PATRÓN 6-CL5 (Tabla de frecuencia con media):
Ejemplo: "En la tabla se muestran las edades de un grupo. Halla m si la media es 12.5."
Visual: frequency_table con datos: headers ["Edad","Frecuencia"], rows [[10,4],[11,6],[12,8],[13,"m"],[14,2]], caption "Distribución de edades"
Lógica: Resolviendo se obtiene m=40.
Dificultad: Intermedia

PATRÓN 6-CL6 (Gráfico de barras con total):
Ejemplo: "Las ventas del lunes fueron 18, martes 20, miércoles 25, jueves 30, viernes 6k, sábado 15, domingo 12. Si el total de ventas de la semana fue 165 mil soles, halla k."
Lógica: 18+20+25+30+15+12 = 120, 120 + 6k = 165 → 6k = 45 → k = 7.5
Visual: chart_bar con los datos.
Dificultad: Intermedia

PATRÓN 6-CL7 (Canje con cambio de divisas):
Ejemplo 1: "María viaja a España y desea cambiar 1200 USD a euros. La casa de cambio cobra 1,5% de comisión sobre los dólares antes de la conversión. El tipo de cambio es 1 USD = 0,92 EUR. Luego de la conversión, le cobran 3 EUR adicionales por gastos administrativos. ¿Cuántos euros recibe finalmente? (Expresa el resultado como **x** euros)."
Lógica: Dólares netos = 1200 - 1,5% de 1200 = 1200 - 18 = 1182 USD. Luego euros = 1182 × 0,92 = 1087,44 EUR. Finalmente, x = 1087,44 - 3 = 1084,44 EUR.
Trampa: Olvidar restar la comisión o los gastos.
Visual: none
Dificultad: Avanzada 


`;

export const SEEDS_6TO_FINAL = `
PATRÓN 6-F1 (Combinatoria básica):
Ejemplo 1: "Víctor tiene 5 canicas diferentes. ¿De cuántas maneras puede dar 2 a su hermano?"
Ejemplo 2: "En una heladería hay 8 sabores. ¿De cuántas formas se puede elegir un cono de 3 sabores?"
Ejemplo 3: "Un club tiene 10 miembros. ¿Cuántas comités de 4 personas se pueden formar?"
Lógica: Combinaciones C(n, k).
Trampa: Usar permutaciones en lugar de combinaciones.
Visual: none
Dificultad: Intermedia

PATRÓN 6-F2 (Geometría 3D - volúmenes):
Ejemplo 1: "Cubo de arista 6 cm lleno de agua. Verter en prisma de base cuadrada 4×4 cm. ¿Qué altura debe tener el prisma?"
Ejemplo 2: "Una caja de zapatos mide 30 cm × 20 cm × 15 cm. ¿Cuál es su volumen en litros?"
Ejemplo 3: "Un cilindro de radio 5 cm y altura 10 cm. ¿Cuál es su volumen?"
Lógica: Volumen de cubo, prisma, cilindro.
Trampa: Confundir unidades (cm³ vs litros).
Visual: geometry_3d
Dificultad: Intermedia

PATRÓN 6-F3 (Probabilidad compuesta):
Ejemplo 1: "Se lanza un dado de 12 caras. Probabilidad de múltiplo de 3: 4/12 = 1/3"
Ejemplo 2: "Se lanzan dos dados. ¿Probabilidad de que la suma sea 8?"
Ejemplo 3: "En una bolsa hay 3 rojas, 2 azules y 5 verdes. Se saca una al azar. ¿Probabilidad de que no sea azul?"
Lógica: Casos favorables / totales.
Trampa: No contar correctamente los casos.
Visual: none
Dificultad: Intermedia

PATRÓN 6-F4 (Álgebra básica):
Ejemplo 1: "Si x + 1/x = 3, hallar x² + 1/x²"
Ejemplo 2: "Si a + b = 5 y ab = 6, halla a² + b²"
Ejemplo 3: "Si x - 1/x = 2, halla x² + 1/x²"
Lógica: Usar identidades algebraicas.
Trampa: No recordar la fórmula.
Visual: none
Dificultad: Avanzada

PATRÓN 6-F5 (Caja sin tapa):
Ejemplo 1: "De una cartulina de 28 cm × 24 cm se cortan cuadrados de x cm en las esquinas. Si se dobla para formar una caja sin tapa de volumen 1280 cm³, halla x."
Ejemplo 2: "Una hoja de 30 cm × 20 cm se cortan cuadrados en las esquinas para hacer una caja sin tapa de volumen 1000 cm³. Halla el lado del cuadrado."
Ejemplo 3: "Con una cartulina de 40 cm × 30 cm se construye una caja sin tapa cortando cuadrados de lado x. El volumen resultante es 2400 cm³. Halla x."
Lógica: (largo-2x)(ancho-2x)x = volumen, resolver ecuación.
Trampa: No considerar que x debe ser positivo y menor que la mitad del lado menor.
Visual: net_box
Dificultad: Avanzada

PATRÓN 6-F6 (Cadena de eslabones):
Ejemplo 1: "Se tiene una cadena formada por 5 eslabones idénticos. Cada eslabón mide 2 cm de largo y 3 cm de ancho. Calcula la longitud total."
Ejemplo 2: "Una cadena de 8 eslabones tiene cada eslabón de 1,5 cm de largo y 2 cm de ancho. Halla su longitud total."
Ejemplo 3: "Si la longitud total de una cadena de n eslabones es 22 cm, y cada eslabón mide 2 cm de largo y 3 cm de ancho, halla n."
Lógica: Longitud = n*largo + (n-1)*ancho? En realidad en los problemas de CONAMAT, la longitud total es n*largo + (n-1)*ancho (por el solapamiento). Ajustar según el problema real.
Trampa: No considerar el solapamiento.
Visual: chain_links
Dificultad: Intermedia
`;

// Función helper para recuperar semillas
export const getSeeds = (grade: string, stage: string) => {
  if (grade === '3ro' && stage === 'clasificatoria')
    return SEEDS_3RO_CLASIFICATORIA;
  if (grade === '3ro' && stage === 'final') return SEEDS_3RO_FINAL;
  if (grade === '4to' && stage === 'clasificatoria')
    return SEEDS_4TO_CLASIFICATORIA;
  if (grade === '4to' && stage === 'final') return SEEDS_4TO_FINAL;
  if (grade === '5to' && stage === 'clasificatoria')
    return SEEDS_5TO_CLASIFICATORIA;
  if (grade === '5to' && stage === 'final') return SEEDS_5TO_FINAL;
  if (grade === '6to' && stage === 'clasificatoria')
    return SEEDS_6TO_CLASIFICATORIA;
  if (grade === '6to' && stage === 'final') return SEEDS_6TO_FINAL;
  return 'Genera un problema matemático estándar, variado y creativo.';
};
