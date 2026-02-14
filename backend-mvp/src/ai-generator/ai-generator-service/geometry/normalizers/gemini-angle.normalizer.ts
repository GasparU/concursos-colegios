// src/ai-generator/ai-generator-service/geometry/normalizers/gemini-angle.normalizer.ts

export function normalizeGeminiAngles(mathData: any): any {
  if (!mathData) return null;

  // Si ya tiene el formato correcto, lo devolvemos
  if (mathData.type === 'consecutive_angles' && mathData.params?.rays) {
    return mathData;
  }

  // Si no, registramos el formato inesperado para depuración
  console.warn(
    '⚠️ [GeminiNormalizer] Formato no reconocido:',
    JSON.stringify(mathData, null, 2),
  );
  return null;
}
