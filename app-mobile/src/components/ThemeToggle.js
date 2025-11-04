import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/useAppStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();

  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  return (
    <TouchableOpacity 
      onPress={handleToggle} 
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={styles.icon}>
        {theme === 'claro' ? '🌙' : '☀️'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    fontSize: 24,
  },
});
