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

```shell
mkdir url-shortener
cd url-shortener
touch .env ## 参考 .env.example 填写
wget https://git.mei.lv/mei/short-url/raw/branch/main/docker-compose.yaml
docker compose up -d
```

部署成功后,服务会在 `8567` 端口上启动

### 迁移

替换 `data/` 目录下的 `shorturl.db` 文件即可

### 开发

```shell
mkdir data
```

### 关于广告

您可以随意替换或删除本应用代码中的广告信息，我们非常鼓励你这么做(或许会成为你学习的动力?)
