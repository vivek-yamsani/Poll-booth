FROM node

COPY . /app/

WORKDIR  /app

RUN npm i

EXPOSE 3000

EXPOSE 5555

ARG DATABASE_URL

RUN rm -f .env

RUN echo "DATABASE_URL=${DATABASE_URL}" >> .env

ARG PORT

RUN echo "PORT=${PORT}" >> .env

ARG JWT_SECRET

RUN echo "JWT_SECRET='${JWT_SECRET}'" >> .env

ENTRYPOINT ./start.sh