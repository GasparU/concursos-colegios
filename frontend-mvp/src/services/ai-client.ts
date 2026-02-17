import api from "./api"; // 👈 importa la instancia con baseURL

export const generateMathProblem = async (
  topic: string,
  grade: string,
  stage: string,
  difficulty: string,
  model: "deepseek" | "gemini",
  quantity: number,
  styleConstraint?: string,
) => {
  const response = await api.post("/ai/problem", {
    // 👈 ahora usa api.post
    topic,
    grade,
    stage,
    difficulty,
    model,
    quantity,
    styleConstraint,
  });
  console.log("📥 [FRONTEND] Respuesta cruda del backend:", response.data);
  return response.data.data;
};
