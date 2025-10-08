// Script de prueba para verificar la integración con Google Gemini
// Ejecutar con: node test-ia.js

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function probarIA() {
  console.log('🧪 Probando integración con Google Gemini (GRATIS)...\n');
  console.log('La IA ahora sugiere versículos específicos de toda la Biblia RV1960\n');
  console.log('='.repeat(70) + '\n');

  const ejemplos = [
    "tengo pena señor y me gustaría hablar contigo",
    "me siento muy solo y abandonado",
    "necesito paz en mi corazón",
    "tengo miedo de lo que viene en el futuro",
    "quiero agradecer por todas las bendiciones",
  ];

  for (const texto of ejemplos) {
    console.log(`📝 Entrada: "${texto}"`);
    
    try {
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

Usuario: ${texto}`;

      const result = await model.generateContent(prompt);
      const respuesta = result.response.text().trim();
      
      // Extraer JSON de la respuesta
      let jsonText = respuesta;
      if (respuesta.includes('```json')) {
        jsonText = respuesta.split('```json')[1].split('```')[0].trim();
      } else if (respuesta.includes('```')) {
        jsonText = respuesta.split('```')[1].split('```')[0].trim();
      }
      
      const datos = JSON.parse(jsonText);
      
      console.log('✅ Versículos sugeridos:');
      datos.versiculos.forEach((v, i) => {
        console.log(`   ${i + 1}. ${v.libro} ${v.capitulo}:${v.versiculo}`);
      });
      console.log('\n' + '-'.repeat(70) + '\n');
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
    }
  }

  console.log('✨ Prueba completada!');
  console.log('💡 Estos versículos serán verificados con la API de la Biblia en la app.');
  console.log('🎉 Google Gemini es 100% GRATIS - Sin límites de costo!');
}

probarIA();
