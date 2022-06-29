FROM node

COPY . /app/

WORKDIR  /app/frontend/

RUN npm i

WORKDIR /app/backend/

EXPOSE 3001

CMD ["npm", "start"]