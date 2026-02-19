export interface ProblemaSimple {
  tipo: 'operaciones' | 'fracciones' | 'sucesiones';
  enunciado: string;
  respuesta: any;
  latex?: string;
}

export interface Fraccion {
  numerador: number;
  denominador: number;
}
