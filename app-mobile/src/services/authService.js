import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { 
  GoogleAuthProvider, 
  signInWithCredential,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

/**
 * Hook para autenticación con Google
 */
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'TU_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'TU_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'TU_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  return { request, response, promptAsync };
};

/**
 * Iniciar sesión con Google
 */
export const signInWithGoogle = async (idToken) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    return {
      success: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        firstName: result.user.displayName?.split(' ')[0] || 'Amigo',
      }
    };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Cerrar sesión
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Obtener usuario actual
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
