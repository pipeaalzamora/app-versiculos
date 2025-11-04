import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';

export default function ShareButton({ verse, style }) {
  const handleShare = async () => {
    if (!verse) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const message = `"${verse.texto}"\n\n${verse.referencia}`;

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync('data:text/plain;base64,' + btoa(message), {
          mimeType: 'text/plain',
          dialogTitle: 'Compartir versículo',
        });
      } else {
        Alert.alert('Compartir no disponible', 'No se puede compartir en este dispositivo');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      Alert.alert('Error', 'No se pudo compartir el versículo');
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleShare} 
      style={[styles.button, style]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={styles.icon}>↗</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    fontSize: 24,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});
