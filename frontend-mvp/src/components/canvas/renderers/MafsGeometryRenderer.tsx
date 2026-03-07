import { StatisticsChart } from "./StatisticsChart";
import { RenderizadorRectangulo } from "./especializados/RenderizadorRectangulo";
import { RenderizadorCubo } from "./especializados/RenderizadorCubo";
import { RenderizadorSimetria } from "./especializados/RenderizadorSimetria";
import { RenderizadorTrianguloAngulos } from "./especializados/RenderizadorTrianguloAngulos";
import { RenderizadorRectanguloPuntoDiagonal } from "./especializados/RenderizadorRectanguloPuntoDiagonal";
import { RenderizadorCuadradosSuperpuestos } from "./especializados/RenderizadorCuadradosSuperpuestos";
import { RenderizadorTrianguloCuadradoInscrito } from "./especializados/RenderizadorTrianguloCuadradoInscrito";
import { RenderizadorBisectrizAngulos } from "./especializados/RenderizadorBisectrizAngulos";
import { RenderizadorPoligonoRegular } from "./especializados/RenderizadorPoligonoRegular";
import { RenderizadorRegionesCompuestas } from "./especializados/RenderizadorRegionesCompuestas";
import { RenderizadorAreaSombreada } from "./especializados/RenderizadorAreaSombreada";
import { RenderizadorAngulosRadiales } from "./especializados/RenderizadorAngulosRadiales";
import { RenderizadorRectasSecantes } from "./especializados/RenderizadorRectasSecantes";
import { RenderizadorParalelasEcuaciones } from "./especializados/RenderizadorParalelasEcuaciones";
import { RenderizadorParalelasSerrucho } from "./especializados/RenderizadorParalelasSerrucho";
import { RenderizadorAngulosTeoricos } from "./especializados/RenderizadorAngulosTeoricos";
import { RenderizadorRectanguloArea } from "./especializados/RenderizadorRectanguloArea";
import { RenderizadorThales } from "./especializados/RenderizadorThales";
import { RenderizadorPerimetroEscalera } from "./especializados/RenderizadorPerimetroEscalera";
import { RenderizadorRombo } from "./especializados/RenderizadorRombo";
import { RenderizadorTrapecio } from "./especializados/RenderizadorTrapecio";
import { RenderizadorParalelogramo } from "./especializados/RenderizadorParalelogramo";
import { RenderizadorPrismaRectangular } from "./especializados/RenderizadorPrismaRectangular";
import { RenderizadorPrismaTriangular } from "./especializados/RenderizadorPrismaTriangular";
import { RenderizadorPiramideCuadrangular } from "./especializados/RenderizadorPiramideCuadrangular";
import { RenderizadorAngulosCircunferencia } from "./especializados/RenderizadorAngulosCircunferencia";
import { RenderizadorSegmentosCircunferencia } from "./especializados/RenderizadorSegmentosCircunferencia";
import { RenderizadorPropiedadesCircunferencia } from "./especializados/RenderizadorPropiedadesCircunferencia";
import { RenderizadorTriangulos } from "./especializados/RenderizadorTriangulos";
import RenderizadorTrianguloCompleto from "./especializados/RenderizadorTrianguloCompleto";


export const MafsGeometryRenderer = (props: any) => {
  const datosEntrada =
    props.datosMatematicos || props.visualData || props.mathData || props.data;

  if (!datosEntrada) {
    return (
      <div className="text-red-600 font-bold">Error: Sin datos de entrada</div>
    );
  }

  let tipoFigura = datosEntrada.type;
  let parametros = datosEntrada.params;

  if (tipoFigura === "geometry_mafs") {
    tipoFigura = datosEntrada.theme;
    if (!parametros) {
      parametros = datosEntrada;
    }
  }

  switch (tipoFigura) {
    // Geometría existente

    case "rectas_secantes":
      return <RenderizadorRectasSecantes parametros={parametros} />;

    case "triangulo_angulos":
      return (
        <RenderizadorTrianguloAngulos
          vertices={parametros.vertices}
          etiquetasVertices={parametros.etiquetasVertices}
          angulos={parametros.angulos}
          lados={parametros.lados}
        />
      );
    case "paralelas_ecuaciones":
      return <RenderizadorParalelasEcuaciones parametros={parametros} />;
    case "rectangulo":
      return (
        <RenderizadorRectangulo
          esquina={parametros.esquina}
          ancho={parametros.ancho}
          alto={parametros.alto}
          labels={parametros.labels}
          etiquetasLados={parametros.etiquetasLados}
          color={parametros.color}
        />
      );

    case "paralelas_serrucho":
      return <RenderizadorParalelasSerrucho parametros={parametros} />;

    case "rectangulo_area":
      return <RenderizadorRectanguloArea parametros={parametros} />;

    case "angulos_teoricos_multiples":
      return <RenderizadorAngulosTeoricos parametros={parametros} />;

    case "triangulo_completo":
      return (
        <RenderizadorTrianguloCompleto
          variante={parametros.variante}
          vertices={parametros.vertices}
          etiquetas={parametros.etiquetas}
          angulos={parametros.angulos}
          lados={parametros.lados}
          lineasAzulesPunteadas={parametros.lineasAzulesPunteadas} // 🔥 AGREGAR ESTO
        />
      );

    case "thales":
      return <RenderizadorThales parametros={parametros} />;

    case "perimetro_escalera":
      return <RenderizadorPerimetroEscalera parametros={parametros} />;

    case "rombo":
      return <RenderizadorRombo parametros={parametros} />;
    case "trapecio":
      return <RenderizadorTrapecio parametros={parametros} />;
    case "paralelogramo":
      return <RenderizadorParalelogramo parametros={parametros} />;

    case "prisma_rectangular":
      return <RenderizadorPrismaRectangular parametros={parametros} />;

    case "prisma_triangular":
      return <RenderizadorPrismaTriangular parametros={parametros} />;

    case "piramide_cuadrangular":
      return <RenderizadorPiramideCuadrangular parametros={parametros} />;

    case "angulos_circunferencia":
      return <RenderizadorAngulosCircunferencia parametros={parametros} />;

    case "segmentos_circunferencia":
      return <RenderizadorSegmentosCircunferencia parametros={parametros} />;

    case "propiedades_circunferencia":
      return <RenderizadorPropiedadesCircunferencia parametros={parametros} />;

    case "angulos_radiales":
      return <RenderizadorAngulosRadiales parametros={parametros} />;
    case "area_sombreada":
      return <RenderizadorAreaSombreada parametros={parametros} />;
    case "cubo":
      return (
        <RenderizadorCubo puntos={parametros.puntos} color={parametros.color} />
      );

    case "triangulos":
      return <RenderizadorTriangulos parametros={parametros} />;

    case "simetria":
      return <RenderizadorSimetria />;

    // Nuevos casos
    case "rectangulo_punto_diagonal":
      return <RenderizadorRectanguloPuntoDiagonal parametros={parametros} />;
    case "cuadrados_superpuestos":
      return <RenderizadorCuadradosSuperpuestos parametros={parametros} />;
    case "triangulo_cuadrado_inscrito":
      return <RenderizadorTrianguloCuadradoInscrito parametros={parametros} />;
    case "bisectriz_angulos":
      return <RenderizadorBisectrizAngulos parametros={parametros} />;
    case "poligono_regular":
      return (
        <RenderizadorPoligonoRegular
          lados={parametros.lados}
          radio={parametros.radio}
          centro={parametros.centro}
          labels={parametros.labels}
          color={parametros.color}
        />
      );
    case "regiones_sombreadas_compuestas":
      return <RenderizadorRegionesCompuestas parametros={parametros} />;

    // Estadística
    case "chart_bar":
    case "chart_pie":
      return <StatisticsChart type={tipoFigura} data={parametros} />;

    default:
      return (
        <div className="p-10 text-center text-red-500">
          Tipo de figura no soportado: <strong>{tipoFigura}</strong>
        </div>
      );
  }
};
