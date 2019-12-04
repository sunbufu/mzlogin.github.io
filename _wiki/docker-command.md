---
layout: wiki
title: Docker 常用命令
categories: [Docker]
description: Docker 的常用命令和常用软件命令
keywords: Docker, Docker 常用命令
---

# 1 docker 常用命令

整理常用的 docker 命令和常用的 docker 软件，详细和最新的命令文档还要参考最新的[docker 官方文档地址](https://docs.docker.com/engine/reference/commandline/docker/){:target="_blank"}。

## 1.1 镜像管理

[dockerHub](https://hub.docker.com){:target="_blank"} 是docker的镜像仓库，里面存放有各种docker镜像。

### 1.1.1 在 dockerHub 查找镜像

```
docker search [OPTIONS] TERM
```

* `--filter , -f` : 根据提供的条件过滤
* `--no-trunc` : 显示完整的镜像描述
* `--limit` : 限制搜索出来的结果数量（默认 25）

### 1.1.2 从 dockerHub 下载镜像

```
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

* `--all-tags , -a` : 拉取所有 tagged 镜像
* `--disable-content-trust` : 忽略镜像的校验, 默认开启

### 1.1.3 本地镜像列表

```
docker images [OPTIONS] [REPOSITORY[:TAG]]
```

* `--all , -a` : 列出本地所有的镜像（含中间映像层，默认情况下，过滤掉中间映像层）
* `--digests` : 显示镜像的摘要信息
* `--filter , -f` : 根据提供的条件过滤
* `--format` : 指定返回值的模板文件
* `--no-trunc` : 显示完整的镜像信息
* `--quiet , -q` : 只显示镜像 ID

### 1.1.4 删除本地镜像

```
docker rmi [OPTIONS] IMAGE [IMAGE...]
```
* `--force , -f` : 强制删除镜像

## 1.2 容器操作

### 1.2.1 创建容器

```
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

* `--publish , -p` : 绑定宿主机端口到容器端口（例如 `-p 8080:80` 把宿主机 8080 端口绑定到容器的 80 端口）
* `--detach , -d` : 后台启动容器，并返回容器的 id
* `--name` : 指定容器的名称
* `--volume , -v` : 绑定挂载宿主机目录到容器目录（例如 `-v /Users/sunbufu/data/logs:/logs 绑定挂载宿主机 /Users/sunbufu/data/logs 到容器到 /logs 目录`）
* `--env , -e` : 设置容器的环境变量
* `--link` : 与另外的容器建立链接

注：参数较多，详情请参考[官方文档](https://docs.docker.com/engine/reference/commandline/run/){:target="_blank"}

### 1.2.2 启动容器

```
docker start [OPTIONS] CONTAINER [CONTAINER...]
```

### 1.2.3 停止容器

```
docker stop [OPTIONS] CONTAINER [CONTAINER...]
```

* `--time , -t` : 再杀掉容器之前等待秒数（默认 10）

### 1.2.4 杀掉容器

```
docker kill [OPTIONS] CONTAINER [CONTAINER...]
```

* `--signal , -s` : 发给容器的信号（默认 KILL）

### 1.2.5 删除容器

```
docker rm [OPTIONS] CONTAINER [CONTAINER...]
```

* `--force , -f` : 强制删除运行中的容器（使用 SIGKILL）

### 1.2.6 容器日志

```
docker logs [OPTIONS] CONTAINER
```

* `--tail` : 展示日志文件尾部的多少行（默认 all）
* `--since` : 展示从某个时间开始的日志（例如 2013-01-02T13:23:37）或者相对时间（例如 42m for 42 minutes）

### 1.2.7 执行命令

```
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

* `--interactive , -i` : 以交互模式运行容器
* `--tty , -t` : 为容器重新分配一个伪输入终端
* `--detach , -d` : 后台运行模式

例：进入容器的 bash，并执行命令  
`docker exec -it mysql /bin/bash`

# 2 docker 常用软件安装

## 2.1 gitlab-ce

```bash
docker run \
--detach \
--publish 8443:443 \
--publish 8080:80 \
--publish 8022:22 \
--name gitlab \
--volume ~/data/gitlab/config:/etc/gitlab \
--volume ~/data/gitlab/logs:/var/log/gitlab \
--volume ~/data/gitlab/data:/var/opt/gitlab \
gitlab/gitlab-ce 
```

## 2.2 mysql
```bash
docker run \
--detach \
--publish 3306:3306 \
--name mysql \
--volume ~/data/mysql/conf:/etc/mysql/conf.d \
--volume ~/data/mysql/logs:/logs \
--volume ~/data/mysql/data:/var/lib/mysql \
--env MYSQL_ROOT_PASSWORD=123456 \
mysql
```
注：mysql 8 版本需要额外的配置下远程连接用户，命令如下

```bash
#进入容器
docker exec -it mysql bash

#登录mysql
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';

#添加远程登录用户
CREATE USER 'sunbufu'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'sunbufu'@'%';
```

## 2.3 mongodb

```bash
docker run \
--detach \
--publish 27017:27017 \
--name mongodb \
--volume ~/data/mongodb/data/db:/data/db \
mongo
```

## 2.4 zookeeper

```bash
docker run \
--detach  \
--publish 2181:2181 \
--volume ~/data/zookeeper/data/:/data/ \
--volume ~/data/zookeeper/conf/:/conf/ \
--name=zookeeper  \
--privileged zookeeper
```

## 2.5 redis
```bash
docker run \
--detach  \
--publish 6379:6379 \
--volume ~/data/redis/data/:/data/ \
--name redis \
redis \
redis-server --appendonly yes
```

`redis-server --appendonly yes` : 在容器执行 redis-server 启动命令，并打开 redis 持久化配置

## 2.6 nacos
```bash
docker run \
--detach \
--publish 8848:8848 \
--name nacos \
--volume ~/data/nacos/data:/home/nacos/data \
--volume ~/data/nacos/logs:/home/nacos/logs \
--env MODE=standalone \
nacos/nacos-server
```

访问页面 <http://127.0.0.1:8848/nacos/index.html>
详细配置参照 <https://hub.docker.com/r/nacos/nacos-server>

## 2.7 postgres
```bash
docker run \
--detach \
--publish 5432:5432 \
--name postgres \
--volume ~/data/postgres/data:/var/lib/postgresql/data \
--env POSTGRES_PASSWORD=123456 \
postgres
```

详细配置参照 <https://hub.docker.com/_/postgres>

## 2.8 nextcloud
```bash
docker run \
--detach \
--restart=always \
--name nextcloud \
--publish 8080:80 \
--volume ~/data/nextcloud/data:/var/www/html \
docker.io/nextcloud
```

详细配置参照 <https://hub.docker.com/_/nextcloud>

## 2.9 vsftpd
```bash
docker run \
--detach \
--publish 20:20 \
--publish 21:21 \
--publish 21100-21110:21100-21110 \
--volume ~/data/vsftpd/data:/home/vsftpd \
--env FTP_USER=sunbufu \
--env FTP_PASS=123456 \
--name vsftpd \
fauria/vsftpd
```
完成后可以通过日志查看启动情况 `docker logs vsftpd`  
详细配置参照 <https://hub.docker.com/r/fauria/vsftpd>
