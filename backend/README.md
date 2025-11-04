# Backend - Biblia Help

Backend serverless para proteger la API key de Gemini y procesar sugerencias de versículos.

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env y agregar GEMINI_API_KEY

# Ejecutar servidor de desarrollo
npm run dev
```

El servidor estará disponible en:
- `http://localhost:3000`
- `http://192.168.1.6:3000` (para Android)

### Despliegue en Vercel

```bash
# Login
vercel login

# Deploy
vercel

# Agregar API key
vercel env add GEMINI_API_KEY

# Deploy a producción
vercel --prod
```

## 📡 API

### POST `/api/suggest-verses`

Sugiere versículos basados en el sentimiento del usuario.

**Request:**
```json
{
  "userInput": "me siento triste"
}
```

**Response:**
```json
{
  "success": true,
  "versiculos": [
    {
      "libro": "salmos",
      "capitulo": 34,
      "versiculo": "18"
    }
  ]
}
```

## 🔒 Seguridad

- **Rate Limiting**: 60 peticiones/minuto por IP
- **Validación de entrada**: Máximo 500 caracteres
- **Backoff exponencial**: Para manejar límites de Gemini
- **API key protegida**: No expuesta en el frontend

## 🧪 Testing

```bash
npm test                    # Ejecutar tests
npm run test:watch         # Modo watch
npm run test:coverage      # Con cobertura
```

## 📊 Monitoreo

```bash
vercel logs                 # Ver logs
vercel logs --follow       # Seguir en tiempo real
```

## 🛠️ Tecnologías

- Node.js 18+
- Express.js
- Google Generative AI (Gemini 2.5 Flash)
- Vercel Serverless Functions

## 📝 Variables de Entorno

```bash
GEMINI_API_KEY=tu_api_key_aqui
```

Obtener en: https://aistudio.google.com/app/apikey

## 📚 Documentación

Ver [DOCUMENTACION.md](../DOCUMENTACION.md) para más detalles.
