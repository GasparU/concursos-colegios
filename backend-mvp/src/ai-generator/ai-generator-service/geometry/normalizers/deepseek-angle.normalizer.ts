// src/ai-generator/ai-generator-service/geometry/normalizers/deepseek-angle.normalizer.ts

export function normalizeConsecutiveAngles(
  mathData: any,
  visualData?: any,
): any {
  // 1. Si no hay mathData, buscar dentro de visualData
  if (!mathData && visualData?.math_data) {
    mathData = visualData.math_data;
  }
  if (!mathData) return null;

  // 2. Si ya es el formato correcto, devolverlo
  if (mathData.type === 'consecutive_angles' && mathData.params?.rays) {
    return mathData;
  }

  // 3. Detectar formato antiguo de DeepSeek
  //    Puede ser type: 'geometry' o 'angle_consecutive' con campos angle_*
  const params = mathData.params || {};
  const hasAngleFields = Object.keys(params).some((key) =>
    key.startsWith('angle_'),
  );

  if (hasAngleFields) {
    console.log(
      '🔄 [Normalizador] Detectado formato antiguo de DeepSeek (con angle_*). Transformando...',
    );

    const xValue = params.x_value || 0;
    const rayos: any[] = [];

    // Mapeo de nombres de ángulos a etiquetas de puntos (punto final del rayo)
    const angleToPoints: Record<string, { p1: string; p2: string }> = {
      angle_AOB: { p1: 'A', p2: 'B' },
      angle_BOC: { p1: 'B', p2: 'C' },
      angle_COD: { p1: 'C', p2: 'D' },
      angle_DOE: { p1: 'D', p2: 'E' },
    };

    // Recorrer todas las propiedades que empiecen con 'angle_'
    for (const [key, value] of Object.entries(params)) {
      if (key.startsWith('angle_') && typeof value === 'number') {
        const points = angleToPoints[key];
        if (!points) continue; // Si no está en el mapeo, ignorar

        // Intentar obtener la expresión desde un campo paralelo (si existe)
        // DeepSeek a veces manda angle_AOB_label, pero no siempre
        const labelKey = key + '_label';
        let expression = params[labelKey] || `${value}°`; // fallback

        // Calcular coef y const aproximados usando xValue
        let coef = 1,
          constVal = 0;
        if (xValue !== 0) {
          // Redondear para evitar decimales no deseados
          coef = Math.round(value / xValue);
          constVal = value - coef * xValue;
          // Si el coeficiente es 0, asumir 1 y ajustar constante
          if (coef === 0) {
            coef = 1;
            constVal = value - xValue;
          }
        }

        rayos.push({
          pointLabel: points.p2, // La letra del punto final (B, C, D...)
          angleLabel: expression,
          coef,
          const: constVal,
          value, // valor numérico real
        });
      }
    }

    if (rayos.length === 0) {
      console.warn('⚠️ [Normalizador] No se encontraron rayos válidos');
      return null;
    }

    // Construir el objeto normalizado
    return {
      type: 'consecutive_angles',
      params: {
        x_value: xValue,
        vertex: { label: 'O' },
        rays: rayos,
        total_label: params.total_angle ? `${params.total_angle}°` : undefined,
      },
    };
  }

  // 4. Si no se detectó nada, devolver null
  return null;
}
