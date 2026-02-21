FROM node:22-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /src

# Copiamos archivos de dependencias
COPY ./frontend/package*.json ./

# Instalamos dependencias incluyendo el fix de postcss
RUN npm install && npm install @tailwindcss/postcss

# Copiamos el resto del código
COPY ./frontend .

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["npm", "run", "dev"]