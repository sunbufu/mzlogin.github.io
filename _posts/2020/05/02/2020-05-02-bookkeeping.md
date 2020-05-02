---
layout: post
title: bookkeeping 使用教程
categories: [open source]
description: bookkeeping 使用教程
keywords: bookkeeping, 教程
---

# 一 介绍

一款开源永久免费的 webdav 记账 app   
开源地址：<https://github.com/sunbufu/bookkeeping>  
酷安地址：<https://www.coolapk.com/apk/261672>  
  
特点：
 + 开源且永久免费，欢迎监督，也欢迎 issue 和 pr
 + 不申请多余权限，后台纯净
 + 完全依赖 webdav，没有其他服务器，不会滥用用户数据

之前一直在使用圈子账本，刚开始还挺好，后来的广告越来越多，启动越来越慢，各种地方想变现，有点恶心了。找了一圈没找到喜欢的 app，索性自己用 flutter 开发一个，开源并放在了 github 上。欢迎大家下载使用，也欢迎大家的意见，更欢迎大家 PR。

# 二 配置

配置过程主要是对 webdav 的配置，我使用[坚果云](https://www.jianguoyun.com/)作为服务器，以下也以坚果云为例，其它服务类似。

## 2.1 webdav 创建目录
首先需要在 webdav 服务器新建目录 bookkeeping，用于保存 app 配置和数据。
![新建目录]({{ site.url }}/images{{ page.url }}/webdav_create_directory.png)

## 2.2 创建 webdav 第三方账号
在【账户信息】>【安全选项】>【第三方应用管理】中新建账号，也可以参考坚果云[官方示例](http://help.jianguoyun.com/?p=2064)。
![新建账号]({{ site.url }}/images{{ page.url }}/webdav_create_account.png)

## 2.3 在 bookkeeping 中配置
点击右上角菜单中的设置账号。
![设置]({{ site.url }}/images{{ page.url }}/setting.png)
 + 昵称：随便取
 + webdav url：webdav的地址【注意，此处需要加上目录名称，例如：https://dav.jianguoyun.com/dav/bookkeeping】
 + 账号：webdav 的账户名
 + 密码：webdav 的密码【注意，坚果云中需要点击"显示密码"复制出来】setting.png

至此，配置已经全部完成，enjoy it :)

# 三 导入导出

TODO.

# 四 关于

