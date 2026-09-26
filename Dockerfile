# syntax=docker/dockerfile:1
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY src ./src
COPY test ./test

FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM base AS test
ENV NODE_ENV=test
CMD ["npm", "test"]

FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY src ./src
USER node
EXPOSE 3000
CMD ["npm", "start"]
