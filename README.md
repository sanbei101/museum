## 启动 `Caddy` 作为反向代理

```yml
services:
  caddy:
    image: caddy:latest
    container_name: caddy
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
    network_mode: host
```

## `Caddyfile`

```
museum-back.sanbei101.tech {
    reverse_proxy localhost:8090
}
```
