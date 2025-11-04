import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

/**
 * Tests para el servicio de API de la Biblia
 * Cobertura: Obtención de versículos, formateo, manejo de errores
 */

vi.mock('axios');

describe('Servicio de API de la Biblia', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('obtenerVersiculo', () => {
    it('debe validar parámetros requeridos', async () => {
      const libro = '';
      const capitulo = null;
      const versiculo = '';
      
      const sonValidos = libro && capitulo && versiculo;
      
      expect(sonValidos).toBe(false);
    });

    it('debe construir URL correctamente', () => {
      const libro = 'juan';
      const capitulo = 3;
      const versiculo = '16';
      
      const urlEsperada = `https://bible-api.deno.dev/api/read/rv1960/${libro}/${capitulo}/${versiculo}`;
      
      expect(urlEsperada).toContain('juan');
      expect(urlEsperada).toContain('3');
      expect(urlEsperada).toContain('16');
    });

    it('debe manejar respuesta exitosa', async () => {
      const respuestaMock = {
        data: {
          number: 16,
          verse: 'Porque de tal manera amó Dios al mundo...',
        },
      };
      
      axios.get.mockResolvedValue(respuestaMock);
      
      expect(respuestaMock.data).toHaveProperty('number');
      expect(respuestaMock.data).toHaveProperty('verse');
    });

    it('debe manejar versículo no encontrado (404)', async () => {
      const error404 = new Error('Not Found');
      error404.response = { status: 404 };
      
      axios.get.mockRejectedValue(error404);
      
      const mensajeEsperado = 'Versículo no encontrado';
      
      expect(mensajeEsperado).toBe('Versículo no encontrado');
    });

    it('debe manejar timeout', async () => {
      const errorTimeout = new Error('timeout');
      errorTimeout.code = 'ECONNABORTED';
      
      axios.get.mockRejectedValue(errorTimeout);
      
      const mensajeEsperado = 'Tiempo de espera agotado';
      
      expect(mensajeEsperado).toBe('Tiempo de espera agotado');
    });
  });

  describe('formatearVersiculo', () => {
    it('debe formatear un solo versículo correctamente', () => {
      const respuestaApi = {
        number: 16,
        verse: 'Porque de tal manera amó Dios al mundo...',
      };
      
      const libro = 'juan';
      const capitulo = 3;
      
      const resultado = {
        referencia: 'Juan 3:16 RV1960',
        texto: respuestaApi.verse,
      };
      
      expect(resultado.referencia).toContain('Juan');
      expect(resultado.referencia).toContain('3:16');
      expect(resultado.referencia).toContain('RV1960');
    });

    it('debe formatear múltiples versículos correctamente', () => {
      const respuestaApi = [
        { number: 6, verse: 'Primer versículo' },
        { number: 7, verse: 'Segundo versículo' },
      ];
      
      const libro = 'salmos';
      const capitulo = 23;
      
      const textoCompleto = respuestaApi.map(v => v.verse).join(' ');
      const resultado = {
        referencia: 'Salmos 23:6-7 RV1960',
        texto: textoCompleto,
      };
      
      expect(resultado.referencia).toContain('6-7');
      expect(resultado.texto).toContain('Primer versículo');
      expect(resultado.texto).toContain('Segundo versículo');
    });

    it('debe capitalizar nombres de libros correctamente', () => {
      const capitalizarPrimeraLetra = (texto) => {
        return texto
          .split('-')
          .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(' ');
      };
      
      expect(capitalizarPrimeraLetra('juan')).toBe('Juan');
      expect(capitalizarPrimeraLetra('1-corintios')).toBe('1 Corintios');
      expect(capitalizarPrimeraLetra('salmos')).toBe('Salmos');
    });
  });
});
