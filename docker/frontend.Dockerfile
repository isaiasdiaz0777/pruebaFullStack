# ETAPA 1: Construcción (Builder)
FROM node:22-alpine AS builder

# Instalamos compatibilidad para librerías necesarias en Alpine
RUN apk add --no-cache libc6-compat

# Aumentamos el límite de memoria para evitar el error "heap out of memory"
ENV NODE_OPTIONS="--max-old-space-size=2048"

WORKDIR /src

# 1. Copiamos los archivos de dependencias desde la subcarpeta frontend
COPY ./frontend/package*.json ./

# 2. Instalamos todas las dependencias
RUN npm install

# 3. Copiamos el resto del código del frontend
COPY ./frontend .

# 4. Generamos el build de producción (.output)
RUN npm run build

# ---

# ETAPA 2: Ejecución (Runner)
FROM node:22-alpine AS runner

WORKDIR /app

# Copiamos solo el resultado de la construcción (mucho más ligero)
COPY --from=builder /src/.output ./.output
COPY --from=builder /src/package.json ./package.json

# Configuraciones de producción
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0

# CLAVE PARA RAILWAY: Usar el puerto 8080 y permitir que sea dinámico
ENV PORT=8080
ENV NUXT_PORT=8080

# Informamos el puerto a la red
EXPOSE 8080

# Comando de inicio optimizado
CMD ["node", ".output/server/index.mjs"]