# Etapa 1: Compilar React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Esto crea la carpeta /dist con los archivos HTML/JS optimizados
RUN npm run build

# Etapa 2: Servir con Nginx (Servidor web ligero)
FROM nginx:alpine
# Copiamos los archivos compilados al servidor
COPY --from=build /app/dist /usr/share/nginx/html
# Configuración básica para que React Router funcione (evitar error 404 al recargar)
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]