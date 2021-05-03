# Docker

Resources:
  * [Docker Hub (Registry)](https://hub.docker.com/)

## Installation

### Docker Engine

https://docs.docker.com/engine/install/ubuntu/

Add repo:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Install packages:

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
```

Add current user to `docker` group:

```bash
sudo usermod -aG docker $USER
```

Perform re-login and test:

```bash
id   # should list 'docker' group

docker --version
docker run --rm hello-world
```


### Docker Compose

  * https://docs.docker.com/compose/install/
  * https://github.com/docker/compose/releases/latest

Download:

```bash
mkdir -p ~/bin    # assume ~/bin is in $PATH
curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o ~/bin/docker-compose     # NOTE: adjust version!
chmod a+x ~/bin/docker-compose
```

Test:

```bash
docker-compose --version
```


## Create simple image and run it

TODO: mkdir easy-peasy... Dockerfile...

```dockerfile
FROM debian:buster-slim

RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		pv \
		jq \
	; \
	rm -rf /var/lib/apt/lists/*

#CMD ["/bin/sh", "-c", "pv -f --rate-limit 1K </dev/zero >/dev/null"]
CMD ["/bin/sh", "-c", "pv --version"]
```


    docker build -t easy-peasy .
    docker image ls

Run:

    docker run --rm easy-peasy
    docker run --rm -it easy-peasy
    docker run --rm -it easy-peasy /bin/bash

    docker container ls -a    # alias ps -a
    docker container start -a -i 37d87bcb1713

    docker container inspect 37d87bcb1713
    docker container logs 37d87bcb1713    # alias logs


## Docker Compose

https://docs.docker.com/get-started/08_using_compose/

```yaml
version: "3.7"

services:
    app:
        image: easy-peasy:latest
        #command: sh -c "jq --version && echo PWD:$$PWD && echo MY:$$MY_APP"
        ports:
            - 12345:12345
        working_dir: /tmp
        volumes:
            - ./share:/mnt/share
        environment:
            MY_APP: foobar
```

    docker-compose run --rm app pv --version
    docker-compose run --rm app sh -c 'echo $MY_APP'

    docker-compose up -d

    docker logs -f cosy-env_app_1

    docker-compose down

## Tips

  * To detach the tty without exiting the shell, use the escape sequence `Ctrl-p` + `Ctrl-q`.
  * Map user: `docker run -it --rm --volume $(pwd):/source --workdir /source --user $(id -u):$(id -g) ubuntu`

## TODOs

  * Volume/ File permissions
