import {
    buildCollinearVisual,
    buildCubeVisual,
    buildConsecutiveAnglesVisual,
    buildCircleSectorsVisual,
    buildCircleArcAngleVisual,
    buildParallelLinesBisectorVisual,
    buildCompositeSquaresVisual,
    buildNetBoxVisual,
    buildChainLinksVisual,
    buildComposite3DSolidVisual,
    buildPolygonRegularVisual
} from './geometry.factory';

export function VisualFactory(mathData: any) {
    // 🔥 LOG DIAGNÓSTICO: ¿Llega data o llega null?
    if (!mathData) {
        console.warn("⚠️ [VisualFactory] Recibió mathData NULL. La IA decidió NO dibujar.");
        return null;
    }

    console.log("🎨 [VisualFactory] Procesando tipo:", mathData.type);
    console.log("📦 [VisualFactory] Params:", JSON.stringify(mathData.params, null, 2));

    // 🔥 AQUÍ ESTABA EL ERROR: Agregamos ': any' para que acepte objetos
    let result: any = null;

    switch (mathData.type) {
      case 'collinear_segments':
        result = buildCollinearVisual(mathData.params);
        break;
      case 'solid_cube':
        result = buildCubeVisual(mathData.params);
        break;
      case 'consecutive_angles':
        result = buildConsecutiveAnglesVisual(mathData.params);
        break;
      case 'circle_sectors':
        result = buildCircleSectorsVisual(mathData.params);
        break;
      case 'circle_arc_angle':
        result = buildCircleArcAngleVisual(mathData.params);
        break;
      case 'parallel_lines_bisector':
        result = buildParallelLinesBisectorVisual(mathData.params);
        break;
      case 'composite_squares':
        result = buildCompositeSquaresVisual(mathData.params);
        break;
      case 'net_box':
        result = buildNetBoxVisual(mathData.params);
        break;
      case 'chain_links':
        result = buildChainLinksVisual(mathData.params);
        break;
      case 'composite_3d_solid':
        result = buildComposite3DSolidVisual(mathData.params);
        break;
      case 'polygon_regular':
        result = buildPolygonRegularVisual(mathData.params);
        break;

      case 'chart_bar':
      case 'chart_pie':
      case 'frequency_table':
        result = mathData;
        break;

      default:
        console.error(`❌ [VisualFactory] Tipo NO SOPORTADO: ${mathData.type}`);
        return null;
    }

    if (!result) {
        console.error(`❌ [VisualFactory] Falló al construir el objeto visual para ${mathData.type}`);
    } else {
        // Ahora sí no dará error porque result es 'any'
        console.log(`✅ [VisualFactory] Éxito. Theme: ${result.theme}`);
    }

    return result;
}