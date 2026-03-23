FROM node:20-slim

WORKDIR /app

# Install only required runtime deps
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Environment
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]