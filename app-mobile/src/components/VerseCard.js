import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FavoriteButton from './FavoriteButton';
import ShareButton from './ShareButton';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';

export default function VerseCard({ verse }) {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  if (!verse) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.reference, { color: colors.text }]}>
          {verse.referencia}
        </Text>
        <View style={styles.actions}>
          <FavoriteButton verse={verse} color={colors.primary} />
          <ShareButton verse={verse} />
        </View>
      </View>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {verse.texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reference: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '400',
  },
});
