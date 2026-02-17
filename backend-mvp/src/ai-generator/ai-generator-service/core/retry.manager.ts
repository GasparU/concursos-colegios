// src/ai-generator/core/retry.manager.ts
export async function withRetries<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  logger?: any,
): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (logger) logger.log(`🔄 Intento ${attempt}/${maxRetries}...`);
      return await fn();
    } catch (error) {
      lastError = error;
      // 🔥 Manejo seguro del mensaje de error (unknown)
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (logger) logger.warn(`⚠️ Intento ${attempt} fallido: ${errorMessage}`);
      if (attempt === maxRetries) throw error;
    }
  }
  throw lastError; // nunca se ejecuta, pero TypeScript lo pide
}
