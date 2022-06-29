FROM node

COPY ./public /app/public

COPY ./src /app/src

COPY ./.env  /app/.env

COPY ./package.json /app/package.json

WORKDIR  /app

RUN npm i

EXPOSE 3001

CMD ["npm", "start"]