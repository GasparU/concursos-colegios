export interface VariableDef {
  type: 'number' | 'string';
  min?: number;
  max?: number;
  step?: number;
  opciones?: string[];
}

export interface Plantilla {
  id: string;
  tema: string;
  subtipo?: string;
  grado: string;
  etapa: string[];
  dificultad: string[];
  bidireccional?: boolean;
  variables: Record<string, VariableDef>;
  relaciones: string[];
  restricciones?: string[];
  incognita_directa: string | string[];
  incognitas_inversa?: string[];
  formato_respuesta: any;
  metadata: any;
  // otros campos que uses
}
