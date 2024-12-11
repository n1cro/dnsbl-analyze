FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
COPY ./libs/database/prisma ./

RUN npm install --silent

CMD ["npx", "prisma", "migrate", "deploy", "--schema=./schema.prisma"]
