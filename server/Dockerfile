FROM node:20-bookworm-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev --prefer-offline --no-audit --progress=false

# Copy source
COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]