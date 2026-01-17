**Nginx 是“服务器软件”**：启动后监听 80/443 端口，接收浏览器的请求并返回内容。它既能直接“发网页”（静态资源），也能当**反向代理**把请求转给你的后端程序（Flask、Node、Django…），还会顺带做负载均衡、HTTPS、缓存、限流等。

### 小图示
```plain
浏览器 → Nginx（Web 服务器/反向代理）→ 你的后端(127.0.0.1:5000等)
                         ↳ 也可直接发静态文件 / images / css / html
```

---

# 五分钟上手（安装与启动）
> 推荐环境：**Ubuntu / Debian / WSL-Ubuntu**（最简单）
>

1. 安装

```bash
sudo apt update
sudo apt install -y nginx
```

2. 开机自启 & 启动

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

3. 验证  
在浏览器打开：[http://localhost](http://localhost) 或 [http://你的服务器IP](http://你的服务器IP)  
或者：

```bash
curl -I http://localhost
```

看到 `200 OK` 就成功了。

> **CentOS / AlmaLinux / Rocky**
>

```bash
sudo dnf install -y nginx
sudo systemctl enable --now nginx
sudo firewall-cmd --add-service=http --add-service=https --permanent
sudo firewall-cmd --reload
```

> **macOS (Homebrew)**
>

```bash
brew install nginx
brew services start nginx    # 默认监听 8080
```

> **Docker（最小可用）**
>

```bash
mkdir -p ~/nginx/html
echo '<h1>Hello Nginx</h1>' > ~/nginx/html/index.html
cat > ~/nginx/nginx.conf <<'EOF'
events {}
http {
  server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
  }
}
EOF

docker run -d --name mynginx \
  -p 80:80 \
  -v ~/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v ~/nginx/html:/usr/share/nginx/html:ro \
  nginx:alpine
```

---

# 文件位置与常用命令
+ 主配置（Debian/Ubuntu 常见）：
    - `/etc/nginx/nginx.conf`（总入口）
    - `/etc/nginx/sites-available/`（放站点配置）
    - `/etc/nginx/sites-enabled/`（启用的站点，通常是软链接）
    - 日志：`/var/log/nginx/access.log`、`/var/log/nginx/error.log`

<!-- 这是一张图片，ocr 内容为：G Y > ETC > NGINX > CONF.D > 修改时间 权限 大小 A 文件名 A1.CCYYFF.CN.CONF.OFF 2025-08-250:37:06 TWX(644/ROOT) 2.4KB 2025-09-30 08:08 HIWEBSUN.TOP.CONF TWX(644/ROOT) 2.6KB 578.0B 2025-08-1617:20:38 TWX(644/ROOT) SYSUZGXYTJ.TOP.CONF.BA... 2025-09-29 23:55 675.0B SYSUZGXYTJ.TOP.CONF.OFF RWX(644/ROOT) -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1759752646250-e4483f75-5820-4d84-9607-57ecef3a3233.png)

+ 主配置（CentOS 系）：
    - `/etc/nginx/nginx.conf`
    - 站点片段：`/etc/nginx/conf.d/*.conf`

**常用命令**

```bash
nginx -t                # 检查配置是否正确（必备）
sudo systemctl reload nginx   # 平滑重载配置
sudo systemctl restart nginx  # 重启
sudo journalctl -u nginx -e   # 查看服务日志（systemd）
tail -f /var/log/nginx/error.log  # 盯错误
```

---

# ① 静态网站最小配置（可直接用）
**Ubuntu/Debian 建议**：在 `/etc/nginx/sites-available/your_site` 写入：

```nginx
server {
    listen 80;
    server_name _;  # 没域名就用下划线；有域名写 example.com

    root /var/www/your_site;   # 你的网页目录
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

启用并重载：

```bash
sudo mkdir -p /var/www/your_site
echo 'Hello Nginx' | sudo tee /var/www/your_site/index.html
sudo ln -s /etc/nginx/sites-available/your_site /etc/nginx/sites-enabled/your_site
sudo nginx -t && sudo systemctl reload nginx
```

**CentOS 系**：放到 `/etc/nginx/conf.d/your_site.conf`，内容同上，然后：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

# ② 反向代理后端（Flask/Node 等）
> 场景：你的后端跑在本机 `127.0.0.1:5000`，让 Nginx 对外提供统一的 80/443 接口。
>

```nginx
server {
    listen 80;
    server_name api.example.com;

    # 真实IP记录（可选）
    real_ip_header X-Forwarded-For;

    location / {
        proxy_pass http://127.0.0.1:5000;

        # 这四行很重要：把客户端信息传给后端
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持（如需）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }
}
```

> 备注：`$connection_upgrade` 需要在 `http {}` 上方加：
>

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
```

---

# ③ 一键 HTTPS（Let’s Encrypt）
> 你需要：有一个解析到服务器 IP 的域名（如 `example.com`），80 端口可访问。
>

**安装 certbot**

```bash
sudo apt install -y certbot python3-certbot-nginx  # Debian/Ubuntu
# CentOS: sudo dnf install -y certbot python3-certbot-nginx
```

**自动申请并改写 Nginx 配置**

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

+ 成功后会自动加上 `listen 443 ssl;`、证书路径、以及 80→443 重定向。
+ **证书会自动续期**（系统里有定时任务）。可手动测试：

```bash
sudo certbot renew --dry-run
```

---

# ④ 常见“需求开关”速查
把下面片段丢到对应的 `server {}` 或 `http {}` / `location {}` 中即可。

**HTTP → HTTPS 重定向（有证书后）**

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}
```

**开启 gzip 压缩（减少传输体积）**

```nginx
http {
  gzip on;
  gzip_types text/plain text/css application/javascript application/json image/svg+xml;
  gzip_min_length 1k;
}
```

**静态资源强缓存**

```nginx
location ~* \.(jpg|jpeg|png|gif|svg|css|js|woff2?)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

**提高上传大小限制（413 错误解决）**

```nginx
server {
    client_max_body_size 50m;   # 根据需要调大
}
```

**简单 CORS（跨域）**

```nginx
location /api/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Headers *;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    if ($request_method = OPTIONS) { return 204; }
    proxy_pass http://127.0.0.1:5000;
}
```

**限流（防暴力刷接口）**

```nginx
http {
  # 按IP限速：每秒 5 个请求，桶容量 10
  limit_req_zone $binary_remote_addr zone=req_limit:10m rate=5r/s;
}

server {
  location /api/ {
    limit_req zone=req_limit burst=10 nodelay;
    proxy_pass http://127.0.0.1:5000;
  }
}
```

**Basic Auth（简易密码保护）**

```bash
sudo apt install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin   # 设置用户名/密码
```

```nginx
location /admin/ {
    auth_basic "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://127.0.0.1:5000;
}
```

---

# ⑤ 日志与排错清单
**看错误**

```bash
tail -n 100 -f /var/log/nginx/error.log
```

**端口被占用**

```bash
sudo lsof -i:80 -P -n
sudo lsof -i:443 -P -n
```

**防火墙放行**

```bash
# Ubuntu/WSL-Ubuntu (如有 ufw)
sudo ufw allow 'Nginx Full'
# CentOS
sudo firewall-cmd --add-service=http --add-service=https --permanent
sudo firewall-cmd --reload
```

**常见报错对照**

+ `nginx: [emerg] "server" directive is not allowed here`  
说明你把 `server {}` 写进了错误的层级；应该在 `http {}` 里面。
+ `502 Bad Gateway`  
后端没启动 / 端口错 / 防火墙拦了 / `proxy_pass` 写错（注意有无末尾 `/` 的差异）。
+ `404`  
`root` 路径不对或 `try_files` 找不到文件。
+ `413 Request Entity Too Large`  
调大 `client_max_body_size`。
+ 申请证书失败  
域名没解析到服务器 IP、80 端口不通、Nginx 没按标准目录提供 `.well-known`。

---

# ⑥ WSL / Windows 小贴士
+ 在 **WSL-Ubuntu** 装 Nginx 没问题，和真 Ubuntu 一样用。
+ 从 Windows 访问 WSL 里的 Nginx：直接用 `http://localhost`（新版 WSL 会做端口转发）。
+ 如果你把代码放在 Windows 盘（如 `/mnt/c/...`），注意权限和性能；静态网站建议复制到 `/var/www` 下。

---

# ⑦ Docker 场景（反向代理 + HTTPS）
生产上常会用 **nginx:alpine** + **挂载配置与证书**：

```bash
docker run -d --name web \
  -p 80:80 -p 443:443 \
  -v $PWD/conf:/etc/nginx/conf.d:ro \
  -v $PWD/certs:/etc/nginx/certs:ro \
  -v $PWD/html:/usr/share/nginx/html:ro \
  nginx:alpine
```

`$PWD/conf/site.conf`（示例）：

```nginx
server {
  listen 80;
  server_name example.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name example.com;

  ssl_certificate     /etc/nginx/certs/fullchain.pem;
  ssl_certificate_key /etc/nginx/certs/privkey.pem;

  root /usr/share/nginx/html;
  index index.html;

  location /api/ {
    proxy_pass http://host.docker.internal:5000; # Mac/Win Docker
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

---

# ⑧ 小词典（看配置不迷路）
+ **server 块**：一个站点的配置单元（监听端口、域名、证书…）。
+ **location**：URL 匹配与路由规则（如 `/api/`、静态扩展名）。
+ **upstream**：后端组（多个 `127.0.0.1:5000` 做负载均衡）。
+ **root vs alias**：`root` 把请求路径接在目录后面；`alias` 直接替换路径。
+ **proxy_pass**：把请求转发给后端（HTTP 代理的核心指令）。



