#############
### build ###
#############
FROM node:12 as build

WORKDIR /app

COPY package*.json /app/

RUN npm cache clean --force
RUN npm install --legacy-peer-deps
RUN npm install @angular/cli@7.3.9 --legacy-peer-deps
RUN npm cache clean --force

COPY . /app

ENV NODE_OPTIONS=--max_old_space_size=512

RUN ./node_modules/.bin/ng build --output-path=dist --configuration=production

############
### prod ###
############
FROM nginx:1.21

WORKDIR /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
