import { useState } from 'react';
import { generateMathProblem } from '../services/ai-client';

export const useProblemGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🔥 CORRECCIÓN: Aceptamos 'styleConstraint' al final
    const generate = async (
        topic: string,
        grade: string,
        stage: string,
        difficulty: string,
        model: 'deepseek' | 'gemini',
        quantity: number,
        styleConstraint?: string // <--- NUEVO ARGUMENTO AQUÍ
    ) => {
        setLoading(true);
        setError(null);
        try {
            // Llamamos al servicio pasando el nuevo parámetro
            const result = await generateMathProblem(
                topic,
                grade,
                stage,
                difficulty,
                model,
                quantity,
                styleConstraint
            );

            if (result) {
                // Si el backend devuelve un objeto único, lo envolvemos en array.
                // Si devuelve array, lo pasamos directo.
                const finalResult = Array.isArray(result) ? result : [result];
                return finalResult;
            } else {
                setError("La IA no devolvió un resultado válido.");
                return null;
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Error de conexión con el servidor.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { generate, loading, error };
};