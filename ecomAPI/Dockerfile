FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps --include=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start in production mode (ensure DB schema is up-to-date)
CMD ["sh", "-c", "sleep 10 && npx sequelize-cli db:migrate && npm run start:prod"]
