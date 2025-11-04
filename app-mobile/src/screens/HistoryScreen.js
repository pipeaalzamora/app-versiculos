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

export default function HistoryScreen({ navigation }) {
  const { history, clearHistory, theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  const handleClearHistory = () => {
    clearHistory();
  };

  if (history.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textLight }]}>
            No hay historial aún
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
            Tus búsquedas aparecerán aquí
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleClearHistory}
          style={[styles.clearButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.clearButtonText}>Limpiar Historial</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={history}
        keyExtractor={(item, index) => `${item.referencia}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <Text style={[styles.searchTerm, { color: colors.textLight }]}>
              Búsqueda: "{item.searchTerm}"
            </Text>
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
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  cardContainer: {
    marginBottom: 16,
  },
  searchTerm: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
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
