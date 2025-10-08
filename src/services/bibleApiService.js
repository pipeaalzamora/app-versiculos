import axios from 'axios';

const API_BASE_URL = 'https://bible-api.deno.dev/api';
const VERSION = 'rv1960'; // Reina Valera 1960

/**
 * Obtiene un versículo o rango de versículos desde la API
 * @param {string} libro - Nombre del libro (ej: 'juan', 'salmos')
 * @param {number} capitulo - Número del capítulo
 * @param {string|number} versiculo - Número del versículo o rango (ej: '16' o '6-7')
 * @returns {Promise<Object>} - Datos del versículo
 */
export const obtenerVersiculo = async (libro, capitulo, versiculo) => {
  try {
    const url = `${API_BASE_URL}/read/${VERSION}/${libro}/${capitulo}/${versiculo}`;
    const response = await axios.get(url);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error al obtener versículo:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Formatea la respuesta de la API para mostrarla en la UI
 * @param {Object|Array} apiResponse - Respuesta de la API
 * @param {string} libro - Nombre del libro
 * @param {number} capitulo - Número del capítulo
 * @returns {Object} - Objeto formateado con referencia y texto
 */
export const formatearVersiculo = (apiResponse, libro, capitulo) => {
  // Si es un array (múltiples versículos)
  if (Array.isArray(apiResponse)) {
    const versiculos = apiResponse.map(v => v.verse).join(' ');
    const numeros = apiResponse.map(v => v.number);
    const referencia = numeros.length > 1 
      ? `${capitalizarPrimeraLetra(libro)} ${capitulo}:${numeros[0]}-${numeros[numeros.length - 1]}`
      : `${capitalizarPrimeraLetra(libro)} ${capitulo}:${numeros[0]}`;
    
    return {
      referencia: `${referencia} RV1960`,
      texto: versiculos,
    };
  }
  
  // Si es un solo versículo
  return {
    referencia: `${capitalizarPrimeraLetra(libro)} ${capitulo}:${apiResponse.number} RV1960`,
    texto: apiResponse.verse,
  };
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} str - String a capitalizar
 * @returns {string} - String capitalizado
 */
const capitalizarPrimeraLetra = (str) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
