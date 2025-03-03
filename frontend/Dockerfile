#############
### build ###
#############
FROM node:12 as build

WORKDIR /app

COPY package*.json /app/

# Limpiar cache y evitar errores de dependencias
RUN npm cache clean --force
RUN npm install -g npm@6
RUN npm install --legacy-peer-deps --production

COPY . /app

ENV NODE_OPTIONS=--max_old_space_size=512

RUN npx ng build --output-path=dist --configuration=production

############
### prod ###
############
FROM nginx:1.21

WORKDIR /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
