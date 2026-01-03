FROM node:20-slim AS build

WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20-slim

WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y openssl

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 3333

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]