import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import mobileAds from 'react-native-google-mobile-ads';
import * as Haptics from 'expo-haptics';
import { buscarTemasPorPalabra } from './src/data/temasVersiculos.js';
import { obtenerVersiculo, formatearVersiculo } from './src/services/bibleApiService.js';
import { sugerirVersiculos } from './src/services/geminiService.js';
import { useAppStore } from './src/store/useAppStore';
import { TEMAS } from './src/config/constantes';
// import AdBanner from './src/components/AdBanner';
import VerseCard from './src/components/VerseCard';
import PastoralMessage from './src/components/PastoralMessage';
import ThemeToggle from './src/components/ThemeToggle';
import GoogleSignInButton from './src/components/GoogleSignInButton';
import ShareButton from './src/components/ShareButton';
import SaveButton from './src/components/SaveButton';
// import useInterstitialAd from './src/hooks/useInterstitialAd';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentVerses, setCurrentVerses] = useState([]);
  const [pastoralMessage, setPastoralMessage] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  // const { showAdIfReady} = useInterstitialAd();
  
  // Store
  const { theme, user, loadPersistedData, addToHistory } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  // Inicializar
  useEffect(() => {
    // Cargar datos persistidos
    loadPersistedData();
    
    // Inicializar AdMob (deshabilitado en desarrollo)
    // mobileAds()
    //   .initialize()
    //   .then(adapterStatuses => {
    //     console.log('AdMob inicializado:', adapterStatuses);
    //   });
  }, []);

  // Función para seleccionar una referencia aleatoria
  const getRandomReference = (referencias) => {
    const randomIndex = Math.floor(Math.random() * referencias.length);
    return referencias[randomIndex];
  };

  // Función principal de búsqueda
  const handleSearch = async () => {
    try {
      // Validar entrada
      if (!searchTerm.trim()) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setSearchMessage('Por favor cuéntame cómo te sientes o qué necesitas');
        setCurrentVerses([]);
        setPastoralMessage('');
        return;
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsLoading(true);
      setSearchMessage('');
      setCurrentVerses([]);
      setPastoralMessage('');

      // Paso 1: Intentar con IA (incluir nombre del usuario si está logueado)
      const nombreUsuario = user?.firstName || null;
      const sugerencia = await sugerirVersiculos(searchTerm, nombreUsuario);
      
      const versiculosObtenidos = [];

      // Paso 2: Procesar sugerencias de IA
      if (sugerencia.success && sugerencia.versiculos.length > 0) {
        // Obtener todos los versículos sugeridos
        for (const ref of sugerencia.versiculos) {
          const resultado = await obtenerVersiculo(
            ref.libro,
            ref.capitulo,
            ref.versiculo
          );

          if (resultado.success) {
            const versiculoFormateado = formatearVersiculo(
              resultado.data,
              ref.libro,
              ref.capitulo
            );
            versiculosObtenidos.push(versiculoFormateado);
          }
        }
        
        // Guardar el mensaje pastoral
        if (sugerencia.mensaje) {
          setPastoralMessage(sugerencia.mensaje);
        }
      }

      // Paso 3: Fallback a búsqueda tradicional (si la IA no devolvió versículos)
      if (versiculosObtenidos.length === 0) {
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
            const versiculoFormateado = formatearVersiculo(
              resultado.data,
              referenciaSeleccionada.libro,
              referenciaSeleccionada.capitulo
            );
            versiculosObtenidos.push(versiculoFormateado);
          }
        }
      }

      // Mostrar resultado
      if (versiculosObtenidos.length > 0) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCurrentVerses(versiculosObtenidos);
        setSearchMessage('');
        
        // Guardar en historial (guardar el primero como referencia)
        addToHistory(versiculosObtenidos[0], searchTerm);
        
        // Mostrar anuncio (deshabilitado en desarrollo)
        // showAdIfReady();
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setSearchMessage('No pude encontrar versículos apropiados. Intenta contarme más sobre tu situación.');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSearchMessage('Error al buscar versículos. Verifica tu conexión.');
      setCurrentVerses([]);
      setPastoralMessage('');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Biblia Help</Text>
          <View style={styles.headerRight}>
            <GoogleSignInButton />
            <ThemeToggle />
          </View>
        </View>

        <TextInput
          ref={inputRef}
          style={[
            styles.input, 
            { 
              borderColor: colors.border, 
              backgroundColor: colors.surface,
              color: colors.text,
            }
          ]}
          placeholder={
            user 
              ? `Desahógate con Dios, ${user.firstName}... Estoy aquí para escucharte` 
              : "Cuéntame cómo te sientes hoy... Estoy aquí para escucharte"
          }
          placeholderTextColor={colors.textLight}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoFocus={true}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[
            styles.button, 
            { backgroundColor: colors.primary },
            isPressed && { backgroundColor: colors.primaryDark }
          ]}
          onPress={handleSearch}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Buscando...' : 'Buscar Consuelo'}
          </Text>
        </TouchableOpacity>

        <ScrollView 
          style={styles.resultsContainer}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          )}
          
          {!isLoading && pastoralMessage && (
            <>
              <PastoralMessage mensaje={pastoralMessage} />
              <View style={styles.actionButtons}>
                <SaveButton 
                  versiculo={currentVerses[0]} 
                  palabraAliento={pastoralMessage}
                  busqueda={searchTerm}
                />
                <ShareButton 
                  versiculo={currentVerses[0]} 
                  palabraAliento={pastoralMessage} 
                />
              </View>
            </>
          )}
          
          {!isLoading && currentVerses.length > 0 && (
            <>
              {currentVerses.map((verse, index) => (
                <View key={index} style={styles.verseWrapper}>
                  <VerseCard verse={verse} />
                </View>
              ))}
            </>
          )}
          
          {!isLoading && searchMessage && (
            <Text style={[styles.message, { color: colors.textLight }]}>
              {searchMessage}
            </Text>
          )}
        </ScrollView>

        <StatusBar style={theme === 'oscuro' ? 'light' : 'dark'} />
        
        {/* AdBanner deshabilitado en desarrollo */}
        {/* <AdBanner /> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width > 768;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: isSmallDevice ? 16 : isLargeDevice ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: isLargeDevice ? 600 : '100%',
    marginBottom: 24,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    maxWidth: isLargeDevice ? 600 : '100%',
    minHeight: isSmallDevice ? 80 : 100,
    maxHeight: 150,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: isSmallDevice ? 14 : 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  resultsContainer: {
    flex: 1,
    width: '100%',
    maxWidth: isLargeDevice ? 700 : '100%',
  },
  resultsContent: {
    paddingHorizontal: isSmallDevice ? 4 : 8,
    paddingTop: 8,
    paddingBottom: 20,
  },
  verseWrapper: {
    marginBottom: 16,
  },
  message: {
    fontSize: isSmallDevice ? 14 : 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
});
