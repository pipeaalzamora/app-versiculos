// Servidor de desarrollo simple
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Backoff exponencial
const exponentialBackoff = async (fn, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('429') || errorMessage.includes('503') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        const waitTime = Math.pow(2, i) * 1000;
        console.log(`Rate limit alcanzado. Reintentando en ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

// Endpoint
app.post('/api/suggest-verses', async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput || typeof userInput !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Se requiere userInput como string' 
      });
    }

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

    let jsonText = respuesta;
    if (respuesta.includes('```json')) {
      jsonText = respuesta.split('```json')[1].split('```')[0].trim();
    } else if (respuesta.includes('```')) {
      jsonText = respuesta.split('```')[1].split('```')[0].trim();
    }

    const datos = JSON.parse(jsonText);

    return res.json({
      success: true,
      versiculos: datos.versiculos || [],
    });

  } catch (error) {
    console.error('Error:', error);
    
    let errorMessage = error.message;
    let statusCode = 500;
    
    if (errorMessage.includes('API_KEY_INVALID')) {
      errorMessage = 'API key inválida';
      statusCode = 401;
    } else if (errorMessage.includes('RESOURCE_EXHAUSTED')) {
      errorMessage = 'Límite de Gemini alcanzado';
      statusCode = 429;
    } else if (errorMessage.includes('503')) {
      errorMessage = 'Servicio no disponible temporalmente';
      statusCode = 503;
    }
    
    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      versiculos: [],
    });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Backend Biblia Help funcionando ✅' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Backend corriendo en:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://192.168.1.6:${PORT}`);
  console.log(`\n📡 Endpoint: POST /api/suggest-verses\n`);
});
