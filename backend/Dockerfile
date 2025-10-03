# Dockerfile para NestJS + Prisma + PostgreSQL
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Expondo porta padrão do NestJS
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
