---
title: Pimcore
---

## Pimcore-Dev

```shell
mkdir pimcore-dev

# OR
btrfs sub create pimcore-dev
chown 1000:1000 pimcore-dev
```

```shell
docker run --rm -ti \
    -v `pwd`:/var/www/html \
    --user 1000:1000 \
    -e COMPOSER_HOME=/tmp -e COMPOSER_CACHE_DIR=/tmp \
    pimcore/pimcore:php8.3-debug-latest \
    composer -n create-project \
        --prefer-source \
        --keep-vcs \
        pimcore/skeleton:2024.x-dev .
```

Adjustments `docker-compose.yaml`:
* php & supervisord service: User-Group-Mapping 1000:1000
* FS-Volume-Mounts .docker/mariadb and .docker/rabbitmq

```shell
docker compose up
```

```shell
docker compose exec php \
    vendor/bin/pimcore-install \
        --mysql-host-socket=db \
        --mysql-username=pimcore \
        --mysql-password=pimcore \
        --mysql-database=pimcore \
        --admin-username=admin \
        --admin-password=admin
```

