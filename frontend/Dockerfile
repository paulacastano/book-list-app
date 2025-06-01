FROM node:20.18.2 AS build
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html