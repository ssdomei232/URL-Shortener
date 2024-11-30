# Stage 1: Install dependencies
FROM node:18-alpine AS builder
WORKDIR /app
RUN echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.17/main" > /etc/apk/repositories && \
    echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.17/community" >> /etc/apk/repositories
RUN apk update
RUN npm config set registry https://registry.npmmirror.com
COPY package*.json ./
RUN npm ci

# Stage 2: Build the applicatio
COPY . .
RUN apk add --no-cache build-base python3 g++ make
RUN npm rebuild better-sqlite3 --update-binary
RUN mkdir -p /app/data
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS runner
RUN mkdir -p /app/data && chmod 755 /app/data
WORKDIR /app
RUN echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.17/main" > /etc/apk/repositories && \
    echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.17/community" >> /etc/apk/repositories
RUN apk update
ENV NODE_ENV Production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/data/shorturl.db ./data
VOLUME /app/data

# 运行应用
CMD ["node", "server.js"]