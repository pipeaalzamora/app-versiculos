# 📖 Aplicación de Búsqueda de Versículos Bíblicos con IA 🆓

Una aplicación móvil React Native que te ayuda a encontrar consuelo y guía en la Biblia basándose en tus sentimientos y necesidades, **potenciada con Inteligencia Artificial 100% GRATUITA de Google Gemini**.

## ✨ Características

- 🤖 **Inteligencia Artificial GRATIS**: Usa Google Gemini 2.5 Flash para entender lenguaje natural
- 🔍 **Búsqueda Natural**: Escribe como hablas - "tengo pena señor y me gustaría hablar contigo"
- 📚 **Acceso Completo**: Miles de versículos de toda la Biblia Reina Valera 1960
- 📱 **Multiplataforma**: Funciona en iOS, Android y Web
- 🌐 **API en Tiempo Real**: Versículos verificados desde la Bible API
- ✅ **100% Preciso**: Todos los versículos son verificados antes de mostrarse
- 💫 **Interfaz Intuitiva**: Diseño limpio y fácil de usar
- ⚡ **Respuesta Rápida**: Indicador de carga mientras se obtienen los versículos

## 🎯 Temas Disponibles

La aplicación reconoce los siguientes temas/sentimientos:

- **Tristeza** - Encuentra consuelo en momentos difíciles
- **Soledad** - Recuerda que nunca estás solo
- **Miedo** - Encuentra valentía y protección
- **Ansiedad** - Encuentra paz y tranquilidad
- **Fe** - Fortalece tu confianza en Dios
- **Esperanza** - Renueva tu esperanza
- **Amor** - Descubre el amor de Dios
- **Paz** - Encuentra paz interior
- **Fortaleza** - Obtén fuerza espiritual
- **Perdón** - Aprende sobre el perdón
- **Gratitud** - Cultiva un corazón agradecido
- **Sabiduría** - Busca sabiduría divina

## 🚀 Cómo Usar

1. **Abre la aplicación**
2. **Escribe cómo te sientes** de forma natural
   - ✅ "tengo pena señor y me gustaría hablar contigo"
   - ✅ "perdí mi trabajo y tengo miedo del futuro"
   - ✅ "me siento muy solo y abandonado"
   - ✅ "quiero agradecer por todas las bendiciones"
3. **Presiona "Buscar Consuelo"**
4. **Lee el versículo** que Dios tiene para ti

La IA analizará tu situación y sugerirá versículos específicos de toda la Biblia.

## 💻 Instalación y Desarrollo

### Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Expo CLI
- **API Key de Google Gemini** (100% GRATIS, sin tarjeta de crédito)
- Para iOS: macOS con Xcode
- Para Android: Android Studio

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>

# Instalar dependencias
npm install

# Configurar API Key de Google Gemini (GRATIS)
# 1. Obtén tu API key en: https://aistudio.google.com/app/apikey
# 2. Edita el archivo .env
# 3. Pega tu clave: GEMINI_API_KEY=tu-clave-aqui

# Probar la IA (opcional)
npm run test:ia

# Iniciar la aplicación
npm start
```

### 📚 Documentación Completa

- 📖 `INICIO_RAPIDO.md` - 3 pasos para empezar
- 📖 `IMPLEMENTACION_COMPLETA.md` - Resumen completo
- 📖 `VERSION_MEJORADA.md` - Explicación de la IA
- 📖 `EJEMPLOS_USO.md` - 10 casos de uso reales
- 📖 `CHECKLIST.md` - Lista de verificación

### Ejecutar en Dispositivos

```bash
# iOS (solo macOS)
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🏗️ Arquitectura

### Estructura del Proyecto

```
├── App.js                          # Componente principal
├── src/
│   ├── data/
│   │   ├── temasVersiculos.js     # Mapeo de temas a referencias bíblicas
│   │   └── versiculosTematicos.js # Datos locales (backup)
│   └── services/
│       └── bibleApiService.js     # Servicio para interactuar con la API
├── package.json
└── README.md
```

### Flujo de Datos (Versión Mejorada con IA)

1. **Usuario ingresa texto natural** → "perdí mi trabajo y tengo miedo del futuro"
2. **Google Gemini analiza el contexto** → Detecta: provisión, confianza, paz
3. **IA sugiere versículos específicos** → [Filipenses 4:19, Jeremías 29:11, Mateo 6:25-34]
4. **Sistema verifica con API** → `https://bible-api.deno.dev/api/read/rv1960/...`
5. **Muestra versículo verificado** → "Filipenses 4:19 RV1960" + texto real
6. **Fallback si falla** → Búsqueda tradicional por palabras clave

## 🔌 API Utilizada

**Bible API**: https://bible-api.deno.dev

- **Versión**: Reina Valera 1960 (rv1960)
- **Endpoint**: `/api/read/{version}/{book}/{chapter}/{verse}`
- **Documentación**: https://docs-bible-api.netlify.app/

### Ejemplo de Uso de la API

```javascript
// Obtener un versículo
GET https://bible-api.deno.dev/api/read/rv1960/juan/3/16

// Obtener un rango de versículos
GET https://bible-api.deno.dev/api/read/rv1960/filipenses/4/6-7
```

## 🧪 Pruebas

### Pruebas de Integración

```bash
# Ejecutar pruebas automatizadas
npm test

# Probar la API
node test-api.js
```

### Pruebas Manuales

Consulta `TESTING-GUIDE.md` para escenarios de prueba detallados.

## 📊 Tecnologías

- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma de desarrollo
- **Google Gemini 2.5 Flash** - Inteligencia artificial GRATIS para análisis de sentimientos
- **Axios** - Cliente HTTP para llamadas a la API
- **Bible API** - API de versículos bíblicos (RV1960)
- **react-native-dotenv** - Gestión de variables de entorno

## 🎨 Características de UI/UX

- ✅ Diseño responsivo para diferentes tamaños de pantalla
- ✅ Feedback visual al presionar botones
- ✅ Indicador de carga durante búsquedas
- ✅ Mensajes de error claros y útiles
- ✅ Auto-focus en el campo de búsqueda
- ✅ Soporte para búsqueda con Enter/Return

## 🔄 Evolución de la Aplicación

### Versión 1.0 (Local)
- ❌ Datos estáticos almacenados localmente
- ❌ 12 versículos predefinidos
- ❌ Solo palabras clave exactas

### Versión 2.0 (API)
- ✅ Datos dinámicos desde la API
- ✅ 144 versículos (12 temas × 4 versículos)
- ❌ Aún limitado a palabras clave

### Versión 3.0 (IA Básica)
- ✅ Entiende lenguaje natural
- ✅ Detecta múltiples emociones
- ❌ Limitado a 144 versículos

### Versión 4.0 (IA Mejorada con Gemini - Actual) ⭐
- ✅ Entiende contexto completo
- ✅ Acceso a TODA la Biblia (miles de versículos)
- ✅ Versículos 100% precisos (verificados)
- ✅ Respuestas más relevantes
- ✅ **100% GRATIS** (Google Gemini)

## 🌟 Ejemplos de Uso (Con IA Mejorada)

### Ejemplo 1: Situación Compleja
```
Usuario: "perdí mi trabajo y tengo miedo del futuro"
IA: Analiza contexto → provisión, confianza, paz
App: Muestra Filipenses 4:19
"Mi Dios, pues, suplirá todo lo que os falta conforme 
a sus riquezas en gloria en Cristo Jesús."
```

### Ejemplo 2: Gratitud Específica
```
Usuario: "quiero agradecer por la sanidad de mi madre"
IA: Analiza contexto → sanidad, gratitud, milagros
App: Muestra Salmos 103:2-3
"Bendice, alma mía, a Jehová, y no olvides ninguno de 
sus beneficios. Él es quien perdona todas tus iniquidades, 
el que sana todas tus dolencias."
```

### Ejemplo 3: Lenguaje Natural
```
Usuario: "tengo pena señor y me gustaría hablar contigo"
IA: Analiza contexto → tristeza, soledad, consuelo
App: Muestra Salmos 34:18
"Cercano está Jehová a los quebrantados de corazón; 
y salva a los contritos de espíritu."
```

### Ejemplo 4: Palabra Clave Simple
```
Usuario: "paz"
IA: Detecta tema directo
App: Muestra Juan 14:27
"La paz os dejo, mi paz os doy; yo no os la doy como el 
mundo la da. No se turbe vuestro corazón, ni tenga miedo."
```

📖 **Más ejemplos en**: `EJEMPLOS_USO.md` (10 casos de uso reales)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para agregar nuevos temas o referencias:

1. Edita `src/data/temasVersiculos.js`
2. Agrega el nuevo tema con sus referencias
3. Prueba la funcionalidad
4. Envía un pull request

## 📝 Notas

- La aplicación requiere conexión a internet para obtener los versículos
- Los versículos se obtienen en tiempo real desde la API
- La versión utilizada es Reina Valera 1960 (RV1960)
- El sistema de búsqueda es flexible y reconoce variaciones de los temas

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 💰 Costos de la IA

### 🎉 100% GRATIS con Google Gemini

| Uso | Costo |
|-----|-------|
| 1,500 búsquedas/día | **$0 (GRATIS)** |
| 45,000 búsquedas/mes | **$0 (GRATIS)** |
| Sin límite mensual | **$0 (GRATIS)** |

**Google Gemini es completamente GRATIS:**
- ✅ Sin tarjeta de crédito
- ✅ 15 solicitudes por minuto
- ✅ 1,500 solicitudes por día
- ✅ Sin cargos ocultos

### ⚠️ Si alcanzas el límite diario

La app funciona perfectamente con fallback automático:
- ✅ Búsqueda tradicional
- ✅ 144 versículos disponibles
- ✅ Funciona con palabras clave

## 🙏 Agradecimientos

- Bible API (https://bible-api.deno.dev) por proporcionar acceso gratuito a la Biblia
- Google Gemini por su API de inteligencia artificial GRATUITA
- Comunidad de React Native y Expo
- Todos los que contribuyen a hacer esta aplicación mejor

---

**Hecho con ❤️ y 🤖 para compartir la Palabra de Dios**
