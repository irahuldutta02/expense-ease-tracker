# ---------- BUILD STAGE ----------
FROM node:20-bullseye AS build

WORKDIR /app

# Install deps required for sharp (safe even if not used)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libvips \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Prevent sharp from downloading broken binaries
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build app (Vite/React)
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]