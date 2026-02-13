import { z } from 'zod';

// Esquema para Coordenadas [x, y]
const PointSchema = z.array(z.number()).describe("Coordenada [x, y]");

// Esquema de Elementos Visuales (Compatible con tu Frontend)
export const VisualDataSchema = z.object({
    type: z.enum(['geometry_mafs', 'physics_ariana', 'chart_bar', 'chart_pie', 'money_diagram', 'none']).describe('El tipo de visualización técnica a renderizar'),

    viewBox: z.object({
        x: z.array(z.number()).describe("Min y Max X. Ej: [-5, 5]"),
        y: z.array(z.number()).describe("Min y Max Y. Ej: [-5, 5]"),
    }).optional(),

    // Geometría
    points: z.array(PointSchema).optional(),
    polygons: z.array(z.object({
        points: z.array(PointSchema),
        color: z.string().optional(),
        filled: z.boolean().optional(),
    })).optional(),

    // Física (Ariana Elements)
    vectors: z.array(z.object({
        start: PointSchema,
        end: PointSchema,
        label: z.string().optional(),
        color: z.string().optional(),
    })).optional(),

    scenery: z.array(z.object({
        type: z.enum(['floor', 'wall', 'ramp', 'grid', 'axis']),
        data: z.any(),
    })).optional(),

    labels: z.array(z.object({
        x: z.number(),
        y: z.number(),
        text: z.string(),
        isLatex: z.boolean().optional(),
    })).optional(),

    data: z.any().optional().describe("Datos del gráfico estadístico"),
});

const MathDataSchema = z
  .object({
    type: z.enum([
      'collinear_segments',
      'solid_cube',
      'solid_prism',
      'polygon_regular',
      'consecutive_angles',
      'circle_sectors',
      'circle_arc_angle',
      'parallel_lines_bisector',
      'composite_squares',
      'net_box',
      'chain_links',
      'composite_3d_solid',

      'none',
    ]),
    params: z
      .object({
        // Para Segmentos
        segments: z
          .array(
            z.object({
              name: z.string(),
              label: z.string(),
              value: z.number(),
            }),
          )
          .optional(),
        total_label: z.string().optional(),

        // Para Sólidos/Polígonos
        side: z.number().optional(),
        length: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        radius: z.number().optional(),
        sides: z.number().optional(),
        label: z.string().optional(),

        // --- Para ángulos consecutivos ---
        vertex: z
          .object({
            label: z.string().default('O'),
            coords: z.array(z.number()).optional(),
          })
          .optional(),
        rays: z
          .array(
            z.object({
              pointLabel: z.string(), // A, B, C, D...
              angleLabel: z.string(), // "5k", "3k+10", ...
              value: z.number(), // valor real ya resuelto
            }),
          )
          .optional(),

        // ----- circle_sectors -----
        total_angle: z.number().optional(), // 360° para círculo completo
        sector_labels: z
          .array(
            z.object({
              label: z.string().optional(),
              angle: z.number(), // en grados
              color: z.string().optional(),
            }),
          )
          .optional(),
        show_radii: z.boolean().optional(),

        // ----- circle_arc_angle -----
        center: z.object({ label: z.string().default('O') }).optional(),
        points: z.array(z.string()).optional(), // ["A", "B", "C"] para ángulo inscrito
        arc_measure: z.number().optional(), // medida del arco en grados
        angle_value: z.number().optional(), // valor del ángulo x
        show_arc: z.boolean().optional(),

        // ----- parallel_lines_bisector -----
        lines: z
          .array(
            z.object({
              label: z.string(),
              direction: z.enum(['horizontal', 'vertical']),
              offset: z.number(), // distancia desde el origen
              arrow: z.boolean().optional(),
            }),
          )
          .optional(),
        bisector: z
          .object({
            vertex: z.string(), // punto de intersección (ej: "B")
            lines: z.array(z.string()), // ["AB", "BC"] o ["BD", "DC"]
            angle_label: z.string().optional(),
            angle_value: z.number().optional(),
          })
          .optional(),
        parallel_markers: z.boolean().optional(), // marcas de paralelismo ( > )

        // ----- composite_squares -----
        squares: z
          .array(
            z.object({
              label: z.string(), // "ABCD"
              side: z.number(), // longitud real
              position: z.object({
                x: z.number(),
                y: z.number(),
              }), // esquina inferior izquierda
              color: z.string().optional(),
              filled: z.boolean().optional(),
            }),
          )
          .optional(),
        shaded_region: z
          .object({
            type: z.enum(['polygon', 'difference']),
            points: z.array(z.array(z.number())).optional(),
            color: z.string().default('#fbbf24'),
          })
          .optional(),

        // ----- net_box -----
        net_dimensions: z
          .object({
            width: z.number(), // 28
            height: z.number(), // 24
            cut_square_side: z.number(), // lado del cuadrado recortado (x)
          })
          .optional(),
        box_label: z.string().optional(),

        // ----- chain_links -----
        link_length: z.number(), // largo de cada eslabón (2 cm)
        link_width: z.number(), // ancho (3 cm) o diámetro
        num_links: z.number(), // 5
        total_length_label: z.string().optional(),

        // ----- composite_3d_solid (isométrico) -----
        solid_parts: z
          .array(
            z.object({
              shape: z.enum(['cube', 'prism']),
              dimensions: z.object({
                length: z.number(),
                width: z.number(),
                height: z.number(),
              }),
              position: z
                .object({
                  x: z.number(),
                  y: z.number(),
                  z: z.number(),
                })
                .optional(),
              color: z.string().optional(),
            }),
          )
          .optional(),
        isometric_angle: z.number().default(30), // grados
        x_value: z
          .number()
          .describe(
            'OBLIGATORIO: valor numérico de la incógnita (sin unidades, solo número).',
          ),
      })
      .optional()
      .describe('Parámetros matemáticos estructurados.'),
  })
  .optional()
  .describe('Datos matemáticos puros.');

// Esquema de Respuesta Final del Servicio
export const MathProblemSchema = z.object({
  topic: z.string(),
  difficulty: z.string(),
  question_markdown: z.string(),
  options: z
    .object({
      A: z.string(),
      B: z.string(),
      C: z.string(),
      D: z.string(),
      E: z.string(),
    })
    .describe('Las 5 alternativas de respuesta. Una correcta, 4 distractores.'),
  solution_markdown: z
    .string()
    .describe(
      'Solución FINAL y directa. MÁXIMO 5 líneas. PROHIBIDO incluir pensamientos o correcciones.',
    ),
  correct_answer: z.string(),
  math_data: MathDataSchema.describe('OBLIGATORIO: Datos para el gráfico'),
  visual_data: z.any().optional(),
});

export type MathProblem = z.infer<typeof MathProblemSchema>;