
FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache python3 make g++ \
    && npm config set update-notifier false

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY src/swagger ./src/swagger

FROM base AS build
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app


RUN apk add --no-cache curl tar gzip \
 && curl -sSL https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    | tar -C /usr/local/bin -xz


COPY package*.json ./
RUN npm ci --omit=dev


COPY --from=build /app/dist ./dist
COPY --from=build /app/src/swagger ./src/swagger


RUN addgroup -S app && adduser -S app -G app \
 && chown -R app:app /app
USER app

EXPOSE 3000

ENV NODE_ENV=production

# Healthcheck opcional (só funciona quando o serviço estiver rodando)
# HEALTHCHECK --interval=30s --timeout=5s --retries=5 \
#   CMD wget -qO- http://localhost:3000/
