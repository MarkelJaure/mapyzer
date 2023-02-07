#############
### build ###
#############
# base image
FROM node:12.9.0 as build

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package*.json /app/
RUN npm install -g npm@next
RUN npm install -g @angular/cli@7.3.9
RUN npm install @angular-devkit/build-angular
# add app
COPY . /app

# generate build
RUN ng build --output-path=dist --prod
#RUN ng build --configuration=production
#RUN ng build --configuration=testing


############
### prod ###
############

# base image
FROM nginx:1.18.0

WORKDIR /app

# copy artifact build from the 'build environment'
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
#CMD ["npm", "start"]

