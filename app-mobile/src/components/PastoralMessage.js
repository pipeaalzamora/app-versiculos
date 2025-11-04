import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';

export default function PastoralMessage({ mensaje }) {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  if (!mensaje) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.icon, { color: colors.primary }]}>✝️</Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Palabra de Aliento
        </Text>
      </View>
      <ScrollView 
        style={styles.messageContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {mensaje}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  messageContainer: {
    maxHeight: 300,
  },
  message: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
    textAlign: 'justify',
  },
});
