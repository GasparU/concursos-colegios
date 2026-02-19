import { useState } from "react";
import api from "../services/api";

export const useParametricGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [problema, setProblema] = useState<any>(null);

  const generarProblema = async (plantillaId: string, valoresFijos?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/parametric/generar", {
        plantillaId,
        modo: "directo",
        valoresFijos: valoresFijos || {},
      });
      setProblema(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Error al generar problema paramétrico");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const listarPlantillas = async (grado?: string, tema?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (grado) params.append("grado", grado);
      if (tema) params.append("tema", tema);
      const response = await api.get(
        `/parametric/plantillas?${params.toString()}`,
      );
      return response.data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    generarProblema,
    listarPlantillas,
    problema,
    loading,
    error,
  };
};
