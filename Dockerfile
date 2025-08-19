
FROM node:20-alpine


RUN apk add --no-cache curl tar gzip \
    && curl -sSL https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz | tar -C /usr/local/bin -xz


WORKDIR /app
COPY package*.json ./
COPY ./src/swagger/ /app/src/swagger

RUN npm install 
COPY . .
RUN npm run build
CMD ["dockerize", "-wait", "tcp://db_lab_logistica:27017", "-timeout", "120s", "node", "dist/server.js"]

