
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat


ENV NODE_OPTIONS="--max-old-space-size=2048"

WORKDIR /src


COPY ./frontend/package*.json ./

RUN npm install
COPY ./frontend .


RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /src/.output ./.output
COPY --from=builder /src/package.json ./package.json


ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]