#!/bin/bash

# Ensure root
if [ "$EUID" -ne 0 ]; then
    echo -e "\e[31m请使用 root 用户运行此脚本\033[0m"
    exit 1
fi

# Install pkgs
echo -e "\e[32m正在安装必要的包\033[0m"
if command -v apt-get &> /dev/null; then
    apt-get update && apt-get install -y wget git
elif command -v yum &> /dev/null; then
    yum install -y wget git
else
    echo -e "\e[31m无法自动安装必要的包 wget git,请自行手动安装\033[0m"
    exit 1
fi

# Check Docker install
if ! command -v docker &> /dev/null; then
    echo "Docker未安装，正在为您安装Docker..."
    bash <(curl -sSL https://linuxmirrors.cn/docker.sh) --source mirrors.tuna.tsinghua.edu.cn/docker-ce --source-registry registry.hub.docker.com --install-latested true
    if ! command -v docker &> /dev/null; then
        echo -e "\e[31mDocker安装失败，请检查网络或手动安装Docker。\033[0m"
        exit 1
    fi
fi

# Get info
read -p "您希望使用的安装目录(默认为/opt/url-shortener): " InstallDir
read -p "您的域名(示例: https://u.mei.lv ): " DomainName
if [ -z "$InstallDir" ]; then
  InstallDir="/opt/url-shortener"
fi
if [ ! -d "$InstallDir" ]; then
  echo "目录 $InstallDir 不存在，正在创建..."
  mkdir -p "$InstallDir"
  if [ $? -ne 0 ]; then
    echo -e "\e[31m创建目录失败\033[0m"
    exit 1
  fi
  echo -e "\e[32m目录 $InstallDir 创建成功。\033[0m"
else
  echo -e "\e[32m目录 $InstallDir 已存在。\033[0m"
fi

# Get Code
cd "$InstallDir" || { echo -e  "\e[31m进入目录 $InstallDir 失败，请检查路径。\033[0m"; exit 1; }
git clone https://git.mei.lv/mei/short-url.git
if [ $? -ne 0 ]; then
  echo -e "\e[31m克隆仓库失败，请检查网络连接\033[0m"
  exit 1
fi
wget https://git.mei.lv/mei/short-url/raw/branch/main/docker-compose.yaml
if [ $? -ne 0 ]; then
  echo -e "\e[31m下载 docker-compose.yaml 文件失败，请检查网络连接\033[0m"
  exit 1
fi
echo "NEXT_PUBLIC_BASE_URL=$DomainName" > "$InstallDir/short-url/.env"
if [ $? -ne 0 ]; then
  echo -e "\e[31m创建 .env 文件失败\033[0m"
  exit 1
fi

# Build Docker image
cd "$InstallDir/short-url"
docker build -t url-shortener:latest .
if [ $? -ne 0 ]; then
  echo -e "\e[31m构建 Docker 镜像失败\033[0m"
  exit 1
fi

# Start Service
cd "$InstallDir"
docker compose up -d
if [ $? -ne 0 ]; then
  echo -e "\e[31m启动 Docker 容器失败\033[0m"
  exit 1
fi
echo -e "\e[32m安装和配置完成，服务已启动在 8567 端口上。\033[0m"
