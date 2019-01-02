---
layout: post
title: 重定向与请求转发
categories: [basis]
description: 重定向与请求转发
keywords: http
---

# 一、请求转发与重定向

## 1. 重定向
客户发送一个请求到服务器，服务器匹配servlet，这都和请求转发一样，servlet处理完之后调用了`sendRedirect()`这个方法，这个方法是response的方法，所以，当这个servlet处理完之后，看到`response.senRedirect()`方法，立即向客户端返回这个响应，响应行告诉客户端你必须要再发送一个请求，去访问`student_list.jsp`，紧接着客户端受到这个请求后，立刻发出一个新的请求，去请求`student_list.jsp`,这里两个请求互不干扰，相互独立，在前面request里面`setAttribute()`的任何东西，在后面的request里面都获得不了。可见，在`sendRedirect()`里面是两个请求，两个响应。
```sequence
浏览器->服务器:http请求
服务器->浏览器:接受请求并发送302状态码和新的url
浏览器->服务器:自动请求新的url
服务器->浏览器:寻找客户所需的资源响应到浏览器
```

## 2. 请求转发
客户首先发送一个请求到服务器端，服务器端发现匹配的servlet，并指定它去执行，当这个servlet执行完之后，它要调用`getRequestDispacther()`方法，把请求转发给指定的`student_list.jsp`,整个流程都是在服务器端完成的，而且是在同一个请求里面完成的，因此servlet和jsp共享的是同一个request，在servlet里面放的所有东西，在`student_list`中都能取出来，因此，`student_list`能把结果`getAttribute()`出来，`getAttribute()`出来后执行完把结果返回给客户端。整个过程是一个请求，一个响应。
```sequence
浏览器->服务器:http请求
Note right of 服务器:服务器调用内部的一个方法在容器内完成请求处理和转发动作
服务器->浏览器:将客户所需资源发送到浏览器
```

# 二、请求转发与重定向在Java中的使用

servlet可以将发送给自己的某个请求转发给另外一个URL地址，这个地址可以是html、jsp、servlet或是其他的http地址。servlet的请求转发有三种方式： 
1. `inclue`(请求转发)方法，应用代码为
```
request.getRequestDispatcher("/url").include(request, response);
```
其中URL地址是某个http地址。include转发时，地址栏没有改变，是原来的地址，这个过程是在服务器端完成，Servlet和被包含的页面同时被输出。`include()` 方法执行玩后，下面的代码继续执行。
2. `forward`(请求转发)方法，
```
request.getRequestDispatcher("/url").forward(request,response);
```
地址栏也不会改变，同样是在服务器端完成，但仅输出被转发的URL中的内容。`forward()`方法执行完后，它下面的代码将不再执行。
3. `sendRedirect`(重定向)，只是客户重新发起一个请求，第二个请求指向其参数url。一般称做重定向，客户端的地址栏将改变为url值，是由客户端发起的第二次请求。参数中要写明具体的url地址，因为当客户端再次发送请求时，会直接请求web服务器根目录。要是要转发的一个html地址，它在WEB-INF文件夹下，那么要从servlet转发到这个 
html地址，必须加上当前的web路劲名，这个路劲名可以通过request.getContextPath()获得，那么该转发代码可以为
```
response.sendRedirect(request.getContextPath()+"/login.html"); 
```

**注意：**重定向是浏览器向服务器重新发出请求，但转发相当于把request的范围扩大，例如： 
在a界面有个连接`<a href="b.jsp?id=1">`,在b界面可以通过`request.getAttribute("id")`获得， 
在b界面也有个连接`<a href="c.jsp?name="123">`,则在界面用`request.getAttribute("id")`就取不到值。这是每个连接就像一个重定向，相当于重新创建了一个request，当b->c时，a->b的request已经结束了。 
接下来，在c的界面前加`<jsp:forward page="d.jsp"/>` ，那么变量name在c、d都有效，所以在d想取到参数name的值，不必要把参数值放到session里来扩大他的范围。