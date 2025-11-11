# Despliegue en AWS App Runner

## Opción 1: Desde GitHub (Recomendado)

1. **Sube el código a GitHub**

   ```bash
   git add .
   git commit -m "Preparar para App Runner"
   git push
   ```

2. **En AWS Console:**

   - Ve a App Runner
   - Click "Create service"
   - Source: "Source code repository"
   - Conecta tu repositorio de GitHub
   - Branch: `main` o `master`
   - Build settings:
     - Runtime: Node.js 20
     - Build command: `npm ci --only=production`
     - Start command: `node server-dev.js`
     - Port: `3000`

3. **Variables de entorno:**

   - `GEMINI_API_KEY`: Tu API key de Google Gemini
   - `NODE_ENV`: `production`

4. **Configuración:**
   - CPU: 1 vCPU
   - Memory: 2 GB
   - Auto scaling: Min 1, Max 3

## Opción 2: Desde Docker (ECR)

1. **Construir imagen:**

   ```bash
   docker build -t biblia-help-backend .
   ```

2. **Probar localmente:**

   ```bash
   docker run -p 3000:3000 -e GEMINI_API_KEY=tu_key biblia-help-backend
   ```

3. **Subir a ECR:**

   ```bash
   # Autenticar con ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin TU_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

   # Crear repositorio
   aws ecr create-repository --repository-name biblia-help-backend --region us-east-1

   # Tag y push
   docker tag biblia-help-backend:latest TU_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/biblia-help-backend:latest
   docker push TU_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/biblia-help-backend:latest
   ```

4. **En App Runner:**
   - Source: "Container registry"
   - Image: Tu imagen de ECR
   - Port: 3000

## Verificar despliegue

```bash
# Obtener URL de App Runner
curl https://tu-app-runner-url.awsapprunner.com/

# Probar endpoint
curl -X POST https://tu-app-runner-url.awsapprunner.com/api/suggest-verses \
  -H "Content-Type: application/json" \
  -d '{"userInput": "me siento triste"}'
```

## Costos estimados

- **App Runner**: ~$0.007/hora con 1 vCPU y 2GB RAM
- **Tráfico**: Primeros 100GB gratis/mes
- **Build**: Gratis (primeros 100 builds/mes)

Con créditos de AWS, esto debería ser gratis por varios meses.
