import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const { user, setUser, clearUser, theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'TU_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'TU_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'TU_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      getUserInfo(authentication.accessToken);
    }
  }, [response]);

  const getUserInfo = async (token) => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await response.json();
      
      const userData = {
        uid: userInfo.id,
        email: userInfo.email,
        displayName: userInfo.name,
        photoURL: userInfo.picture,
        firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || 'Amigo',
      };
      
      await setUser(userData);
    } catch (error) {
      console.error('Error obteniendo info del usuario:', error);
    }
  };

  const handleSignOut = async () => {
    await clearUser();
  };

  if (user) {
    return (
      <View style={styles.userContainer}>
        {user.photoURL && (
          <Image 
            source={{ uri: user.photoURL }} 
            style={styles.avatar}
          />
        )}
        <Text style={[styles.userName, { color: colors.text }]}>
          {user.firstName}
        </Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={[styles.signOutText, { color: colors.textLight }]}>
            Salir
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.surface }]}
      onPress={() => promptAsync()}
      disabled={!request}
    >
      <Text style={[styles.buttonText, { color: colors.text }]}>
        🔐 Iniciar con Google
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  signOutText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
