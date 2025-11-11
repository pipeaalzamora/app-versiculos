import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar cliente de Gemini con la API key del servidor
const iaGenerativa = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelo = iaGenerativa.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 800, // Limitar respuesta para mayor velocidad
    topP: 0.95,
  },
});

// Configuración de rate limiting
const LIMITE_PETICIONES_POR_MINUTO = 60;
const contadorPeticiones = new Map();

// Caché de respuestas en memoria
const cacheRespuestas = new Map();
const TIEMPO_CACHE = 3600000; // 1 hora en milisegundos
const MAX_ENTRADAS_CACHE = 100;

/**
 * Genera una clave de caché normalizada
 * @param {string} texto - Texto del usuario
 * @returns {string} - Clave de caché
 */
const generarClaveCache = (texto) => {
  return texto.toLowerCase().trim().replace(/\s+/g, " ").substring(0, 200);
};

/**
 * Obtiene respuesta del caché si existe y es válida
 * @param {string} clave - Clave de caché
 * @returns {Object|null} - Respuesta cacheada o null
 */
const obtenerDelCache = (clave) => {
  const entrada = cacheRespuestas.get(clave);
  if (!entrada) return null;

  const ahora = Date.now();
  if (ahora - entrada.timestamp > TIEMPO_CACHE) {
    cacheRespuestas.delete(clave);
    return null;
  }

  return entrada.datos;
};

/**
 * Guarda respuesta en el caché
 * @param {string} clave - Clave de caché
 * @param {Object} datos - Datos a cachear
 */
const guardarEnCache = (clave, datos) => {
  // Limpiar caché si está lleno
  if (cacheRespuestas.size >= MAX_ENTRADAS_CACHE) {
    const primeraKey = cacheRespuestas.keys().next().value;
    cacheRespuestas.delete(primeraKey);
  }

  cacheRespuestas.set(clave, {
    datos,
    timestamp: Date.now(),
  });
};

/**
 * Verifica si se ha excedido el límite de peticiones
 * @param {string} ip - Dirección IP del cliente
 * @returns {boolean} - true si se excedió el límite
 */
const verificarLimiteRatePorIp = (ip) => {
  const ahora = Date.now();
  const ventanaTiempo = 60000; // 1 minuto

  if (!contadorPeticiones.has(ip)) {
    contadorPeticiones.set(ip, []);
  }

  const peticiones = contadorPeticiones.get(ip);
  const peticionesRecientes = peticiones.filter(
    (tiempo) => ahora - tiempo < ventanaTiempo
  );

  if (peticionesRecientes.length >= LIMITE_PETICIONES_POR_MINUTO) {
    return true;
  }

  peticionesRecientes.push(ahora);
  contadorPeticiones.set(ip, peticionesRecientes);

  return false;
};

/**
 * Implementa backoff exponencial para reintentos de peticiones
 * @param {Function} funcion - Función a ejecutar con reintentos
 * @param {number} maxReintentos - Número máximo de reintentos
 * @returns {Promise<any>} - Resultado de la función
 */
const backoffExponencial = async (funcion, maxReintentos = 3) => {
  let ultimoError;

  for (let i = 0; i < maxReintentos; i++) {
    try {
      return await funcion();
    } catch (error) {
      ultimoError = error;
      const mensajeError = error.message || "";

      if (
        mensajeError.includes("429") ||
        mensajeError.includes("503") ||
        mensajeError.includes("RESOURCE_EXHAUSTED")
      ) {
        const tiempoEspera = Math.pow(2, i) * 1000;
        console.log(
          `Rate limit alcanzado. Reintentando en ${tiempoEspera}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, tiempoEspera));
        continue;
      }

      throw error;
    }
  }

  throw ultimoError;
};

export default async function manejador(peticion, respuesta) {
  // Manejar preflight CORS
  if (peticion.method === "OPTIONS") {
    return respuesta.status(200).json({});
  }

  // Solo permitir POST
  if (peticion.method !== "POST") {
    return respuesta.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Verificar rate limiting por IP
    const ipCliente =
      peticion.headers["x-forwarded-for"] ||
      peticion.connection.remoteAddress ||
      "desconocida";

    if (verificarLimiteRatePorIp(ipCliente)) {
      return respuesta.status(429).json({
        success: false,
        error: "Demasiadas peticiones. Por favor, espera un momento.",
        versiculos: [],
      });
    }

    const { userInput } = peticion.body;

    if (!userInput || typeof userInput !== "string") {
      return respuesta.status(400).json({
        success: false,
        error: "Se requiere userInput como string",
      });
    }

    // Validar longitud del input
    if (userInput.length > 1000) {
      return respuesta.status(400).json({
        success: false,
        error: "El texto es demasiado largo. Máximo 1000 caracteres.",
        versiculos: [],
      });
    }

    // Verificar caché primero
    const claveCache = generarClaveCache(userInput);
    const respuestaCache = obtenerDelCache(claveCache);

    if (respuestaCache) {
      console.log("Respuesta servida desde caché");
      return respuesta.status(200).json({
        ...respuestaCache,
        fromCache: true,
      });
    }

    // Usar backoff exponencial con timeout
    const resultado = await Promise.race([
      backoffExponencial(async () => {
        const prompt = `Eres un pastor espiritual con conocimiento de la Biblia RV1960. Analiza la situación y responde en JSON:

Situación: ${userInput}

Responde SOLO con JSON válido:
{
  "mensaje": "Mensaje pastoral breve (2-3 párrafos) con empatía, esperanza y amor de Dios",
  "versiculos": [
    {"libro": "salmos", "capitulo": 23, "versiculo": "4"},
    {"libro": "juan", "capitulo": 14, "versiculo": "27"}
  ]
}

Reglas:
- 3-5 versículos reales de RV1960
- Libros en minúsculas sin acentos (ej: "1-corintios")
- Mensaje cálido y personal
- Habla directamente a la persona`;

        return await modelo.generateContent(prompt);
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout: La respuesta tardó demasiado")),
          15000
        )
      ),
    ]);

    const textoRespuesta = resultado.response.text().trim();

    // Log para debugging
    console.log("Respuesta del modelo:", textoRespuesta.substring(0, 200));

    if (!textoRespuesta) {
      throw new Error("El modelo devolvió una respuesta vacía");
    }

    // Extraer JSON de la respuesta
    let textoJson = textoRespuesta;
    if (textoRespuesta.includes("```json")) {
      textoJson = textoRespuesta.split("```json")[1].split("```")[0].trim();
    } else if (textoRespuesta.includes("```")) {
      textoJson = textoRespuesta.split("```")[1].split("```")[0].trim();
    }

    // Limpiar caracteres de control que pueden romper el JSON
    textoJson = textoJson.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    if (!textoJson) {
      throw new Error("No se pudo extraer JSON de la respuesta del modelo");
    }

    let datos;
    try {
      datos = JSON.parse(textoJson);
    } catch (parseError) {
      console.error("Error parseando JSON:", textoJson.substring(0, 200));
      throw new Error(
        `Error al parsear respuesta del modelo: ${parseError.message}`
      );
    }

    // Validar estructura de datos
    if (!datos.mensaje && !datos.versiculos) {
      throw new Error("Respuesta del modelo no tiene el formato esperado");
    }

    const respuestaFinal = {
      success: true,
      mensaje: datos.mensaje || "",
      versiculos: datos.versiculos || [],
    };

    // Guardar en caché
    guardarEnCache(claveCache, respuestaFinal);

    return respuesta.status(200).json(respuestaFinal);
  } catch (error) {
    console.error("Error completo:", error);
    console.error("Stack:", error.stack);

    let mensajeError = error.message || "Error desconocido";
    let codigoEstado = 500;

    if (mensajeError.includes("API_KEY_INVALID")) {
      mensajeError = "API key inválida";
      codigoEstado = 401;
    } else if (mensajeError.includes("RESOURCE_EXHAUSTED")) {
      mensajeError = "Límite de Gemini alcanzado";
      codigoEstado = 429;
    } else if (mensajeError.includes("503")) {
      mensajeError = "Servicio no disponible temporalmente";
      codigoEstado = 503;
    } else if (mensajeError.includes("Timeout")) {
      mensajeError = "La petición tardó demasiado. Intenta de nuevo.";
      codigoEstado = 504;
    } else if (
      mensajeError.includes("parsear") ||
      mensajeError.includes("JSON")
    ) {
      mensajeError =
        "Error procesando respuesta del modelo. Intenta reformular tu consulta.";
      codigoEstado = 500;
    }

    return respuesta.status(codigoEstado).json({
      success: false,
      error: mensajeError,
      versiculos: [],
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// Configuración de la API
export const config = {
  api: {
    bodyParser: true,
  },
};
