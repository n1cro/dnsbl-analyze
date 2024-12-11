FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine as runner

ARG SERVER_NAME
ARG API_PREFIX
ARG API_PORT

ENV SERVER_NAME=${SERVER_NAME}
ENV API_PREFIX=${API_PREFIX}
ENV API_PORT=${API_PORT}

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf.template

RUN envsubst '${SERVER_NAME} ${API_PREFIX} ${API_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
