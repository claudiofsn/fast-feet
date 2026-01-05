FROM node:24-slim AS build

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:24-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/prisma.config.ts ./

EXPOSE 3333

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]