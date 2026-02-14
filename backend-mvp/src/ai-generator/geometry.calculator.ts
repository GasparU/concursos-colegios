export function calculateGeometryTotal(mathData: any): number | null {
    if (!mathData || !mathData.params) return null;
    const { type, params } = mathData;

    // =========================================================================
    // 🛡️ HELPER BLINDADO: PARSEADOR DE NÚMEROS
    // Convierte cualquier basura (string, undefined, null) en número o 0
    // =========================================================================
    const parseNum = (val: any): number => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
            const clean = val.replace(/[^0-9.-]/g, ''); // Quita letras si las hay
            const parsed = parseFloat(clean);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    // 1. Detectar si hay variable X definida
    let x_value = 0;
    let hasX = false;

    if (params.x_value !== undefined && params.x_value !== null) {
        x_value = parseNum(params.x_value);
        hasX = true;
    }

    // 2. Helper para evaluar expresiones lineales (mx + b)
    // Soporta: { coef: 3, const: 5 } -> 3x + 5
    // Soporta: { value: 20 } -> 20
    const evalExpr = (item: any) => {
        // Prioridad 1: Valor directo numérico
        if (item.value !== undefined) return parseNum(item.value);
        if (item.angle !== undefined) return parseNum(item.angle);
        if (typeof item === 'number') return item;

        // Prioridad 2: Expresión con X
        const coef = parseNum(item.coef);
        const constant = parseNum(item.const);

        if (hasX) {
            return (coef * x_value) + constant;
        }

        // Fallback: Si no hay X, devolvemos la constante
        return constant;
    };

    try {
        // =====================================================================
        // 1. SEGMENTOS COLINEALES (Suma de longitudes)
        // =====================================================================
        if (type === 'collinear_segments' && Array.isArray(params.segments)) {
            let total = 0;
            params.segments.forEach((seg: any) => total += evalExpr(seg));
            return parseFloat(total.toFixed(2));
        }

        // =====================================================================
        // 2 & 4. ÁNGULOS CONSECUTIVOS / ALREDEDOR DE UN PUNTO
        // =====================================================================
        if (type === 'consecutive_angles' && Array.isArray(params.rays)) {
          let total = 0;
          params.rays.forEach((ray: any, index: number) => {
            // 🔥 AÑADIR index AQUÍ
            const val = evalExpr(ray);
            total += val;

            // 🔥 Usar 'index' en lugar de 'i'
            console.log(
              `🧮 [CALC] Rayo ${index}: coef=${ray.coef}, const=${ray.const}, x=${x_value}, evalExpr=${val}`,
            );
          });
          return parseFloat(total.toFixed(2));
        }

        // =====================================================================
        // 3 & 12. POLÍGONOS REGULARES (Perímetro)
        // =====================================================================
        if (type === 'polygon_regular') {
            const sides = parseNum(params.sides) || 3;
            let sideLength = 0;

            if (params.side_length) {
                sideLength = parseNum(params.side_length);
            } else if (params.side_expression && hasX) {
                sideLength = evalExpr(params.side_expression);
            }

            return parseFloat((sideLength * sides).toFixed(2));
        }

        // =====================================================================
        // 2 (Variante). SÓLIDOS SIMPLES (Cubo y Prisma) - VOLUMEN
        // =====================================================================
        if (type === 'solid_cube') {
            const s = parseNum(params.side);
            return parseFloat((s * s * s).toFixed(2));
        }
        if (type === 'solid_prism') {
            const w = parseNum(params.width);
            const h = parseNum(params.height);
            const d = parseNum(params.depth || params.length); // A veces es length
            return parseFloat((w * h * d).toFixed(2));
        }

        // =====================================================================
        // 5. CÍRCULO DIVIDIDO EN SECTORES (Suma de ángulos)
        // =====================================================================
        if (type === 'circle_sectors' && Array.isArray(params.sector_labels)) {
            let total = 0;
            params.sector_labels.forEach((sector: any) => {
                total += evalExpr(sector);
            });
            return parseFloat(total.toFixed(2));
        }

        // =====================================================================
        // 6. ARCO Y ÁNGULO CENTRAL (Longitud de arco o Medida)
        // =====================================================================
        if (type === 'circle_arc_angle') {
            if (params.arc_expression && hasX) {
                return evalExpr(params.arc_expression);
            }
            return parseNum(params.arc_measure || params.angle_value);
        }

        // =====================================================================
        // 7. RECTAS PARALELAS Y BISECTRICES
        // (Aquí es difícil definir un "Total", pero si hay ángulos relevantes los sumamos)
        // =====================================================================
        if (type === 'parallel_lines_bisector') {
            // Si la IA manda una lista de ángulos para sumar (ej: propiedad de la M)
            if (Array.isArray(params.relevant_angles)) {
                let total = 0;
                params.relevant_angles.forEach((ang: any) => total += evalExpr(ang));
                return parseFloat(total.toFixed(2));
            }
            // Si no, devolvemos null para que la IA maneje el texto
            return null;
        }

        // =====================================================================
        // 8. CUADRADOS COMPUESTOS (Suma de Áreas)
        // =====================================================================
        if (type === 'composite_squares' && Array.isArray(params.squares)) {
            let totalArea = 0;
            params.squares.forEach((sq: any) => {
                const s = sq.side_expression ? evalExpr(sq.side_expression) : parseNum(sq.side);
                totalArea += s * s;
            });
            return parseFloat(totalArea.toFixed(2));
        }

        // =====================================================================
        // 9. RED DE CAJA (NET BOX) - Área útil del material
        // Fórmula: (Ancho * Alto) - 4 * (corte^2)
        // =====================================================================
        if (type === 'net_box' && params.net_dimensions) {
            const w = parseNum(params.net_dimensions.width);
            const h = parseNum(params.net_dimensions.height);
            const cut = parseNum(params.net_dimensions.cut_square_side);

            const area = (w * h) - (4 * (cut * cut));
            return parseFloat(area.toFixed(2));
        }

        // =====================================================================
        // 10. CADENA DE ESLABONES (Longitud Total)
        // Fórmula: n*L - (n-1)*overlap
        // Overlap (solapamiento) suele ser 2 * grosor
        // =====================================================================
        if (type === 'chain_links') {
            const n = parseNum(params.num_links);
            const L = parseNum(params.link_length);
            const w = parseNum(params.link_width);

            const overlap = 2 * w;
            // Si hay 1 eslabón, no hay overlap. Si hay n, hay n-1 overlaps.
            const totalLen = (n * L) - ((n - 1) * overlap);

            return parseFloat(totalLen.toFixed(2));
        }

        // =====================================================================
        // 11. SÓLIDO COMPUESTO 3D (Suma de Volúmenes)
        // =====================================================================
        if (type === 'composite_3d_solid' && Array.isArray(params.solid_parts)) {
            let totalVol = 0;
            params.solid_parts.forEach((part: any) => {
                const dim = part.dimensions || {};

                if (part.shape === 'cube') {
                    const s = parseNum(dim.side);
                    totalVol += s * s * s;
                }
                else if (part.shape === 'prism') {
                    const l = parseNum(dim.length);
                    const w = parseNum(dim.width);
                    const h = parseNum(dim.height);
                    totalVol += l * w * h;
                }
            });
            return parseFloat(totalVol.toFixed(2));
        }

    } catch (e) {
        console.error("⚠️ [GeometryCalculator] Error crítico de cálculo:", e);
        return null;
    }

    return null;
}