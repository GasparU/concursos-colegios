// Función de Normalización "Google-Style"
// Convierte "Fracción de una Fracción" -> "fraccion de una fraccion"
// Convierte "Álgebra" -> "algebra"
export const normalizeText = (text: string) => {
    return text
        .toLowerCase()                 // Minusculas
        .normalize("NFD")              // Descompone tildes (á -> a + ´)
        .replace(/[\u0300-\u036f]/g, "") // Elimina los simbolos de tilde
        .trim();                       // Quita espacios extra
};