#############
### build ###
#############
# base image con Node.js 12 (compatible con Angular 7)
FROM node:12 as build

# set working directory
WORKDIR /app

# Copiar package.json para instalar dependencias
COPY package*.json /app/

# Instalar npm 6 (compatible con Angular 7)
RUN npm install -g npm@6

# Instalar Angular CLI
RUN npm install -g @angular/cli@7.3.9

# Instalar dependencias con --legacy-peer-deps para evitar errores con versiones antiguas
RUN npm install --legacy-peer-deps

# Copiar todo el código fuente
COPY . /app

# Generar el build para producción
RUN ng build --output-path=dist --prod

############
### prod ###
############

# Usar nginx como servidor web
FROM nginx:1.18.0

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar el build generado al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Correr nginx
CMD ["nginx", "-g", "daemon off;"]
