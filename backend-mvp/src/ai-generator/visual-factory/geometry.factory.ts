// src/ai-generator/visual-factory/geometry.factory.ts

function evaluateExpression(coef: number, constant: number, xValue: number): number {
    return (coef * xValue) + constant;
}

/**
 * Genera coordenadas para segmentos colineales perfectos.
 * @param params Objeto con longitudes reales { "AB": 10, "BC": 5, "etiquetas": { "AB": "2x", "BC": "5" } }
 */
export function buildCollinearVisual(params: any) {
    if (!params || !params.segments) return null;

    const { x_value, segments } = params;
    const elements: any[] = [];
    const measures: any[] = [];

    let currentX = 0;
    let totalLength = 0;

    // Punto inicial A
    elements.push({ type: "point", coords: [0, 0], label: segments[0]?.name?.[0] || "A" });
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    segments.forEach((seg: any, index: number) => {
        let segmentLength = seg.value;

        if (x_value !== undefined && seg.coef !== undefined) {
            segmentLength = evaluateExpression(seg.coef, seg.const || 0, x_value);
        }

        // Protección visual mínima
        if (!segmentLength || segmentLength <= 0) segmentLength = 1;

        const startX = currentX;
        currentX += segmentLength
        totalLength += segmentLength;

        const labelPunto = seg.name?.[1] || letters[index + 1] || "";
        elements.push({ type: "point", coords: [currentX, 0], label: labelPunto });

        // Medida (Arco verde arriba)
        measures.push({
            from: [startX, 0],
            to: [currentX, 0],
            label: seg.label,
            offset: 1.0 + (index % 2) * 0.5
        });
    });

    // Línea base completa
    elements.push({ type: "segment", points: [[0, 0], [currentX, 0]] });

    const finalTotalLabel = params.total_label || totalLength.toString();

    measures.push({
        from: [0, 0],
        to: [currentX, 0],
        label: finalTotalLabel,
        offset: -1.0
    });

    return {
        type: "geometry_mafs",
        theme: "collinear_segments",
        elements,
        measures
    };
}

/**
 * Genera un Cubo en proyección caballera (3D Vectorizado)
 */
export function buildCubeVisual(params: any) {
    if (!params) return null;
    const side = params.side || 4;
    const label = params.label || "L";

    const x = 0, y = 0;
    const depth = side * 0.5;
    const angle = Math.PI / 6; // 30 grados
    const dx = depth * Math.cos(angle);
    const dy = depth * Math.sin(angle);

    // Coordenadas Frontales
    const A = [x, y];
    const B = [x + side, y];
    const C = [x + side, y + side];
    const D = [x, y + side];
    // Coordenadas Traseras
    const A_ = [x + dx, y + dy];
    const B_ = [x + side + dx, y + dy];
    const C_ = [x + side + dx, y + side + dy];
    const D_ = [x + dx, y + side + dy];

    return {
        type: "geometry_mafs",
        theme: "solid_cube",
        elements: [
            // Cara Frontal (Sólida)
            { type: "polygon", points: [A, B, C, D], color: "blue", filled: false },
            // Aristas de profundidad
            { type: "segment", points: [B, B_] },
            { type: "segment", points: [C, C_] },
            { type: "segment", points: [D, D_] },
            // Cara Trasera (Visible parcial)
            { type: "segment", points: [B_, C_] },
            { type: "segment", points: [C_, D_] },
            // Líneas ocultas (Punteadas - Simulado con opacidad o estilo si Mafs lo permite, sino solido por ahora)
            { type: "segment", points: [A, A_], style: "dashed" },
            { type: "segment", points: [A_, B_], style: "dashed" },
            { type: "segment", points: [A_, D_], style: "dashed" }
        ],
        measures: [
            { from: A, to: B, label: label, offset: -0.5 }
        ]
    };
}


export function buildConsecutiveAnglesVisual(params: any) {
    if (!params || !params.rays) return null;

    const { x_value, rays, vertex } = params;
    const vertexLabel = vertex?.label || "O";

    // Coordenada fija
    const O: [number, number] = [0, 0];
    const RADIUS = 4;

    let currentAngle = 0; // Empezamos en 0 grados (Horizontal derecha)
    // Si prefieres empezar arriba como tenías antes: let currentAngle = -Math.PI / 2;

    const elements: any[] = [];

    // Vértice
    elements.push({ type: "point", coords: O, label: vertexLabel });

    // Primer rayo base
    // Calculamos el punto final del primer rayo (horizontal)
    const firstX = O[0] + RADIUS * Math.cos(currentAngle);
    const firstY = O[1] + RADIUS * Math.sin(currentAngle);

    // Si rays[0] tiene etiqueta de punto (ej: "A"), la usamos
    const firstLabel = rays[0]?.pointLabel || "A";
    elements.push({ type: "point", coords: [firstX, firstY], label: firstLabel });
    elements.push({ type: "segment", points: [O, [firstX, firstY]], color: "#a0a0a0" });

    // Iteramos rayos (empezando desde el segundo punto, ya que el primero es la base)
    // OJO: Tu lógica anterior iteraba rays para crear el SIGUIENTE rayo. Mantenemos eso.

    rays.forEach((ray: any, index: number) => {
        // 🔥 CÁLCULO HÍBRIDO
        let angleValue = ray.value;
        if (x_value !== undefined && ray.coef !== undefined) {
            angleValue = evaluateExpression(ray.coef, ray.const || 0, x_value);
        }
        if (!angleValue || angleValue <= 0) angleValue = 15; // Protección

        const angleRad = (angleValue * Math.PI) / 180;
        const nextAngle = currentAngle + angleRad; // Antihorario (mafs usa coord normales)
        // Nota: Si quieres sentido horario, sería - angleRad.

        // Coordenada del siguiente rayo
        const endX = O[0] + RADIUS * Math.cos(nextAngle);
        const endY = O[1] + RADIUS * Math.sin(nextAngle);

        // El punto final de este ángulo es el inicio del siguiente
        // Usamos index+1 para la etiqueta (B, C...) si asumimos A es el base
        const label = ray.pointLabel || String.fromCharCode(66 + index); // B, C...

        elements.push({ type: "point", coords: [endX, endY], label });
        elements.push({ type: "segment", points: [O, [endX, endY]], color: "#a0a0a0" });

        // Arco de ángulo
        elements.push({
            type: "angle",
            coords: O, // Centro del arco
            // Mafs angle necesita start/end en radianes o puntos.
            // Tu renderer usa 'points' [A, O, B].
            // Para ser compatible con tu renderer actual, mandamos 3 puntos:
            // [PuntoAnterior, Centro, PuntoNuevo]
            points: [
                [O[0] + RADIUS * Math.cos(currentAngle), O[1] + RADIUS * Math.sin(currentAngle)],
                O,
                [endX, endY]
            ],
            label: ray.angleLabel || ray.label || `${angleValue}°`,
            value: angleValue
        });

        currentAngle = nextAngle;
    });

    // Ángulo Total (Opcional)
    if (params.total_label) {
        // Puntos inicio y fin total
        const startP = [O[0] + RADIUS, O[1]]; // Base 0 grados
        const endP = [O[0] + RADIUS * Math.cos(currentAngle), O[1] + RADIUS * Math.sin(currentAngle)];

        elements.push({
            type: "angle",
            points: [startP, O, endP],
            label: params.total_label,
            style: "dashed",
            color: "#16a34a",
            radius: 2.5 // Más afuera
        });
    }

    return {
        type: "geometry_mafs",
        theme: "consecutive_angles",
        elements,
        measures: []
    };
}

// ============================================================================
// 1. CÍRCULO DIVIDIDO EN SECTORES (PIZZA)
// ============================================================================
export function buildCircleSectorsVisual(params: any) {
    if (!params || !params.sector_labels) return null;

    const { radius = 4, sector_labels, show_radii = true, total_angle = 360 } = params;
    const center: [number, number] = [0, 0];
    const elements: any[] = [];
    const measures: any[] = [];

    // Punto central
    elements.push({ type: "point", coords: center, label: "O" });

    let currentAngle = 0; // grados, empezamos a las 3:00 (eje X positivo)
    const angles: number[] = [];

    sector_labels.forEach((sec: any, idx: number) => {
        const angleDeg = sec.angle;
        const angleRad = (currentAngle * Math.PI) / 180;
        const endAngleRad = ((currentAngle + angleDeg) * Math.PI) / 180;

        // Puntos en la circunferencia para marcar radios
        const x1 = center[0] + radius * Math.cos(angleRad);
        const y1 = center[1] + radius * Math.sin(angleRad);
        const x2 = center[0] + radius * Math.cos(endAngleRad);
        const y2 = center[1] + radius * Math.sin(endAngleRad);

        const p1: [number, number] = [x1, y1];
        const p2: [number, number] = [x2, y2];

        if (idx === 0) {
            // primer punto del sector (A)
            elements.push({ type: "point", coords: p1, label: `A${idx + 1}` });
        }
        elements.push({ type: "point", coords: p2, label: `A${idx + 2}` });

        if (show_radii) {
            elements.push({ type: "segment", points: [center, p1], style: "solid", color: "#888", weight: 1 });
            elements.push({ type: "segment", points: [center, p2], style: "solid", color: "#888", weight: 1 });
        }

        // Sector (polígono) – relleno transparente para visualizar división
        const sectorPoints = [center, p1, p2];
        elements.push({
            type: "polygon",
            points: sectorPoints,
            color: sec.color || "#94a3b8",
            filled: true,
            fillOpacity: 0.15
        });

        // Etiqueta del ángulo dentro del sector
        const midAngleRad = ((currentAngle + angleDeg / 2) * Math.PI) / 180;
        const labelX = center[0] + (radius * 0.6) * Math.cos(midAngleRad);
        const labelY = center[1] + (radius * 0.6) * Math.sin(midAngleRad);
        elements.push({
            type: "label",
            coords: [labelX, labelY],
            text: sec.label || `${angleDeg}°`,
            isLatex: false
        });

        currentAngle += angleDeg;
        angles.push(currentAngle);
    });

    // Circunferencia exterior
    elements.push({
        type: "circle",
        center: center,
        radius: radius,
        color: "#1e293b",
        weight: 2
    });

    return {
        type: "geometry_mafs",
        theme: "circle_sectors",
        elements,
        measures
    };
}

// ============================================================================
// 2. CIRCUNFERENCIA CON ARCO Y ÁNGULO CENTRAL/INSCRITO
// ============================================================================
export function buildCircleArcAngleVisual(params: any) {
    if (!params) return null;

    const {
        center = { label: "O" },
        points = ["A", "B"],
        arc_measure = 86,
        angle_value = 52,
        show_arc = true,
        radius = 4
    } = params;

    const O: [number, number] = [0, 0];
    const elements: any[] = [];

    elements.push({ type: "point", coords: O, label: center.label });

    // Colocamos los puntos A y B en la circunferencia
    // Para arco de 86°, colocamos A en 0° y B en 86°
    const angleARad = 0;
    const angleBRad = (arc_measure * Math.PI) / 180;

    const A: [number, number] = [O[0] + radius * Math.cos(angleARad), O[1] + radius * Math.sin(angleARad)];
    const B: [number, number] = [O[0] + radius * Math.cos(angleBRad), O[1] + radius * Math.sin(angleBRad)];

    elements.push({ type: "point", coords: A, label: points[0] });
    elements.push({ type: "point", coords: B, label: points[1] });

    // Radio OA y OB
    elements.push({ type: "segment", points: [O, A], style: "solid", color: "#888", weight: 1 });
    elements.push({ type: "segment", points: [O, B], style: "solid", color: "#888", weight: 1 });

    // Circunferencia
    elements.push({ type: "circle", center: O, radius, color: "#1e293b", weight: 2 });

    // Arco (usamos element type "arc" que deberemos soportar en el renderizador)
    // Por simplicidad, usaremos un polígono curvo con muchos puntos (polyline)
    if (show_arc) {
        elements.push({
            type: "arc",
            center: O,
            radius: radius + 0.3, // ligeramente exterior
            startAngle: angleARad,
            endAngle: angleBRad,
            color: "#f59e0b",
            weight: 3,
            label: `${arc_measure}°`
        });
    }

    // Si hay un ángulo x (52°), podemos dibujarlo como arco menor
    if (angle_value) {
        // colocamos un punto C para el vértice? Podría ser inscrito. Para simplificar,
        // dibujamos otro arco con etiqueta x.
        elements.push({
            type: "arc",
            center: O,
            radius: radius + 0.6,
            startAngle: angleARad,
            endAngle: (angle_value * Math.PI) / 180,
            color: "#16a34a",
            weight: 2,
            label: `x = ${angle_value}°`
        });
    }

    return {
        type: "geometry_mafs",
        theme: "circle_arc_angle",
        elements,
        measures: []
    };
}

// ============================================================================
// 3. RECTAS PARALELAS Y BISECTRICES
// ============================================================================
export function buildParallelLinesBisectorVisual(params: any) {
    if (!params || !params.lines) return null;

    const elements: any[] = [];
    const { lines, bisector, parallel_markers = true } = params;

    // Dibujar líneas paralelas (horizontales o verticales)
    lines.forEach((line: any) => {
        const { label, direction, offset, arrow = false } = line;
        let p1, p2;
        if (direction === "horizontal") {
            p1 = [-5, offset];
            p2 = [5, offset];
        } else {
            p1 = [offset, -5];
            p2 = [offset, 5];
        }
        elements.push({
            type: "segment",
            points: [p1, p2],
            style: "solid",
            color: "#1e293b",
            weight: 2
        });
        // Etiqueta de la línea (P, Q, etc.)
        elements.push({
            type: "label",
            coords: [p2[0] - 0.5, p2[1] + 0.3],
            text: label
        });
        if (arrow) {
            // marcar dirección? lo obviamos por simplicidad
        }
    });

    // Marcas de paralelismo (flechas en el medio)
    if (parallel_markers) {
        // pequeñas marcas > en cada línea
        lines.forEach((line: any) => {
            const { direction, offset } = line;
            if (direction === "horizontal") {
                elements.push({
                    type: "label",
                    coords: [-1, offset],
                    text: ">",
                    isLatex: false,
                    color: "#475569"
                });
            } else {
                elements.push({
                    type: "label",
                    coords: [offset, -1],
                    text: ">",
                    isLatex: false,
                    color: "#475569"
                });
            }
        });
    }

    // Bisectriz: necesita vértice y las dos líneas que forman el ángulo
    if (bisector) {
        const { vertex, lines: lineNames, angle_label, angle_value } = bisector;
        // Asumimos que el vértice es un punto de intersección entre dos rectas
        // Hardcodeamos para problema típico: triángulo con bisectrices
        // Ejemplo: vértice B, líneas AB y BC, o BD y DC.
        // Vamos a dibujar un triángulo ABC con base horizontal y vértice arriba
        const A: [number, number] = [-3, 0];
        const B: [number, number] = [0, 4];
        const C: [number, number] = [3, 0];
        elements.push({ type: "point", coords: A, label: "A" });
        elements.push({ type: "point", coords: B, label: "B" });
        elements.push({ type: "point", coords: C, label: "C" });
        elements.push({ type: "segment", points: [A, B], color: "#1e293b", weight: 2 });
        elements.push({ type: "segment", points: [B, C], color: "#1e293b", weight: 2 });
        elements.push({ type: "segment", points: [A, C], color: "#1e293b", weight: 2 });

        // Bisectriz desde B (punto interior)
        // Calculamos punto D sobre AC (punto medio? No, es bisectriz real)
        // Para primaria podemos poner un punto D en AC con etiqueta
        const D: [number, number] = [0, 0]; // punto medio de AC
        elements.push({ type: "point", coords: D, label: "D" });
        elements.push({ type: "segment", points: [B, D], style: "dashed", color: "#f59e0b", weight: 2 });

        if (angle_label) {
            elements.push({
                type: "angle",
                points: [A, B, D],
                label: angle_label
            });
            elements.push({
                type: "angle",
                points: [D, B, C],
                label: angle_label
            });
        }
    }

    return {
        type: "geometry_mafs",
        theme: "parallel_lines_bisector",
        elements,
        measures: []
    };
}

// ============================================================================
// 4. CUADRADOS COMPUESTOS (ABCD, EFGH, IJKL)
// ============================================================================
export function buildCompositeSquaresVisual(params: any) {
    if (!params || !params.squares) return null;

    const { squares, shaded_region } = params;
    const elements: any[] = [];

    // Dibujar cada cuadrado
    squares.forEach((sq: any) => {
        const { label, side, position, color = "#94a3b8", filled = false } = sq;
        const [x0, y0] = [position.x, position.y];
        const x1 = x0 + side;
        const y1 = y0 + side;

        // Puntos
        elements.push({ type: "point", coords: [x0, y0], label: label[0] });
        elements.push({ type: "point", coords: [x1, y0], label: label[1] });
        elements.push({ type: "point", coords: [x1, y1], label: label[2] });
        elements.push({ type: "point", coords: [x0, y1], label: label[3] });

        // Lados
        elements.push({ type: "segment", points: [[x0, y0], [x1, y0]], color: "#1e293b", weight: 2 });
        elements.push({ type: "segment", points: [[x1, y0], [x1, y1]], color: "#1e293b", weight: 2 });
        elements.push({ type: "segment", points: [[x1, y1], [x0, y1]], color: "#1e293b", weight: 2 });
        elements.push({ type: "segment", points: [[x0, y1], [x0, y0]], color: "#1e293b", weight: 2 });

        if (filled) {
            elements.push({
                type: "polygon",
                points: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]],
                color: color,
                filled: true,
                fillOpacity: 0.2
            });
        }
    });

    // Región sombreada (puede ser un polígono o la diferencia entre dos cuadrados)
    if (shaded_region) {
        if (shaded_region.type === "polygon" && shaded_region.points) {
            elements.push({
                type: "polygon",
                points: shaded_region.points,
                color: shaded_region.color || "#fbbf24",
                filled: true,
                fillOpacity: 0.5
            });
        } else if (shaded_region.type === "difference") {
            // Para el ejemplo de cuadrados concéntricos: sombra entre cuadrado exterior e interior
            // Asumimos que squares[0] es exterior, squares[1] interior
            if (squares.length >= 2) {
                const outer = squares[0];
                const inner = squares[1];
                const ox0 = outer.position.x, oy0 = outer.position.y, os = outer.side;
                const ix0 = inner.position.x, iy0 = inner.position.y, is = inner.side;
                // Dibujamos la región sombreada como 4 polígonos (arriba, abajo, izquierda, derecha)
                // ... simplificamos: dibujamos un polígono que es el exterior menos el interior
                // (No implementamos diferencias complejas; para el ejemplo concreto usamos un solo polígono)
                // Aquí hacemos un rectángulo que representa la región entre cuadrado exterior e interior
                // pero es más fácil si la IA manda los puntos del polígono sombreado directamente.
                // Para el ejemplo, solo dibujaremos un rectángulo superior
                elements.push({
                    type: "polygon",
                    points: [[ox0, oy0 + is], [ox0 + os, oy0 + is], [ox0 + os, oy0 + os], [ox0, oy0 + os]],
                    color: "#fbbf24",
                    filled: true,
                    fillOpacity: 0.5
                });
            }
        }
    }

    return {
        type: "geometry_mafs",
        theme: "composite_squares",
        elements,
        measures: []
    };
}


// ============================================================================
// 5. RED DE CAJA SIN TAPA (CARTÓN CON ESQUINAS CORTADAS)
// ============================================================================
export function buildNetBoxVisual(params: any) {
    if (!params || !params.net_dimensions) return null;

    const { width, height, cut_square_side } = params.net_dimensions;
    const cut = cut_square_side;
    // Representación 2D de la red: un rectángulo grande con cuatro cuadrados recortados en las esquinas
    const elements: any[] = [];

    // Dibujamos el contorno exterior
    const outer: [number, number][] = [
        [0, 0],
        [width, 0],
        [width, height],
        [0, height]
    ];
    elements.push({
        type: "polygon",
        points: outer,
        color: "#1e293b",
        filled: false,
        weight: 2
    });

    // Dibujar los cortes cuadrados en cada esquina (líneas discontinuas o pequeñas marcas)
    const corners: [number, number][][] = [
        [[0, 0], [cut, 0], [cut, cut], [0, cut]],
        [[width - cut, 0], [width, 0], [width, cut], [width - cut, cut]],
        [[width - cut, height - cut], [width, height - cut], [width, height], [width - cut, height]],
        [[0, height - cut], [cut, height - cut], [cut, height], [0, height]]
    ];

    corners.forEach((corner) => {
        elements.push({
            type: "polygon",
            points: corner,
            color: "#ef4444",
            filled: false,
            style: "dashed",
            weight: 1.5
        });
    });

    // Etiquetas de dimensiones
    elements.push({
        type: "measure",
        from: [0, -0.5],
        to: [width, -0.5],
        label: `${width} u`,
        offset: -1.0
    });
    elements.push({
        type: "measure",
        from: [-0.5, 0],
        to: [-0.5, height],
        label: `${height} u`,
        offset: -1.0
    });
    elements.push({
        type: "measure",
        from: [0, cut - 0.3],
        to: [cut, cut - 0.3],
        label: `${cut} u`,
        offset: -0.8
    });

    return {
        type: "geometry_mafs",
        theme: "net_box",
        elements,
        measures: []
    };
}

// ============================================================================
// 6. CADENA DE ESLABONES
// ============================================================================
export function buildChainLinksVisual(params: any) {
    if (!params || !params.link_length || !params.link_width || !params.num_links) return null;

    const { link_length, link_width, num_links, total_length_label } = params;
    const elements: any[] = [];

    // Cada eslabón: un rectángulo redondeado o dos semicírculos unidos.
    // Para simplicidad, dibujamos un rectángulo con extremos redondeados (ovalos)
    // Usaremos polígonos que simulan un eslabón de cadena:
    // Forma: rectángulo de ancho = link_width, largo = link_length, con semicírculos en los extremos.
    // Pero Mafs no tiene primitivas de arco fácil, así que dibujaremos un rectángulo con bordes redondeados
    // mediante un polígono aproximado.
    const linkSpacing = link_length * 0.8; // superposición entre eslabones

    for (let i = 0; i < num_links; i++) {
        const cx = i * linkSpacing;
        // Semicírculo izquierdo
        const leftX = cx;
        const rightX = cx + link_length;
        const midY = 0;

        // Círculo izquierdo
        elements.push({
            type: "circle",
            center: [leftX + link_width / 2, midY],
            radius: link_width / 2,
            color: "#1e293b",
            weight: 2,
            filled: false
        });
        // Círculo derecho
        elements.push({
            type: "circle",
            center: [rightX - link_width / 2, midY],
            radius: link_width / 2,
            color: "#1e293b",
            weight: 2,
            filled: false
        });
        // Líneas superior e inferior conectando los círculos
        elements.push({
            type: "segment",
            points: [[leftX + link_width / 2, midY + link_width / 2], [rightX - link_width / 2, midY + link_width / 2]],
            color: "#1e293b",
            weight: 2
        });
        elements.push({
            type: "segment",
            points: [[leftX + link_width / 2, midY - link_width / 2], [rightX - link_width / 2, midY - link_width / 2]],
            color: "#1e293b",
            weight: 2
        });
    }

    // Longitud total
    if (total_length_label) {
        elements.push({
            type: "measure",
            from: [0, -link_width],
            to: [(num_links - 1) * linkSpacing + link_length, -link_width],
            label: total_length_label,
            offset: -1.5
        });
    }

    return {
        type: "geometry_mafs",
        theme: "chain_links",
        elements,
        measures: []
    };
}

// ============================================================================
// 7. SÓLIDO COMPUESTO (EJEMPLO: L, escalera) en PROYECCIÓN ISOMÉTRICA
// ============================================================================
export function buildComposite3DSolidVisual(params: any) {
    if (!params || !params.solid_parts) return null;

    const { solid_parts, isometric_angle = 30 } = params;
    const elements: any[] = [];

    // Conversión de coordenadas 3D a 2D isométrica (ángulo 30°)
    const iso = (x: number, y: number, z: number): [number, number] => {
        const rad = (isometric_angle * Math.PI) / 180;
        const x1 = x - y * Math.cos(rad);
        const y1 = z + y * Math.sin(rad);
        return [x1, y1];
    };

    solid_parts.forEach((part: any) => {
        const { dimensions, position = { x: 0, y: 0, z: 0 }, color = "#94a3b8" } = part;
        const { length, width, height } = dimensions;
        const { x, y, z } = position;

        // Vértices del prisma (cubo si length=width=height)
        const v = [
            [x, y, z],
            [x + length, y, z],
            [x + length, y + width, z],
            [x, y + width, z],
            [x, y, z + height],
            [x + length, y, z + height],
            [x + length, y + width, z + height],
            [x, y + width, z + height]
        ].map(p => iso(p[0], p[1], p[2]));

        // Cara frontal (z=0)
        elements.push({
            type: "polygon",
            points: [v[0], v[1], v[2], v[3]],
            color: color,
            filled: true,
            fillOpacity: 0.2,
            weight: 1.5
        });
        // Cara superior (y+width)
        elements.push({
            type: "polygon",
            points: [v[3], v[2], v[6], v[7]],
            color: color,
            filled: true,
            fillOpacity: 0.2,
            weight: 1.5
        });
        // Cara lateral derecha (x+length)
        elements.push({
            type: "polygon",
            points: [v[1], v[5], v[6], v[2]],
            color: color,
            filled: true,
            fillOpacity: 0.2,
            weight: 1.5
        });
        // Aristas visibles
        const edges = [
            [v[0], v[1]], [v[1], v[2]], [v[2], v[3]], [v[3], v[0]],
            [v[4], v[5]], [v[5], v[6]], [v[6], v[7]], [v[7], v[4]],
            [v[0], v[4]], [v[1], v[5]], [v[2], v[6]], [v[3], v[7]]
        ];
        edges.forEach(([p1, p2]) => {
            elements.push({
                type: "segment",
                points: [p1, p2],
                color: "#1e293b",
                weight: 1.5
            });
        });
    });

    return {
        type: "geometry_mafs",
        theme: "composite_3d_solid",
        elements,
        measures: []
    };
}
// ============================================================================
// 8. POLÍGONO REGULAR (TRIÁNGULO EQUILÁTERO, CUADRADO, ETC.)
// ============================================================================
export function buildPolygonRegularVisual(params: any) {
    if (!params || !params.sides || !params.radius) return null;

    const { sides, radius = 4, label = "", angles = false } = params;
    const center: [number, number] = [0, 0];
    const elements: any[] = [];

    const points: [number, number][] = [];
    for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2; // empezar arriba
        const x = center[0] + radius * Math.cos(angle);
        const y = center[1] + radius * Math.sin(angle);
        points.push([x, y]);
    }

    // Puntos con letras A, B, C...
    points.forEach((p, idx) => {
        elements.push({
            type: "point",
            coords: p,
            label: String.fromCharCode(65 + idx) // A, B, C...
        });
    });

    // Lados
    for (let i = 0; i < sides; i++) {
        elements.push({
            type: "segment",
            points: [points[i], points[(i + 1) % sides]],
            color: "#1e293b",
            weight: 2
        });
    }

    // Si es triángulo equilátero y se solicitan ángulos, dibujar marcas
    if (sides === 3 && angles) {
        // Ángulos internos de 60°
        for (let i = 0; i < sides; i++) {
            elements.push({
                type: "angle",
                points: [points[(i + 2) % sides], points[i], points[(i + 1) % sides]],
                label: "60°"
            });
        }
    }

    return {
        type: "geometry_mafs",
        theme: "polygon_regular",
        elements,
        measures: []
    };
}
