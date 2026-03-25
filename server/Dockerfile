FROM node:20-bullseye

WORKDIR /app

# Install runtime + build deps (for sharp or native modules)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libvips \
    && rm -rf /var/lib/apt/lists/*

# Prevent sharp binary issues
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]