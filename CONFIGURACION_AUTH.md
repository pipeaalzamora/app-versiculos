# Configuración de Google Auth y Firebase

## 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Authentication > Sign-in method > Google
4. Habilita Firestore Database

## 2. Obtener Credenciales de Firebase

En la configuración del proyecto de Firebase:

1. Ve a Project Settings (⚙️)
2. En "Your apps", agrega una app web
3. Copia las credenciales y pégalas en `app-mobile/src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 3. Configurar Google OAuth

### Para Android:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto de Firebase
3. Ve a APIs & Services > Credentials
4. Crea OAuth 2.0 Client ID para Android:
   - Application type: Android
   - Package name: `com.pipeaalzamora.bibliahelp`
   - SHA-1: Obtén con `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`

### Para iOS:

1. En Google Cloud Console, crea OAuth 2.0 Client ID para iOS:
   - Application type: iOS
   - Bundle ID: `com.pipeaalzamora.bibliahelp`

### Para Web (Expo):

1. Crea OAuth 2.0 Client ID para Web application
2. Authorized redirect URIs: `https://auth.expo.io/@tu-usuario/biblia-help-mobile`

## 4. Actualizar Configuración en el Código

Actualiza `app-mobile/src/components/GoogleSignInButton.js`:

```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: 'TU_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'TU_IOS_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'TU_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

## 5. Configurar Firestore Rules

En Firebase Console > Firestore Database > Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /versiculos_guardados/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 6. Actualizar app.config.js

Agrega el esquema de autenticación:

```javascript
export default {
  expo: {
    // ... configuración existente
    scheme: "bibliahelp",
  }
}
```

## 7. Probar la Autenticación

```bash
cd app-mobile
npx expo start -c
```

## Funcionalidades Implementadas

✅ Login con Google
✅ Placeholder personalizado: "Desahógate con Dios, [Nombre]"
✅ Mensaje de IA personalizado con el nombre del usuario
✅ Botón para compartir versículos y palabras de aliento
✅ Guardar versículos en Firestore (preparado, requiere configuración)
✅ Avatar y nombre del usuario en el header

## Próximos Pasos

1. Configurar Firebase según las instrucciones
2. Obtener los Client IDs de Google OAuth
3. Actualizar las credenciales en los archivos correspondientes
4. Probar el login en la app
5. Implementar la funcionalidad de guardar favoritos en Firestore
