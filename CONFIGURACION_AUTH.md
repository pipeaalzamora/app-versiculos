# Configuración de Google Auth y MongoDB

## 1. Crear Cluster en MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo cluster (Free tier es suficiente)
4. Configura acceso de red:
   - Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0)
5. Crea un usuario de base de datos:
   - Database Access > Add New Database User
   - Username y password (guárdalos)

## 2. Obtener Connection String de MongoDB

1. En tu cluster, haz clic en "Connect"
2. Selecciona "Connect your application"
3. Copia el connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Reemplaza `<username>` y `<password>` con tus credenciales
5. Agrega la variable de entorno en Vercel:
   - Ve a tu proyecto en Vercel
   - Settings > Environment Variables
   - Agrega: `MONGODB_URI` con tu connection string

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

## 5. Configurar MongoDB en Local (Desarrollo)

Para desarrollo local, crea un archivo `.env` en la carpeta `backend`:

```bash
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/biblia_help?retryWrites=true&w=majority
GEMINI_API_KEY=tu_api_key_de_gemini
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
✅ Guardar versículos en MongoDB Atlas
✅ Avatar y nombre del usuario en el header
✅ Botón de guardar versículos (requiere login)

## Próximos Pasos

1. Configurar MongoDB Atlas según las instrucciones
2. Obtener los Client IDs de Google OAuth
3. Actualizar las credenciales en los archivos correspondientes
4. Agregar MONGODB_URI a las variables de entorno de Vercel
5. Probar el login en la app
6. Probar guardar versículos

## APIs del Backend

### POST /api/save-verse
Guarda un versículo en MongoDB
```json
{
  "userId": "google_user_id",
  "userEmail": "user@gmail.com",
  "versiculo": { "texto": "...", "referencia": "..." },
  "palabraAliento": "mensaje pastoral...",
  "busqueda": "texto de búsqueda"
}
```

### GET /api/get-saved-verses?userId=xxx
Obtiene los versículos guardados del usuario

### DELETE /api/delete-saved-verse
Elimina un versículo guardado
```json
{
  "id": "mongodb_id",
  "userId": "google_user_id"
}
```
