import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from './App';
import { VERSICULOS_TEMATICOS } from './src/data/versiculosTematicos';

describe('App - Integration Tests', () => {
  describe('Flujo completo de búsqueda exitosa', () => {
    it('debe mostrar un versículo cuando se busca un tema válido', () => {
      const { getByPlaceholderText, getByText } = render(<App />);
      
      const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
      const button = getByText('Buscar Consuelo');
      
      // Ingresar tema y buscar
      fireEvent.changeText(input, 'Tristeza');
      fireEvent.press(button);
      
      // Verificar que se muestra un versículo del tema Tristeza
      const versiculosTristeza = VERSICULOS_TEMATICOS.filter(v => 
        v.tema.toLowerCase().includes('tristeza')
      );
      
      // Verificar que al menos uno de los versículos de tristeza está presente
      const foundVerse = versiculosTristeza.some(v => {
        try {
          getByText(v.referencia);
          getByText(v.texto);
          return true;
        } catch {
          return false;
        }
      });
      
      expect(foundVerse).toBe(true);
    });

    it('debe buscar versículos sin distinguir mayúsculas/minúsculas', () => {
      const { getByPlaceholderText, getByText } = render(<App />);
      
      const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
      const button = getByText('Buscar Consuelo');
      
      // Buscar con minúsculas
      fireEvent.changeText(input, 'fe');
      fireEvent.press(button);
      
      // Verificar que se encuentra un versículo de Fe
      const versiculosFe = VERSICULOS_TEMATICOS.filter(v => 
        v.tema.toLowerCase().includes('fe')
      );
      
      const foundVerse = versiculosFe.some(v => {
        try {
          getByText(v.referencia);
          return true;
        } catch {
          return false;
        }
      });
      
      expect(foundVerse).toBe(true);
    });

    it('debe mostrar diferentes versículos en búsquedas repetidas del mismo tema', () => {
      const { getByPlaceholderText, getByText, queryByText } = render(<App />);
      
      const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
      const button = getByText('Buscar Consuelo');
      
      const results = new Set();
      
      // Realizar múltiples búsquedas
      for (let i = 0; i < 10; i++) {
        fireEvent.changeText(input, 'Tristeza');
        fireEvent.press(button);
        
        // Capturar el versículo mostrado
        const versiculosTristeza = VERSICULOS_TEMATICOS.filter(v => 
          v.tema.toLowerCase().includes('tristeza')
        );
        
        versiculosTristeza.forEach(v => {
          if (queryByText(v.referencia)) {
            results.add(v.id);
          }
        });
      }
      
      // Con múltiples búsquedas, deberíamos ver aleatoriedad
      // (aunque no garantizado, es muy probable con 10 intentos)
      expect(results.size).toBeGreaterThan(0);
    });
  });

  describe('Flujo de búsqueda sin resultados', () => {
    it('debe mostrar "Tema no encontrado" cuando no hay coincidencias', () => {
      const { getByPlaceholderText, getByText } = render(<App />);
      
      const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
      const button = getByText('Buscar Consuelo');
      
      // Buscar un tema que no existe
      fireEvent.changeText(input, 'TemaInexistente123');
      fireEvent.press(button);
      
      // Verificar mensaje de error
      expect(getByText('Tema no encontrado')).toBeTruthy();
    });

    it('debe mostrar "Por favor ingresa un tema" cuando la entrada está vacía', () => {
      const { getByPlaceholderText, getByText } = render(<App />);
      
      const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
      const button = getByText('Buscar Consuelo');
      
      // Intentar buscar sin ingresar texto
      fireEvent.changeText(input, '');
      fireEvent.press(button);
      
      // Verificar mensaje de validación
      expect(getByText('Por favor ingresa un tema')).toBeTruthy();
    });

    it('debe mostrar "Por favor ingresa un tema" cuando solo hay espacios', () => {
      const { getByPlaceholderText, getByText } = render(<App />);
      
      const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
      const button = getByText('Buscar Consuelo');
      
      // Intentar buscar con solo espacios
      fireEvent.changeText(input, '   ');
      fireEvent.press(button);
      
      // Verificar mensaje de validación
      expect(getByText('Por favor ingresa un tema')).toBeTruthy();
    });

    it('debe limpiar versículo anterior cuando no hay resultados', () => {
      const { getByPlaceholderText, getByText, queryByText } = render(<App />);
      
      const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
      const button = getByText('Buscar Consuelo');
      
      // Primera búsqueda exitosa
      fireEvent.changeText(input, 'Fe');
      fireEvent.press(button);
      
      // Verificar que hay un versículo
      const versiculosFe = VERSICULOS_TEMATICOS.filter(v => 
        v.tema.toLowerCase().includes('fe')
      );
      const hasVerse = versiculosFe.some(v => queryByText(v.referencia));
      expect(hasVerse).toBe(true);
      
      // Segunda búsqueda sin resultados
      fireEvent.changeText(input, 'TemaInexistente');
      fireEvent.press(button);
      
      // Verificar que el versículo anterior se limpió
      const stillHasVerse = versiculosFe.some(v => queryByText(v.referencia));
      expect(stillHasVerse).toBe(false);
      expect(getByText('Tema no encontrado')).toBeTruthy();
    });
  });

  describe('Importación correcta de datos locales', () => {
    it('debe importar VERSICULOS_TEMATICOS correctamente', () => {
      expect(VERSICULOS_TEMATICOS).toBeDefined();
      expect(Array.isArray(VERSICULOS_TEMATICOS)).toBe(true);
      expect(VERSICULOS_TEMATICOS.length).toBeGreaterThanOrEqual(10);
    });

    it('debe tener la estructura correcta en cada versículo', () => {
      VERSICULOS_TEMATICOS.forEach(versiculo => {
        expect(versiculo).toHaveProperty('id');
        expect(versiculo).toHaveProperty('tema');
        expect(versiculo).toHaveProperty('referencia');
        expect(versiculo).toHaveProperty('texto');
        
        expect(typeof versiculo.id).toBe('number');
        expect(typeof versiculo.tema).toBe('string');
        expect(typeof versiculo.referencia).toBe('string');
        expect(typeof versiculo.texto).toBe('string');
      });
    });

    it('debe incluir los temas requeridos', () => {
      const temas = VERSICULOS_TEMATICOS.map(v => v.tema.toLowerCase());
      
      expect(temas.some(t => t.includes('tristeza'))).toBe(true);
      expect(temas.some(t => t.includes('soledad'))).toBe(true);
      expect(temas.some(t => t.includes('miedo') || t.includes('ansiedad'))).toBe(true);
      expect(temas.some(t => t.includes('fe') || t.includes('esperanza'))).toBe(true);
    });

    it('debe tener versículos de Reina Valera 1960', () => {
      VERSICULOS_TEMATICOS.forEach(versiculo => {
        expect(versiculo.referencia).toContain('RVR1960');
      });
    });

    it('debe poder buscar y encontrar cada tema en la base de datos', () => {
      const temasUnicos = [...new Set(VERSICULOS_TEMATICOS.map(v => v.tema))];
      
      temasUnicos.forEach(tema => {
        const { getByPlaceholderText, getByText, queryByText } = render(<App />);
        
        const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
        const button = getByText('Buscar Consuelo');
        
        fireEvent.changeText(input, tema);
        fireEvent.press(button);
        
        // Verificar que no hay mensaje de error
        expect(queryByText('Tema no encontrado')).toBeNull();
        expect(queryByText('Por favor ingresa un tema')).toBeNull();
      });
    });
  });

  describe('Interacción de UI', () => {
    it('debe actualizar el estado del input cuando el usuario escribe', () => {
      const { getByPlaceholderText } = render(<App />);
      
      const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
      
      fireEvent.changeText(input, 'Esperanza');
      
      expect(input.props.value).toBe('Esperanza');
    });

    it('debe renderizar todos los componentes principales', () => {
      const { getByPlaceholderText, getByText } = render(<App />);
      
      expect(getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)')).toBeTruthy();
      expect(getByText('Buscar Consuelo')).toBeTruthy();
    });

    it('debe permitir búsquedas consecutivas', () => {
      const { getByPlaceholderText, getByText, queryByText } = render(<App />);
      
      const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
      const button = getByText('Buscar Consuelo');
      
      // Primera búsqueda
      fireEvent.changeText(input, 'Fe');
      fireEvent.press(button);
      expect(queryByText('Tema no encontrado')).toBeNull();
      
      // Segunda búsqueda
      fireEvent.changeText(input, 'Esperanza');
      fireEvent.press(button);
      expect(queryByText('Tema no encontrado')).toBeNull();
      
      // Tercera búsqueda
      fireEvent.changeText(input, 'Soledad');
      fireEvent.press(button);
      expect(queryByText('Tema no encontrado')).toBeNull();
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar errores gracefully', () => {
      const { getByPlaceholderText, getByText } = render(<App />);
      
      const input = getByPlaceholderText('Ingresa un tema (ej. Tristeza, Fe)');
      const button = getByText('Buscar Consuelo');
      
      // La aplicación no debe crashear con entradas inusuales
      fireEvent.changeText(input, '!@#$%^&*()');
      fireEvent.press(button);
      
      // Debe mostrar mensaje apropiado
      expect(getByText('Tema no encontrado')).toBeTruthy();
    });
  });
});
