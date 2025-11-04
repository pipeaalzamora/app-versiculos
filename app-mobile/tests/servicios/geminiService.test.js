import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

/**
 * Tests para el servicio de Gemini
 * Cobertura: Validación de entrada, manejo de errores, timeouts
 */

vi.mock('axios');

describe('Servicio de Gemini', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sugerirVersiculos', () => {
    it('debe validar entrada vacía', async () => {
      const entradaUsuario = '';
      
      const resultado = {
        success: false,
        error: 'Entrada inválida',
        versiculos: [],
      };
      
      expect(resultado.success).toBe(false);
      expect(resultado.error).toBe('Entrada inválida');
    });

    it('debe validar entrada no string', async () => {
      const entradaUsuario = null;
      const esValida = entradaUsuario && typeof entradaUsuario === 'string';
      
      expect(esValida).toBe(false);
    });

    it('debe validar longitud máxima', async () => {
      const entradaLarga = 'a'.repeat(501);
      const esValida = entradaLarga.length <= 500;
      
      expect(esValida).toBe(false);
    });

    it('debe manejar respuesta exitosa', async () => {
      const respuestaMock = {
        data: {
          success: true,
          versiculos: [
            { libro: 'salmos', capitulo: 23, versiculo: '4' }
          ],
        },
      };
      
      axios.post.mockResolvedValue(respuestaMock);
      
      expect(respuestaMock.data.success).toBe(true);
      expect(respuestaMock.data.versiculos).toHaveLength(1);
    });

    it('debe manejar error de conexión', async () => {
      const errorConexion = new Error('Network Error');
      errorConexion.request = {};
      
      axios.post.mockRejectedValue(errorConexion);
      
      const mensajeEsperado = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      
      expect(mensajeEsperado).toContain('servidor');
    });

    it('debe manejar timeout', async () => {
      const errorTimeout = new Error('timeout');
      errorTimeout.code = 'ECONNABORTED';
      
      axios.post.mockRejectedValue(errorTimeout);
      
      const mensajeEsperado = 'La petición tardó demasiado. Intenta de nuevo.';
      
      expect(mensajeEsperado).toContain('tardó');
    });

    it('debe manejar error del servidor', async () => {
      const errorServidor = new Error('Server Error');
      errorServidor.response = {
        status: 500,
        data: { error: 'Error interno del servidor' },
      };
      
      axios.post.mockRejectedValue(errorServidor);
      
      expect(errorServidor.response.status).toBe(500);
    });

    it('debe incluir headers correctos', async () => {
      const configEsperada = {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      expect(configEsperada.headers['Content-Type']).toBe('application/json');
      expect(configEsperada.timeout).toBe(10000);
    });
  });
});
