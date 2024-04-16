FROM node:16-alpine

WORKDIR /src

RUN mkdir tmp

# Install PostgreSQL client
RUN apk update && apk add postgresql14-client

COPY package.json .

RUN yarn

COPY . .

RUN ls -A

RUN cat server.js

RUN cd ./__init__ && cat dump_Database_psql.js

CMD [ "yarn", "start" ]
