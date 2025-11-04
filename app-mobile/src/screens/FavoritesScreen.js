import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';
import VerseCard from '../components/VerseCard';

export default function FavoritesScreen({ navigation }) {
  const { favorites, theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textLight }]}>
            No tienes favoritos aún
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
            Toca la estrella en un versículo para guardarlo
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.referencia}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <VerseCard verse={item} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
