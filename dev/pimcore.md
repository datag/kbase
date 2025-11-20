---
title: Pimcore
---

## Pimcore-Dev

```shell
mkdir pimcore-dev

# OR, if BTRFS sub-volume (and later volume mounts into project directory)
btrfs sub create pimcore-dev
chown 1000:1000 pimcore-dev
```

> [!NOTE]
> The options to composer's `create-project` command:
> * `--keep-vcs`: Keep the Git repo of the Pimcore skeleton. Use only if you'd like to contribute to `pimcore/skeleton`.
> * `--prefer-source`: Whether to have Git repos of the vendor packages. Use only if you'd like to contribute to a 3rd party package.

```shell
docker run --rm -ti \
    -v `pwd`:/var/www/html \
    --user 1000:1000 \
    -e COMPOSER_HOME=/tmp -e COMPOSER_CACHE_DIR=/tmp \
    pimcore/pimcore:php8.4-debug-latest \
    composer -n create-project \
        --keep-vcs \
        --prefer-source \
        pimcore/skeleton:2025.x-dev .
```

Optional adjustments to `docker-compose.yaml`:
* Ports
* `php` & `supervisord` service:
	* User-Group-Mapping 1000:1000
	* PHP version
* Volume mounts (`mkdir -p .docker/foobar && chmod a+w .docker/foobar`) to have everything self-contained with possibility of BTRFS-snapshotting the whole project:
	* `.docker/mariadb:/var/lib/mysql`
	* `.docker/rabbitmq:/var/lib/rabbitmq`

```shell
docker compose up -d
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

