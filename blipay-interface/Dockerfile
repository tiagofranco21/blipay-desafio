FROM node:24.4.1-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --force --legacy-peer-deps
RUN npm install -g @angular/cli
COPY . .

RUN npm run build --prod

FROM nginx:alpine
COPY --from=builder app/dist/blipay-interface/browser /usr/share/nginx/html
