#!/bin/sh

# 如果存在 .env 文件，则加载环境变量
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# 启动 Next.js 应用
exec node server.js

