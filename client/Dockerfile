FROM node:20-slim as build

WORKDIR /app

# Install build dependencies (for sharp / native modules)
RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy rest of code
COPY . .

# Build app
RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf