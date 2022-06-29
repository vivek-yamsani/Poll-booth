#/bin/bash

echo "Start scripting running"

npx prisma migrate dev --name init

npm run dev