import axios from 'axios';

// 🔥 AÑADIDO: parámetro 'styleConstraint' al final
export const generateMathProblem = async (
    topic: string,
    grade: string,
    stage: string,
    difficulty: string,
    model: 'deepseek' | 'gemini',
    quantity: number,
    styleConstraint?: string // <--- NUEVO CAMPO
) => {
    // 🔥 CORRECCIÓN CRÍTICA: La ruta correcta es 'ai-generator', no 'ai'.
    // Si sigue fallando, prueba quitando el '/api' (http://localhost:3000/ai-generator/generate)
    const response = await axios.post('http://localhost:3000/ai/problem', {
        topic,
        grade,
        stage,
        difficulty,
        model,
        quantity,
        styleConstraint
    });

    // Retornamos directamente la data
    return response.data.data;
};