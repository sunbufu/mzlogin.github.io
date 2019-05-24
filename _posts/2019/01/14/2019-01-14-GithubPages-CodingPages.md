---
layout: post
title: 博客部署 github 和 coding 双节点
categories: [experience]
description: jekyll, 博客部署 github 和 coding 双节点, github pages 加速
keywords: 双节点, github, coding, github pages 加速
---

# 0. 起因
发博客链接给朋友看的时候，反馈说访问特别慢。之前博客仅部署在 github 上，由于众所周知的原因，国外的服务器在国内访问就是有点慢，这个时候就需要一些 "奇淫巧技" 来帮忙了。

# 1. 经过
## 1.1 方案选择
首先是对问题分析，博客访问慢的原因是因为服务器在国外，经过一番查询后，基本上有一下 3 种解决方案。
1. 在国内租台服务器
2. CDN 加速服务
3. 部署到国内的服务器上  

然后分析下这些方案。
1. 租服务器的方案对于我来说是不乐观的，因为我就是为了不租服务器才选择的 github pages。一方面是因为价格，另一方面是因为维护起来比较麻烦，什么都需要自己去搞，时间和精力都不允许。
2. 本来想通过 CDN 来解决，但是腾讯云的 CDN 需要备案，但我又没有服务器，所以也备不了案，所以这个方案也无法执行了。
3. 国内也有一些类似 github 的代码托管，同时也支持 pages 服务，例如 [coding](https://coding.net/){:target="_blank"}。我们只需要在 push 到 github 的时候同时 push 到 coding 上就可以了。

## 1.2 具体实施
在开始之前需要准备一些东西：
1. 域名（国内买的域名需要实名认证，推荐在 [godaddy](https://www.godaddy.com/){:target="_blank"} 买）
2. coding 的账号 （[coding 注册地址](https://dev.tencent.com/login){:target="_blank"}）

具体步骤如下：
1. 首先我们需要在 coding 建立一个跟你原来 github 库名完全一致的仓库。例如我的是 [sunbufu.github.io](https://dev.tencent.com/u/sunbufu/p/sunbufu.github.io/git){:target="_blank"}。
2. 我们肯定不想发布一个文章的时候，push多次，所以我们需要修改本地 git 的配置文件，添加新的远程仓库地址，使一次 push 可以到多个远程仓库。在你的工程目录里有个隐藏目录 .git，里面有个配置文件 config，添加 `url = https://git.dev.tencent.com/sunbufu/sunbufu.github.io.git`，如下：
```
[remote "origin"]
	url = https://github.com/sunbufu/sunbufu.github.io.git
	fetch = +refs/heads/*:refs/remotes/origin/*
	url = https://git.dev.tencent.com/sunbufu/sunbufu.github.io.git
```
3.  push 上去后，我们需要开启 coding 的 pages。我们希望境外访问的时候被解析到 github，境内访问解析到 coding。  
coding 设置如下：
![coding 设置]({{ site.url }}/images{{ page.url }}/set_coding_pages.png)
域名解析配置如下：
![域名解析配置]({{ site.url }}/images{{ page.url }}/set_dns.png)
其中有几个地方需要注意下：
+ 在绑定新域名的时候，需要在解析上把 coding 给的地址配置成默认才可以，否则 coding 会一直提示 域名未连接。
+ 刚配置完成时浏览器不知道为啥加载不到样式文件，过了一会自己好了。

# 2. 结果
至此，配置就全部完成了。我们成功把博客部署到 github 和 coding 上了，而且 coding 和腾讯有着千丝万缕的关系，所以在国内访问的速度还是可以的。  
所有的都还挺满意的，除了 coding 的构建和部署速度，这么简单的静态页面，本地跑也就几秒，coding 能给你搞十几分钟。哎，叫人不得不吐槽吐槽啊。  
github pages 没有搞起来的同学可以参考我之前的博客 [创建我的博客]({{ site.url }}/2018/06/01/found-my-blog/){:target="_blank"}

