import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

// Inicializar cliente de Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Función auxiliar para implementar backoff exponencial
 * @param {Function} fn - Función a ejecutar con reintentos
 * @param {number} maxRetries - Número máximo de reintentos
 * @returns {Promise} - Resultado de la función
 */
const exponentialBackoff = async (fn, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Si es error 429 (rate limit) o 503 (servicio no disponible), reintentar
      const errorMessage = error.message || '';
      if (errorMessage.includes('429') || errorMessage.includes('503') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        const waitTime = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        console.log(`Rate limit alcanzado. Reintentando en ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // Para otros errores, no reintentar
      throw error;
    }
  }
  
  // Si llegamos aquí, se agotaron los reintentos
  throw lastError;
};

/**
 * Analiza el texto del usuario y sugiere versículos específicos de la Biblia RV1960
 * @param {string} userInput - Texto ingresado por el usuario
 * @returns {Promise<Object>} - Objeto con versículos sugeridos
 */
export const sugerirVersiculos = async (userInput) => {
  try {
    // Usar backoff exponencial para manejar rate limits
    const result = await exponentialBackoff(async () => {
      const prompt = `Eres un experto en la Biblia Reina Valera 1960 y consejero espiritual.

Tu tarea es analizar el sentimiento/necesidad del usuario y sugerir 3 versículos específicos que le ayudarían.

IMPORTANTE:
- Solo sugiere versículos que EXISTEN en la Biblia RV1960
- Usa nombres de libros en minúsculas y sin acentos
- Para libros con números usa guión: "1-corintios", "2-timoteo"
- Versículos pueden ser rangos: "6-7" o individuales: "16"

Responde ÚNICAMENTE con JSON en este formato exacto:
{
  "versiculos": [
    {"libro": "salmos", "capitulo": 23, "versiculo": "4"},
    {"libro": "juan", "capitulo": 14, "versiculo": "27"},
    {"libro": "isaias", "capitulo": 41, "versiculo": "10"}
  ]
}

Libros válidos: genesis, exodo, levitico, numeros, deuteronomio, josue, jueces, rut, 1-samuel, 2-samuel, 1-reyes, 2-reyes, 1-cronicas, 2-cronicas, esdras, nehemias, ester, job, salmos, proverbios, eclesiastes, cantares, isaias, jeremias, lamentaciones, ezequiel, daniel, oseas, joel, amos, abdias, jonas, miqueas, nahum, habacuc, sofonias, hageo, zacarias, malaquias, mateo, marcos, lucas, juan, hechos, romanos, 1-corintios, 2-corintios, galatas, efesios, filipenses, colosenses, 1-tesalonicenses, 2-tesalonicenses, 1-timoteo, 2-timoteo, tito, filemon, hebreos, santiago, 1-pedro, 2-pedro, 1-juan, 2-juan, 3-juan, judas, apocalipsis

Usuario: ${userInput}`;

      return await model.generateContent(prompt);
    });

    const respuesta = result.response.text().trim();

    // Extraer JSON de la respuesta (Gemini a veces incluye markdown)
    let jsonText = respuesta;
    if (respuesta.includes('```json')) {
      jsonText = respuesta.split('```json')[1].split('```')[0].trim();
    } else if (respuesta.includes('```')) {
      jsonText = respuesta.split('```')[1].split('```')[0].trim();
    }

    // Parsear la respuesta JSON
    const datos = JSON.parse(jsonText);

    return {
      success: true,
      versiculos: datos.versiculos || [],
    };
  } catch (error) {
    console.error('Error al sugerir versículos con Gemini:', error);
    
    // Mensajes de error más específicos
    let errorMessage = error.message;
    
    if (errorMessage.includes('API_KEY_INVALID')) {
      errorMessage = 'API key inválida. Verifica tu configuración.';
    } else if (errorMessage.includes('RESOURCE_EXHAUSTED')) {
      errorMessage = 'Límite de Gemini alcanzado. Usando búsqueda tradicional.';
    } else if (errorMessage.includes('503')) {
      errorMessage = 'Servicio de Gemini no disponible temporalmente.';
    }
    
    return {
      success: false,
      error: errorMessage,
      versiculos: [],
    };
  }
};
