# **_E-POLL_**

- This a web app in which we can make teams and create polls among teams
- It is made using

  - NodeJS and ExpressJS for ServerSide Scripting

  - MySQL as Database

  - Prisma as ORM

  - ReactJS and chakra-ui for frontend

## Getting Started

- Requirements

  - NodeJS Runtime

  - MySQL Database

- Clone this Repository

```bash

git clone https://github.com/vivek-yamsani/Poll-booth.git
```

- Install all dependencies

```bash
cd backend && npm i

cd frontend && npm i
```

- Sync the database with schema

```bash
npx prisma migrate dev --name 'name_of_the_migration'
```

- Start the Servers

```bash
cd backend && npm run dev

cd frontend && npm start
```

### Using Docker && docker Compose

- Clone the repo

```bash

git clone https://github.com/vivek-yamsani/Poll-booth.git
```

- add the env file according to the example

- spin up docker containers

```bash

docker-compose up
```

