<h1 align="center">URL-Shortener</h1>

<strong>NezhaDash 是一个基于 Next.js 的简易短链接应用</strong>
<br>

</div>

### 部署
支持部署环境：

- Docker

部署方式:
```shell
git clone https://git.mei.lv/mei/short-url.git
docker build .
mkdir /opt/url-shortener
cd /opt/url-shortener
wget https://git.mei.lv/mei/short-url/raw/branch/main/docker-compose.yaml
docker compose up -d
```

### 迁移
替换 `data/` 目录下的 `shorturl.db` 文件即可