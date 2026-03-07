/**
 * Calcula el ángulo en grados entre dos vectores dados por puntos A, B y C, con vértice en B.
 */
export function calcularAngulo(
  A: [number, number],
  B: [number, number],
  C: [number, number],
): number {
  const BAx = A[0] - B[0];
  const BAy = A[1] - B[1];
  const BCx = C[0] - B[0];
  const BCy = C[1] - B[1];

  const dot = BAx * BCx + BAy * BCy;
  const magBA = Math.hypot(BAx, BAy);
  const magBC = Math.hypot(BCx, BCy);

  if (magBA === 0 || magBC === 0) return 0;

  const cosAng = dot / (magBA * magBC);
  const angRad = Math.acos(Math.max(-1, Math.min(1, cosAng)));
  return (angRad * 180) / Math.PI;
}

/**
 * Dados dos vectores desde un vértice, determina el ángulo de inicio y fin para un arco
 * que cubra el ángulo entre ellos, en sentido antihorario.
 */
export function obtenerAngulosArco(
  desde: [number, number],
  vertice: [number, number],
  hasta: [number, number],
): { inicio: number; fin: number } {
  const v1x = desde[0] - vertice[0];
  const v1y = desde[1] - vertice[1];
  const v2x = hasta[0] - vertice[0];
  const v2y = hasta[1] - vertice[1];

  let ang1 = (Math.atan2(v1y, v1x) * 180) / Math.PI;
  let ang2 = (Math.atan2(v2y, v2x) * 180) / Math.PI;

  ang1 = (ang1 + 360) % 360;
  ang2 = (ang2 + 360) % 360;

  if (ang2 < ang1) ang2 += 360;

  return { inicio: ang1, fin: ang2 };
}
