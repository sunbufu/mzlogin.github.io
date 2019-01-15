---
layout: post
title: 发布jar包到maven中央仓库
categories: [basis]
description: 发布jar包到maven中央仓库
keywords: maven
---

# 一、写在前面
最近做了一个权限认证的框架，想把jar发布到maven中央仓库上，方便大家使用。于是就有了这篇博客。

# 二、具体步骤

## 2.1 注册账号
首先要做的就是注册账号，这个账号可用于提出申请groupId的Issue，也可用于发布和登录到中央仓库。

### 2.1.1 注册sonatype
工单地址：[https://issues.sonatype.org](https://issues.sonatype.org)
![注册]({{ site.url }}/images{{ page.url }}/20180519080909455.jpg)

## 2.2 申请groupId
创建申请groupId的工单  
![申请groupId]({{ site.url }}/images{{ page.url }}/20180519084622335.jpg)  
工作人员会审核你的申请，如果你的groupId是你的域名，还需要提供一些证明。如果没有域名也可以使用一些开源网站，例如`com.github.xxx`，`io.github.xxx`等。  
如果审核时间很长的话，可以尝试再次提交一个工单。工作人员在审核的时候可能根据最近的Issue来的。

## 2.3 配置GPG
这次我用的mac，所以我使用brew安装的gpg。

```
brew install gpg
```

然后建立软连接到`/usr/local/bin/`

```
sudo ln -s /usr/local/Cellar/gnupg/2.2.7/bin/gpg /usr/local/bin/gpg
```

因为我使用的版本是2.2.7，加密多次失败后。网上查到需要进行一些额外配置。
在gpg的安装目录（`~/.gnup`）下新建两个配置文件：
`gpg.conf`：

```
use-agent
pinentry-mode loopback
```

`gpg-agent.conf`：

```
allow-loopback-pinentry
```

## 2.4 生成秘钥
执行命令，并填入一些信息后生成秘钥

```
gpg --gen-key

gpg --list-keys

pub   rsa2048 2018-05-18 [SC] [有效至：2020-05-17]
      xxxxx
uid           [ 绝对 ] sunbufu <sunyoubufu@qq.com>
sub   rsa2048 2018-05-18 [E] [有效至：2020-05-17]
```

发布公钥到服务器

```
gpg --keyserver hkp://keyserver.ubuntu.com:11371 --send-keys xxxxx
```

## 2.5 配置settings.xml
首先需要配置用户名和密码（2.1.1中注册的用户名和密码）

```xml
<server>
	<id>ossrh</id>
	<username>用户名</username>
	<password>密码</password>
</server>
```

## 2.6 配置pom.xml
使用发布使用的parent。

```xml
<parent>
	<groupId>org.sonatype.oss</groupId>
	<artifactId>oss-parent</artifactId>
	<version>7</version>
</parent>
```

如果不方便也可以自己设置插件的方式（注意我的pom是parent，所以如果不是parent需要把`pluginManagement`标签去掉）。

```xml
<build>
    <pluginManagement>
        <plugins>
            <!--指定编译器版本-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                </configuration>
            </plugin>
            <!--打包源码-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <goals>
                            <goal>jar-no-fork</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!--打包文档注释-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>2.10.3</version>
                <executions>
                    <execution>
                        <id>attach-javadocs</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!--gpg加密-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-gpg-plugin</artifactId>
                <version>1.6</version>
                <executions>
                    <execution>
                        <id>sign-artifacts</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>sign</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!--指定上传仓库-->
            <plugin>
                <groupId>org.sonatype.plugins</groupId>
                <artifactId>nexus-staging-maven-plugin</artifactId>
                <version>1.6.3</version>
                <extensions>true</extensions>
                <configuration>
                    <serverId>ossrh</serverId>
                    <nexusUrl>https://oss.sonatype.org/</nexusUrl>
                    <autoReleaseAfterClose>true</autoReleaseAfterClose>
                </configuration>
            </plugin>
        </plugins>
    </pluginManagement>
</build>
```

## 2.7 部署
在项目目录下执行部署命令

```
mvn clean deploy -P sonatype-oss-release -Darguments="gpg.passphrase=密钥密码"
```

这是最容易出问题的一部，其中我就遇到了权限不足等问题，记录在此：
1. 认证不通过：查看是否修改maven中的settings文件。因为使用的命令发布，所以settings文件会直接使用maven中默认路径下的文件。
2. gpg加密失败：查看gpg安装情况，并确认版本，看是否有进行额外配置（核对2.3）。

## 2.8 发布
![release]({{ site.url }}/images{{ page.url }}/2018051910153525.jpg)  
1. 访问[https://oss.sonatype.org/#stagingRepositories](https://oss.sonatype.org/#stagingRepositories)
登录后在`Staging Repositories`中查看上一步部署上去的项目。
2. 选中后点击`Close`，这时服务器会对你的项目进行一些检查，如果有问题的话会提示，并且无法进行下一步。
3. 选中后进行`Release`，至此我们的操作全部完成。剩下的就是等待服务器的一些同步之类的操作了。
大约2个小时后，你就可以搜索到你的项目了。
![搜索结果]({{ site.url }}/images{{ page.url }}/20180519151532282.jpg)

# 三、总结
此次发布断断续续的进行了两天左右，因为是第一次发布到中央仓库，所以遇到了很多没有预想到的问题。特此记录下来，希望能给更多的人一些帮助吧。
