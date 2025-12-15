# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# serve is listed in dependencies
COPY --from=build /app/build ./build
COPY --from=build /app/scripts ./scripts
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 3000

CMD ["sh", "-c", "npm run start:prod"]
