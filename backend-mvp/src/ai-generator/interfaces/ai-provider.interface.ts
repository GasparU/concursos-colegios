import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export interface IAiProvider {
    /**
     * Nombre del proveedor para logs (ej: 'DeepSeek', 'Gemini')
     */
    readonly providerName: string;

    /**
     * Genera una respuesta estructurada basada en un esquema Zod
     */
    generateStructured<T>(
        messages: (SystemMessage | HumanMessage)[],
        schema: any
    ): Promise<T>;
}