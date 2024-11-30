<h1 align="center">URL-Shortener</h1>
<strong>URL-Shortener 是一个基于 Next.js 的简易短链接应用</strong>
<br>

![首页](./img/1.png)
![传送](./img/2.png)

</div>

### 部署
支持部署环境：

- Docker
- Systemd

自动(推荐):
```bash
curl -sSL https://git.mei.lv/mei/short-url/raw/branch/main/auto.sh -o auto.sh && bash auto.sh
```

手动:
```shell
git clone https://git.mei.lv/mei/short-url.git
cd short-url
touch .env ## 参考 .env.example 填写
docker build -t url-shortener:latest .
mkdir /opt/url-shortener
cd /opt/url-shortener
wget https://git.mei.lv/mei/short-url/raw/branch/main/docker-compose.yaml
docker compose up -d
```

部署成功后,服务会在 `8567` 端口上启动
### 迁移
替换 `data/` 目录下的 `shorturl.db` 文件即可