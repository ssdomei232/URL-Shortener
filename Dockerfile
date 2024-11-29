# 阶段 1: 依赖项安装和构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 创建 sources.list 文件并设置为清华源
RUN echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.17/main" > /etc/apk/repositories && \
    echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.17/community" >> /etc/apk/repositories

# 更新 apk 缓存
RUN apk update

# 设置 npm 使用清华大学开源软件镜像站
RUN npm config set registry https://registry.npmmirror.com

# 复制 package.json 和 package-lock.json (如果可用)
COPY package*.json ./

# 安装依赖项
RUN npm ci

# 复制项目文件
COPY . .

# 构建应用前，先安装必要的系统依赖
RUN apk add --no-cache build-base python3 g++ make

# 重新构建 better-sqlite3 模块
RUN npm rebuild better-sqlite3 --update-binary

# 构建 Next.js 应用
RUN npm run build

# 阶段 2: 生产环境
FROM node:18-alpine AS runner

# 设置工作目录
WORKDIR /app

# 创建 sources.list 文件并设置为清华源
RUN echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.17/main" > /etc/apk/repositories && \
    echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.17/community" >> /etc/apk/repositories

# 更新 apk 缓存
RUN apk update

# 设置为生产环境
ENV NODE_ENV production

# 添加一个非root用户来运行应用
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建的应用和依赖项
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/start.sh ./
COPY --from=builder /app/.next/static ./.next/static

# 设置正确的权限
RUN chown -R nextjs:nodejs /app
RUN chmod +x /app/start.sh

# 切换到非root用户
USER nextjs

# 声明数据卷
VOLUME /app/data

# 暴露应用端口
EXPOSE 3000

# 设置环境变量
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 运行应用
CMD ["/app/start.sh"]