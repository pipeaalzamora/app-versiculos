import axios from 'axios';
import { CONFIGURACION } from '../config/constantes';

/**
 * Guardar versículo en MongoDB
 */
export const guardarVersiculo = async (userId, userEmail, versiculo, palabraAliento, busqueda) => {
  try {
    const respuesta = await axios.post(
      `${CONFIGURACION.URL_BACKEND}/api/save-verse`,
      {
        userId,
        userEmail,
        versiculo,
        palabraAliento,
        busqueda,
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return respuesta.data;
  } catch (error) {
    console.error('Error al guardar versículo:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Error al guardar versículo',
    };
  }
};

/**
 * Obtener versículos guardados del usuario
 */
export const obtenerVersiculosGuardados = async (userId) => {
  try {
    const respuesta = await axios.get(
      `${CONFIGURACION.URL_BACKEND}/api/get-saved-verses`,
      {
        params: { userId },
        timeout: 10000,
      }
    );

    return respuesta.data;
  } catch (error) {
    console.error('Error al obtener versículos:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Error al obtener versículos',
      versiculos: [],
    };
  }
};

/**
 * Eliminar versículo guardado
 */
export const eliminarVersiculoGuardado = async (id, userId) => {
  try {
    const respuesta = await axios.delete(
      `${CONFIGURACION.URL_BACKEND}/api/delete-saved-verse`,
      {
        data: { id, userId },
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return respuesta.data;
  } catch (error) {
    console.error('Error al eliminar versículo:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Error al eliminar versículo',
    };
  }
};
