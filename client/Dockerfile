FROM node:20-slim as build

WORKDIR /app

# Install dependencies for sharp (IMPORTANT FIX)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Install deps first
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Build
RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf