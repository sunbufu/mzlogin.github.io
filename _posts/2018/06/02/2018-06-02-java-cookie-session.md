---
layout: post
title: java下的cookie和session
categories: [basis]
description: java下的cookie和session
keywords: java web
---

1. Session是一种服务器端技术， Session 对象在服务器端创建，通常采用散列表来存储信息，例如， Tomcat 的 Session 实现采用 HashMap 对象来存储属性名和属性值。
2. Cookie是由 Netscape 公司发明的、用于跟踪用户会话的一种方式。 Cookie 是由服务器发送给客户的片段信息，存储在客户端浏览器的内存中或硬盘上，在客户随后对该服务器的请求中发回它。
3. Cookie小结
1) Cookie在服务端创建 
```
Cookie cookie = new Cookie(name,value);
```
2) Cookie保存在浏览器端 
```
response.addCookie(cookie);
```
3) Cookie的生命周期和上传路径均可指定。
```
Cookie cookie = new Cookie("mykey", "myvalue");//新建cookie
cookie.setMaxAge(60 * 60 * 24);//设置cookie的生命周期是一天
cookie.setPath(req.getContextPath() + "/cookie.action");//只有在访问/cookie.action时才会上传
resp.addCookie(cookie);//添加cookie
```
4) Cookie可以被多个浏览器共享
5) 一个web应用可以保存多个cookie(放置在同一个文件内部) ,最多不要超过20个,每个Cookie的大小限制为4kB,因此Cookie不会塞满你的硬盘更不会被作为"拒绝服务"的攻击手段。浏览器一般保存的Cookie不会超过300个
6) Cookie存放中文,出现的乱码问题
```
//存放
String val = java.net.URLEncoder.encode("中文名称","utf-8");
Cookie cookie = new Cookie("name","val");
//读出
String val = java.net.URLDecoder.decode(cookie.getValue("name"),"utf-8");
out.println("name="+val)
```
4. session小结:
1) Session是存放在**服务器的内存**中
```
HttpSession session = req.getSession();
```
2) 一个用户浏览器,独享一个session域对象
3) Session中的属性的**默认**生命周期是**30min**,可以通过web.xml和`setMaxInactiveInterval()`来修改
4) Session中可以存放多个属性(包括对象)
5) 如果`session.setAttribute(name,value);`中`name`相同,则会替换掉。

5. Session 对比 Cookie ：
1) 存储位置不同： Cookie存在在**客户端**(临时文件夹,不限时间的存储在内存) Session存在**服务器内存**中,一个session域对象为一个用户浏览器服务
2) 安全性： Cookie以明文方式存放在客户端,安全较弱,可以通过MD5加密算法再存放 Session存放在服务器端内存中,所以安全性较好
3) 网络传输量： Cookie会传递信息给服务器 Session的属性值不会给客户端
4) 生命周期： Cookie的声明周期是累计时间 Session的生命周期是访问session的**间隔时间**,在一些情况下session也会失效，例如：关闭tomcat,reload web应用,时间到,调用invalidate()[安全退出]
5) 从访问范围 ：Session为一个浏览器独享 Cookie为多个用户浏览器共享 因为session会占用服务器的内存,因此不要向session存放过多、过大的对象,会影响性能。
