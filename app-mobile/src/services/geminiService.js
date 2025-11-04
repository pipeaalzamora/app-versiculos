import axios from 'axios';
import { CONFIGURACION } from '../config/constantes';

/**
 * Analiza el texto del usuario y sugiere versículos específicos usando el backend
 * @param {string} entradaUsuario - Texto ingresado por el usuario
 * @returns {Promise<Object>} - Objeto con versículos sugeridos
 */
export const sugerirVersiculos = async (entradaUsuario) => {
  try {
    // Validar entrada antes de enviar
    if (!entradaUsuario || typeof entradaUsuario !== 'string') {
      return {
        success: false,
        error: 'Entrada inválida',
        versiculos: [],
      };
    }

    if (entradaUsuario.length > 500) {
      return {
        success: false,
        error: 'El texto es demasiado largo. Máximo 500 caracteres.',
        versiculos: [],
      };
    }

    const respuesta = await axios.post(
      `${CONFIGURACION.URL_BACKEND}/api/suggest-verses`,
      { userInput: entradaUsuario },
      { 
        timeout: CONFIGURACION.TIMEOUT_API,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return respuesta.data;
  } catch (error) {
    console.error('Error al sugerir versículos:', error);
    
    let mensajeError = 'Error al conectar con el servidor';
    let codigoError = null;
    
    if (error.response) {
      mensajeError = error.response.data?.error || mensajeError;
      codigoError = error.response.status;
    } else if (error.request) {
      mensajeError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else if (error.code === 'ECONNABORTED') {
      mensajeError = 'La petición tardó demasiado. Intenta de nuevo.';
    }
    
    return {
      success: false,
      error: mensajeError,
      codigoError,
      versiculos: [],
    };
  }
};
