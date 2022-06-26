FROM node:16-alpine as builder

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

FROM nginx:alpine
EXPOSE 80
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
