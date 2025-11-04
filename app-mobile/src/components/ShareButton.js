import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Share, Alert } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';

export default function ShareButton({ versiculo, palabraAliento }) {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  const handleShare = async () => {
    try {
      let mensaje = '';
      
      if (palabraAliento) {
        mensaje += `📖 Palabra de Aliento\n\n${palabraAliento}\n\n`;
      }
      
      if (versiculo) {
        mensaje += `✝️ ${versiculo.texto}\n\n— ${versiculo.referencia}`;
      }
      
      mensaje += '\n\n🙏 Compartido desde Biblia Help';

      const result = await Share.share({
        message: mensaje,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Compartido con:', result.activityType);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el contenido');
      console.error('Error al compartir:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.primary }]}
      onPress={handleShare}
    >
      <Text style={styles.buttonText}>📤 Compartir</Text>
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
