# Stage 1: build
FROM node:24.14.1-alpine3.23 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Stage 2: producción
FROM node:24.14.1-alpine3.23 AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 5000
CMD ["node", "dist/app.js"]


# # Stage 1: build
# FROM node:24.14.1-alpine3.23  AS builder
# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY tsconfig.json ./
# COPY src ./src

# RUN npm run build

# # Stage 2: producción
# FROM node:24-alpine AS runner
# WORKDIR /app

# COPY package*.json ./
# RUN npm ci --only=production

# COPY --from=builder /app/dist ./dist

# EXPOSE 5000
# CMD ["node", "dist/app.js"]