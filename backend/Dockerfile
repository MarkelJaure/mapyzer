FROM node:12.9.0

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package*.json /app/

RUN npm install

# add app
COPY . /app

RUN npm run build

CMD ["npm", "start"]

EXPOSE 3000
