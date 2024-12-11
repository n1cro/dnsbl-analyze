FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app
COPY package*.json ./
COPY ./libs/database/prisma ./

RUN npm install --silent

CMD ["npx", "prisma", "migrate", "deploy", "--schema=./schema.prisma"]
