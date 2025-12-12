# Stage 1: Build
FROM node:20-bullseye AS builder
WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-bullseye-slim
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
