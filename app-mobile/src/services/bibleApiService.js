import axios from 'axios';

const URL_BASE_API = 'https://bible-api.deno.dev/api';
const VERSION_BIBLIA = 'rv1960'; // Reina Valera 1960
const TIMEOUT_API = 8000; // 8 segundos

/**
 * Obtiene un versículo o rango de versículos desde la API de la Biblia
 * @param {string} libro - Nombre del libro (ej: 'juan', 'salmos')
 * @param {number} capitulo - Número del capítulo
 * @param {string|number} versiculo - Número del versículo o rango (ej: '16' o '6-7')
 * @returns {Promise<Object>} - Objeto con success y data o error
 */
export const obtenerVersiculo = async (libro, capitulo, versiculo) => {
  try {
    // Validar parámetros
    if (!libro || !capitulo || !versiculo) {
      return {
        success: false,
        error: 'Parámetros inválidos para obtener versículo',
      };
    }

    const url = `${URL_BASE_API}/read/${VERSION_BIBLIA}/${libro}/${capitulo}/${versiculo}`;
    const respuesta = await axios.get(url, { timeout: TIMEOUT_API });
    
    return {
      success: true,
      data: respuesta.data,
    };
  } catch (error) {
    console.error('Error al obtener versículo:', error);
    
    let mensajeError = 'Error al obtener el versículo';
    
    if (error.response?.status === 404) {
      mensajeError = 'Versículo no encontrado';
    } else if (error.code === 'ECONNABORTED') {
      mensajeError = 'Tiempo de espera agotado';
    }
    
    return {
      success: false,
      error: mensajeError,
    };
  }
};

/**
 * Formatea la respuesta de la API para mostrarla en la interfaz
 * @param {Object|Array} respuestaApi - Respuesta de la API
 * @param {string} libro - Nombre del libro
 * @param {number} capitulo - Número del capítulo
 * @returns {Object} - Objeto formateado con referencia y texto
 */
export const formatearVersiculo = (respuestaApi, libro, capitulo) => {
  // Si es un array (múltiples versículos)
  if (Array.isArray(respuestaApi)) {
    const textoVersiculos = respuestaApi.map(v => v.verse).join(' ');
    const numerosVersiculos = respuestaApi.map(v => v.number);
    const referencia = numerosVersiculos.length > 1 
      ? `${capitalizarPrimeraLetra(libro)} ${capitulo}:${numerosVersiculos[0]}-${numerosVersiculos[numerosVersiculos.length - 1]}`
      : `${capitalizarPrimeraLetra(libro)} ${capitulo}:${numerosVersiculos[0]}`;
    
    return {
      referencia: `${referencia} RV1960`,
      texto: textoVersiculos,
    };
  }
  
  // Si es un solo versículo
  return {
    referencia: `${capitalizarPrimeraLetra(libro)} ${capitulo}:${respuestaApi.number} RV1960`,
    texto: respuestaApi.verse,
  };
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} texto - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 */
const capitalizarPrimeraLetra = (texto) => {
  return texto
    .split('-')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
};
