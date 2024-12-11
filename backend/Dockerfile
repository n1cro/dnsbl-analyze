FROM node:22-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder

RUN apk add --no-cache openssl

ARG APP

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npx prisma generate
RUN npm run build ${APP}
RUN npm install --omit=dev

FROM node:22-alpine AS runner

RUN apk add --no-cache openssl

ARG APP
ENV APP=${APP}
ENV NODE_ENV production

WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE ${API_PORT}

CMD node "dist/apps/${APP}/main"
