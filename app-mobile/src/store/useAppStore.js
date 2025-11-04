import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@biblia_help_favorites';
const HISTORY_KEY = '@biblia_help_history';
const THEME_KEY = '@biblia_help_theme';
const USER_KEY = '@biblia_help_user';

export const useAppStore = create((set, get) => ({
  // Estado
  favorites: [],
  history: [],
  theme: 'claro',
  isLoading: false,
  user: null,

  // Cargar datos persistidos
  loadPersistedData: async () => {
    try {
      const [favoritesData, historyData, themeData, userData] = await Promise.all([
        AsyncStorage.getItem(FAVORITES_KEY),
        AsyncStorage.getItem(HISTORY_KEY),
        AsyncStorage.getItem(THEME_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      set({
        favorites: favoritesData ? JSON.parse(favoritesData) : [],
        history: historyData ? JSON.parse(historyData) : [],
        theme: themeData || 'claro',
        user: userData ? JSON.parse(userData) : null,
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  },

  // Favoritos
  addFavorite: async (verse) => {
    const { favorites } = get();
    const exists = favorites.some(v => v.referencia === verse.referencia);
    
    if (!exists) {
      const newFavorites = [...favorites, { ...verse, addedAt: Date.now() }];
      set({ favorites: newFavorites });
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }
  },

  removeFavorite: async (referencia) => {
    const { favorites } = get();
    const newFavorites = favorites.filter(v => v.referencia !== referencia);
    set({ favorites: newFavorites });
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  },

  isFavorite: (referencia) => {
    const { favorites } = get();
    return favorites.some(v => v.referencia === referencia);
  },

  // Historial
  addToHistory: async (verse, searchTerm) => {
    const { history } = get();
    const newHistory = [
      { ...verse, searchTerm, timestamp: Date.now() },
      ...history.slice(0, 49), // Mantener solo los últimos 50
    ];
    set({ history: newHistory });
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  },

  clearHistory: async () => {
    set({ history: [] });
    await AsyncStorage.removeItem(HISTORY_KEY);
  },

  // Tema
  toggleTheme: async () => {
    const { theme } = get();
    const newTheme = theme === 'claro' ? 'oscuro' : 'claro';
    set({ theme: newTheme });
    await AsyncStorage.setItem(THEME_KEY, newTheme);
  },

  setTheme: async (theme) => {
    set({ theme });
    await AsyncStorage.setItem(THEME_KEY, theme);
  },

  // Loading
  setLoading: (isLoading) => set({ isLoading }),

  // Usuario
  setUser: async (user) => {
    set({ user });
    if (user) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(USER_KEY);
    }
  },

  clearUser: async () => {
    set({ user: null });
    await AsyncStorage.removeItem(USER_KEY);
  },
}));
