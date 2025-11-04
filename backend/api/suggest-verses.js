import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar cliente de Gemini con la API key del servidor
const iaGenerativa = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelo = iaGenerativa.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Configuración de rate limiting
const LIMITE_PETICIONES_POR_MINUTO = 60;
const contadorPeticiones = new Map();

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
  const peticionesRecientes = peticiones.filter(tiempo => ahora - tiempo < ventanaTiempo);
  
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
      const mensajeError = error.message || '';
      
      if (mensajeError.includes('429') || mensajeError.includes('503') || mensajeError.includes('RESOURCE_EXHAUSTED')) {
        const tiempoEspera = Math.pow(2, i) * 1000;
        console.log(`Rate limit alcanzado. Reintentando en ${tiempoEspera}ms...`);
        await new Promise(resolve => setTimeout(resolve, tiempoEspera));
        continue;
      }
      
      throw error;
    }
  }
  
  throw ultimoError;
};

export default async function manejador(peticion, respuesta) {
  // Manejar preflight CORS
  if (peticion.method === 'OPTIONS') {
    return respuesta.status(200).json({});
  }

  // Solo permitir POST
  if (peticion.method !== 'POST') {
    return respuesta.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Verificar rate limiting por IP
    const ipCliente = peticion.headers['x-forwarded-for'] || peticion.connection.remoteAddress || 'desconocida';
    
    if (verificarLimiteRatePorIp(ipCliente)) {
      return respuesta.status(429).json({
        success: false,
        error: 'Demasiadas peticiones. Por favor, espera un momento.',
        versiculos: [],
      });
    }

    const { userInput } = peticion.body;

    if (!userInput || typeof userInput !== 'string') {
      return respuesta.status(400).json({ 
        success: false, 
        error: 'Se requiere userInput como string' 
      });
    }

    // Validar longitud del input
    if (userInput.length > 1000) {
      return respuesta.status(400).json({
        success: false,
        error: 'El texto es demasiado largo. Máximo 1000 caracteres.',
        versiculos: [],
      });
    }

    // Usar backoff exponencial
    const resultado = await backoffExponencial(async () => {
      const prompt = `Eres un pastor espiritual lleno de la gracia de Dios, con profundo conocimiento de la Biblia Reina Valera 1960.

Tu misión es escuchar con compasión el corazón de quien te busca, analizar su situación con sabiduría divina, y ministrar con amor y convicción.

INSTRUCCIONES:
1. Lee atentamente lo que la persona comparte contigo
2. Identifica su dolor, necesidad o situación
3. Selecciona 3-5 versículos de la Biblia RV1960 que hablen directamente a su corazón
4. Escribe una palabra de aliento pastoral (2-4 párrafos) que:
   - Reconozca su dolor o situación con empatía
   - Ministre esperanza y consuelo con la Palabra de Dios
   - Hable con convicción y autoridad espiritual
   - Transmita el amor incondicional de Dios
   - Sea personal, cálida y llena de gracia

FORMATO DE RESPUESTA (JSON):
{
  "mensaje": "Tu palabra de aliento pastoral aquí. Habla como un pastor que conoce el corazón de Dios y ama a sus ovejas. Usa un tono cálido, compasivo pero con convicción. Menciona cómo Dios ve su situación y qué promesas tiene para ellos.",
  "versiculos": [
    {"libro": "salmos", "capitulo": 23, "versiculo": "4"},
    {"libro": "juan", "capitulo": 14, "versiculo": "27"},
    {"libro": "isaias", "capitulo": 41, "versiculo": "10"}
  ]
}

REGLAS IMPORTANTES:
- Solo versículos que EXISTEN en la Biblia RV1960
- Nombres de libros en minúsculas y sin acentos
- Libros con números usan guión: "1-corintios", "2-timoteo"
- Versículos pueden ser rangos: "6-7" o individuales: "16"
- El mensaje debe ser genuino, no genérico
- Habla en segunda persona (tú/usted) dirigiéndote a la persona
- Incluye referencias a la fidelidad de Dios, Su amor y Sus promesas

Libros válidos: genesis, exodo, levitico, numeros, deuteronomio, josue, jueces, rut, 1-samuel, 2-samuel, 1-reyes, 2-reyes, 1-cronicas, 2-cronicas, esdras, nehemias, ester, job, salmos, proverbios, eclesiastes, cantares, isaias, jeremias, lamentaciones, ezequiel, daniel, oseas, joel, amos, abdias, jonas, miqueas, nahum, habacuc, sofonias, hageo, zacarias, malaquias, mateo, marcos, lucas, juan, hechos, romanos, 1-corintios, 2-corintios, galatas, efesios, filipenses, colosenses, 1-tesalonicenses, 2-tesalonicenses, 1-timoteo, 2-timoteo, tito, filemon, hebreos, santiago, 1-pedro, 2-pedro, 1-juan, 2-juan, 3-juan, judas, apocalipsis

Persona que busca consuelo: ${userInput}`;

      return await modelo.generateContent(prompt);
    });

    const textoRespuesta = resultado.response.text().trim();

    // Extraer JSON de la respuesta
    let textoJson = textoRespuesta;
    if (textoRespuesta.includes('```json')) {
      textoJson = textoRespuesta.split('```json')[1].split('```')[0].trim();
    } else if (textoRespuesta.includes('```')) {
      textoJson = textoRespuesta.split('```')[1].split('```')[0].trim();
    }

    const datos = JSON.parse(textoJson);

    return respuesta.status(200).json({
      success: true,
      mensaje: datos.mensaje || '',
      versiculos: datos.versiculos || [],
    });

  } catch (error) {
    console.error('Error al sugerir versículos:', error);
    
    let mensajeError = error.message;
    let codigoEstado = 500;
    
    if (mensajeError.includes('API_KEY_INVALID')) {
      mensajeError = 'API key inválida';
      codigoEstado = 401;
    } else if (mensajeError.includes('RESOURCE_EXHAUSTED')) {
      mensajeError = 'Límite de Gemini alcanzado';
      codigoEstado = 429;
    } else if (mensajeError.includes('503')) {
      mensajeError = 'Servicio no disponible temporalmente';
      codigoEstado = 503;
    }
    
    return respuesta.status(codigoEstado).json({
      success: false,
      error: mensajeError,
      versiculos: [],
    });
  }
}

// Configuración de la API
export const config = {
  api: {
    bodyParser: true,
  },
};
