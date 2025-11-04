# Documento de Diseño

## Visión General

La aplicación de búsqueda de versículos bíblicos es una aplicación móvil React Native simple que permite a los usuarios buscar versículos por tema emocional y recibir contenido inspiracional aleatorio. La aplicación funciona completamente offline usando una base de datos local predefinida de versículos de la Reina Valera 1960.

## Arquitectura

### Arquitectura General
La aplicación sigue un patrón de arquitectura simple y directa:

```
┌─────────────────────────────────────┐
│           App.js (UI Layer)         │
│  - TextInput para búsqueda          │
│  - Botón "Buscar Consuelo"          │
│  - Área de resultados               │
└─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────┐
│      Lógica de Búsqueda             │
│  - Filtrado por tema                │
│  - Selección aleatoria              │
│  - Manejo de casos sin resultados   │
└─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────┐
│    src/data/versiculosTematicos.js  │
│  - Constante VERSICULOS_TEMATICOS   │
│  - Datos estáticos de versículos    │
└─────────────────────────────────────┘
```

### Tecnologías Principales
- **React Native con Expo**: Framework principal para desarrollo multiplataforma
- **JavaScript ES6+**: Lenguaje de programación
- **React Hooks**: useState para manejo de estado local
- **Axios**: Preparado para futuras integraciones de API

## Componentes e Interfaces

### Componente Principal (App.js)
El componente App será el único componente de la aplicación y contendrá:

**Estado Local:**
- `searchTerm`: String para almacenar el término de búsqueda ingresado
- `currentVerse`: Object para almacenar el versículo actual mostrado
- `searchMessage`: String para mensajes de estado (ej. "Tema no encontrado")

**Funciones Principales:**
- `handleSearch()`: Función que ejecuta la lógica de búsqueda
- `getRandomVerse(filteredVerses)`: Función que selecciona un versículo aleatorio

**Elementos de UI:**
- TextInput con placeholder "Ingresa un tema (ej. Tristeza, Fe)"
- TouchableOpacity/Button con texto "Buscar Consuelo"
- View contenedor para mostrar resultados
- Text components para referencia y texto del versículo

### Interfaz de Datos
```javascript
// Estructura del objeto versículo
{
  id: number,           // ID único numérico
  tema: string,         // Tema emocional
  referencia: string,   // Referencia bíblica (ej. "Isaías 41:10 RVR1960")
  texto: string         // Texto completo del versículo
}
```

## Modelos de Datos

### Constante VERSICULOS_TEMATICOS
Ubicación: `src/data/versiculosTematicos.js`

**Estructura:**
```javascript
export const VERSICULOS_TEMATICOS = [
  {
    id: 1,
    tema: "Tristeza",
    referencia: "Salmos 34:18 RVR1960",
    texto: "Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu."
  },
  // ... más versículos
];
```

**Temas Requeridos:**
- **Tristeza**: Versículos de consuelo para momentos de dolor
- **Soledad**: Versículos sobre la compañía de Dios
- **Miedo/Ansiedad**: Versículos sobre paz y confianza en Dios
- **Fe/Esperanza**: Versículos sobre fortaleza espiritual

**Criterios de Selección de Versículos:**
- Mínimo 10 versículos total
- Al menos 2-3 versículos por tema
- Todos de la traducción Reina Valera 1960
- Versículos reconocidos por su mensaje de aliento y consuelo

## Manejo de Errores

### Casos de Error Identificados

**1. Tema No Encontrado**
- **Trigger**: Cuando el filtro no encuentra coincidencias
- **Respuesta**: Mostrar mensaje "Tema no encontrado"
- **Implementación**: Verificar si el array filtrado está vacío

**2. Entrada Vacía**
- **Trigger**: Usuario presiona buscar sin ingresar texto
- **Respuesta**: Mostrar mensaje "Por favor ingresa un tema"
- **Implementación**: Validar que searchTerm no esté vacío

**3. Error en Datos**
- **Trigger**: Problema al importar VERSICULOS_TEMATICOS
- **Respuesta**: Mensaje de error técnico
- **Implementación**: Try-catch en la importación

### Estrategia de Manejo
```javascript
// Ejemplo de manejo de errores
const handleSearch = () => {
  try {
    if (!searchTerm.trim()) {
      setSearchMessage("Por favor ingresa un tema");
      return;
    }
    
    const filtered = VERSICULOS_TEMATICOS.filter(/* lógica */);
    
    if (filtered.length === 0) {
      setSearchMessage("Tema no encontrado");
      setCurrentVerse(null);
      return;
    }
    
    // Lógica de selección exitosa
  } catch (error) {
    setSearchMessage("Error al buscar versículos");
  }
};
```

## Estrategia de Pruebas

### Pruebas Unitarias
**Funciones a Probar:**
- Lógica de filtrado por tema (case-insensitive)
- Función de selección aleatoria
- Validación de entrada vacía
- Manejo de casos sin resultados

### Pruebas de Integración
**Flujos a Probar:**
- Flujo completo de búsqueda exitosa
- Flujo de búsqueda sin resultados
- Importación correcta de datos locales

### Pruebas de UI
**Elementos a Probar:**
- Renderizado correcto de componentes
- Interacción con TextInput
- Respuesta al presionar botón
- Visualización de resultados

### Pruebas Manuales
**Escenarios de Prueba:**
- Búsqueda con cada tema disponible
- Búsqueda con términos inexistentes
- Búsqueda con entrada vacía
- Verificación de aleatoriedad en resultados
- Prueba en diferentes dispositivos (iOS/Android)

## Consideraciones de Rendimiento

### Optimizaciones Implementadas
- **Datos Estáticos**: No hay llamadas a red, todos los datos son locales
- **Filtrado Simple**: Operación O(n) sobre array pequeño (<20 elementos)
- **Estado Mínimo**: Solo el estado necesario para la funcionalidad

### Escalabilidad Futura
- **Preparación para API**: Axios ya instalado para futuras integraciones
- **Estructura Modular**: Fácil separación de lógica de datos si se requiere
- **Extensión de Temas**: Estructura permite agregar nuevos temas fácilmente

## Decisiones de Diseño

### Selección de Tecnología
**React Native + Expo**: Elegido por simplicidad de configuración y capacidad multiplataforma sin configuración nativa compleja.

### Patrón de Datos
**Constante JavaScript vs JSON**: Se eligió constante exportada para mejor integración con el bundler de Expo y evitar problemas de importación de assets.

### Algoritmo de Búsqueda
**Filtro Simple**: Se usa `filter()` con `includes()` case-insensitive por simplicidad y suficiencia para el volumen de datos.

### Selección Aleatoria
**Math.random()**: Suficiente para la funcionalidad requerida, no se necesita aleatoriedad criptográficamente segura.

### Interfaz Minimalista
**Single Screen**: Una sola pantalla cumple todos los requisitos sin complejidad innecesaria de navegación.