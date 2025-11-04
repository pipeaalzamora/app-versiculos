import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';
import { guardarVersiculo } from '../services/savedVersesService';

export default function SaveButton({ versiculo, palabraAliento, busqueda }) {
  const { user, theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;
  const [guardando, setGuardando] = useState(false);

  const handleSave = async () => {
    if (!user) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión con Google para guardar versículos'
      );
      return;
    }

    setGuardando(true);
    
    const resultado = await guardarVersiculo(
      user.uid,
      user.email,
      versiculo,
      palabraAliento,
      busqueda
    );

    setGuardando(false);

    if (resultado.success) {
      Alert.alert('¡Guardado!', 'El versículo se guardó correctamente');
    } else {
      Alert.alert('Error', resultado.error || 'No se pudo guardar el versículo');
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.primary },
        guardando && styles.buttonDisabled
      ]}
      onPress={handleSave}
      disabled={guardando}
    >
      <Text style={styles.buttonText}>
        {guardando ? '💾 Guardando...' : '💾 Guardar'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
