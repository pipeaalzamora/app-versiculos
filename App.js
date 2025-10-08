import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { buscarTemasPorPalabra, buscarTemasPorArray } from './src/data/temasVersiculos.js';
import { obtenerVersiculo, formatearVersiculo } from './src/services/bibleApiService.js';
import { sugerirVersiculos } from './src/services/geminiService.js';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentVerse, setCurrentVerse] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Función para seleccionar una referencia aleatoria del array
  const getRandomReference = (referencias) => {
    const randomIndex = Math.floor(Math.random() * referencias.length);
    return referencias[randomIndex];
  };

  // Función principal de búsqueda con manejo de errores
  const handleSearch = async () => {
    try {
      // Validar que searchTerm no esté vacío
      if (!searchTerm.trim()) {
        setSearchMessage('Por favor ingresa cómo te sientes o qué necesitas');
        setCurrentVerse(null);
        return;
      }

      setIsLoading(true);
      setSearchMessage('');
      setCurrentVerse(null);

      // Paso 1: Pedir a la IA que sugiera versículos específicos
      const sugerencia = await sugerirVersiculos(searchTerm);
      
      let versiculoObtenido = null;

      // Paso 2: Intentar obtener los versículos sugeridos por la IA
      if (sugerencia.success && sugerencia.versiculos.length > 0) {
        // Intentar cada versículo sugerido hasta encontrar uno válido
        for (const ref of sugerencia.versiculos) {
          const resultado = await obtenerVersiculo(
            ref.libro,
            ref.capitulo,
            ref.versiculo
          );

          if (resultado.success) {
            versiculoObtenido = formatearVersiculo(
              resultado.data,
              ref.libro,
              ref.capitulo
            );
            break; // Encontramos un versículo válido, salir del loop
          }
        }
      } else if (sugerencia.errorCode === 429) {
        // Mostrar mensaje específico para error de cuota
        console.log('Sin créditos de OpenAI, usando búsqueda tradicional');
      }

      // Paso 3: Fallback a búsqueda tradicional si la IA no funcionó
      if (!versiculoObtenido) {
        const temasEncontrados = buscarTemasPorPalabra(searchTerm);

        if (temasEncontrados.length > 0) {
          const temaSeleccionado = temasEncontrados[Math.floor(Math.random() * temasEncontrados.length)];
          const referenciaSeleccionada = getRandomReference(temaSeleccionado.referencias);

          const resultado = await obtenerVersiculo(
            referenciaSeleccionada.libro,
            referenciaSeleccionada.capitulo,
            referenciaSeleccionada.versiculo
          );

          if (resultado.success) {
            versiculoObtenido = formatearVersiculo(
              resultado.data,
              referenciaSeleccionada.libro,
              referenciaSeleccionada.capitulo
            );
          }
        }
      }

      // Mostrar resultado o mensaje de error
      if (versiculoObtenido) {
        setCurrentVerse(versiculoObtenido);
        setSearchMessage('');
      } else {
        setSearchMessage('No pude encontrar un versículo apropiado. Intenta con otras palabras.');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSearchMessage('Error al buscar versículos. Verifica tu conexión.');
      setCurrentVerse(null);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="¿Cómo te sientes? Cuéntame lo que necesitas..."
        placeholderTextColor="#95A5A6"
        value={searchTerm}
        onChangeText={setSearchTerm}
        autoFocus={true}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, isPressed && styles.buttonPressed]}
        onPress={handleSearch}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Buscar Consuelo</Text>
      </TouchableOpacity>

      <View style={styles.resultsContainer}>
        {isLoading && (
          <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
        )}
        {!isLoading && currentVerse && (
          <>
            <Text style={styles.reference}>{currentVerse.referencia}</Text>
            <Text style={styles.verseText}>{currentVerse.texto}</Text>
          </>
        )}
        {!isLoading && searchMessage && (
          <Text style={styles.message}>{searchMessage}</Text>
        )}
      </View>

      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width > 768;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isSmallDevice ? 16 : isLargeDevice ? 40 : 24,
    paddingTop: isSmallDevice ? 40 : 60,
  },
  input: {
    width: '100%',
    maxWidth: isLargeDevice ? 600 : '100%',
    height: isSmallDevice ? 50 : 56,
    borderWidth: 2,
    borderColor: '#E1E8ED',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: isSmallDevice ? 14 : 16,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: isSmallDevice ? 14 : 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 40,
    width: '100%',
    maxWidth: isLargeDevice ? 600 : '100%',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    backgroundColor: '#3A7BC8',
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  resultsContainer: {
    width: '100%',
    maxWidth: isLargeDevice ? 700 : '100%',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 4 : 8,
    marginTop: 8,
  },
  reference: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  verseText: {
    fontSize: isSmallDevice ? 18 : 20,
    color: '#34495E',
    textAlign: 'center',
    lineHeight: isSmallDevice ? 28 : 32,
    fontWeight: '400',
    paddingHorizontal: isSmallDevice ? 4 : 8,
  },
  message: {
    fontSize: isSmallDevice ? 14 : 16,
    color: '#95A5A6',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});
