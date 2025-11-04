import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/useAppStore';

export default function FavoriteButton({ verse, size = 24, color = '#4A90E2' }) {
  const { isFavorite, addFavorite, removeFavorite } = useAppStore();
  const favorite = isFavorite(verse?.referencia);

  const handlePress = async () => {
    if (!verse) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (favorite) {
      removeFavorite(verse.referencia);
    } else {
      addFavorite(verse);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={[styles.icon, { fontSize: size, color }]}>
        {favorite ? '★' : '☆'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    fontWeight: 'bold',
  },
});
