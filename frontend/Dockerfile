FROM node

COPY . /app/

WORKDIR  /app

RUN rm .env

ARG REACT_APP_BACKEND

RUN echo "REACT_APP_BACKEND='${REACT_APP_BACKEND}'" >> .env

ARG PORT

RUN echo "PORT=${PORT}" >> .env

RUN npm i

EXPOSE 4000

ENTRYPOINT npm start