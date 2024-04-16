FROM node:16.20.0-alpine

WORKDIR /src

RUN mkdir tmp

COPY package.json .

RUN yarn

RUN yarn add amqplib -g

COPY . .

RUN ls -A

RUN cat server.js

CMD [ "yarn", "start" ]