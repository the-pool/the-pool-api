FROM node:16.17.0 AS builder
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:16.17.0-alpine
WORKDIR /app

COPY --from=builder /app ./
CMD ["npm", "run", "start:prod"]