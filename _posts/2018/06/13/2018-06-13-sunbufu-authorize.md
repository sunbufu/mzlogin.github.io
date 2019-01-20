---
layout: post
title: authorize(基于注解的权限认证框架)
categories: [open source]
description: authorize(基于注解的权限认证框架)
keywords: authorize
---

# 一、是什么
很多项目都会用到权限管理，目前流行的权限框架（Apache Shiro，Spring Security等）在使用的时候都觉得很繁琐，特别是在一些小型的项目中。有时候我会想，如果通过注解的方式，直接把权限注解到访问的接口方法上那该有多好。  
[`authorize`](https://github.com/sunbufu/sunbufu-authorize)就是一个为了解决这个问题，通过注解配置权限，借助拦截器进行权限检查的一个开源权限框架。使用起来就像下面这种感觉。

```java
@Access("manage")
@RequestMapping("index")
public String index() {
    return "this is index page";
}
```

`@Access`是这个框架的注解。通过注解配置权限的方式，解决权限认证的问题，不管是写代码还是读代码，都感觉更清晰了许多。

# 二、如何用
## 2.1 快速使用
可以参照示例[authorize-demo](https://github.com/sunbufu/sunbufu-authorize)
### 2.1.1 引入maven依赖

```xml
<dependency>
    <groupId>com.github.sunbufu</groupId>
    <artifactId>authorize-starter</artifactId>
    <version>1.0.0-RELEASE</version>
</dependency>
```

### 2.1.2 实现`IAuthorizeService`
在`IAuthorizeService`的实现类中，至少应该实现3个方法：

1. 登录方法：登录成功后，把用户信息存放到`session`中
2. 鉴权方法（`authorize`）：通过比对用户和请求方法的权限，返回该用户是否可以访问
3. 鉴权失败方法（`authorizeFail`）：用户没有权限时，需要进行的处理方法

登录：

```java
public User logIn(String userName, String passWord, HttpSession session) {
    User user = users.get(userName);
    if (!user.getPassWord().equals(passWord)) {
        return null;
    }
    session.setAttribute(USER_SESSION_KEY, user);
    return user;
}
```

鉴权：

```java
@Override
public boolean authorize(String[] access, HttpSession session) {
    User user = (User) session.getAttribute(USER_SESSION_KEY);
    if (user != null && user.getAccess() != null && user.getAccess().isEmpty()) {
        for (String requestAccess : access) {
            if (user.getAccess().contains(requestAccess)) {
                return true;
            }
        }
    }
    return false;
}
```

鉴权失败：

```java
@Override
public void authorizeFail(HttpServletRequest request, HttpServletResponse response) {
	response.sendRedirect("authorizeError?message=your account have not enought authority");
}
```

### 2.1.3 通过注解配置到`controller`上

```java
@Access("manage")
@RequestMapping("index")
public String index() {
    return "this is index page";
}
```

### 2.1.4 完成
`authorize`的目的是借助注解，快速的完成一些简单的权限管理功能，所以从使用到配置上力争尽量的简单、快捷。  
完整示例地址[authorize-demo](https://github.com/sunbufu/sunbufu-authorize)。

## 2.2 框架介绍
`authorize`框架主要包括`authorize-core`和`authorize-starter`。

### 2.2.1 `authorize-core`
`authorize-core`是整个框架的核心和主要的逻辑部分，主要包括注解`Access`、拦截器`AccessInterceptor`、权限认证接口`IAuthorizeService`。

1. `IAuthorizeService`主要包括3个方法的声明，其中有2个方法必须实现：`authorize`(鉴权)和`authorizeFail`(鉴权失败)，1个方法选择实现：`authorizeSuccess`(鉴权成功)。
2. `AccessInterceptor`会拦截所有的请求，并对注解`@Access`的进行鉴权。首先会把注解在`controller`上的权限和注解在具体方法上的权限合并，然后调用`IAuthorizeService`实现类的鉴权方法`authorize`。成功调用`authorizeSuccess`(鉴权成功)，失败则调用`authorizeFail`(鉴权失败)。

### 2.2.2 `authorize-starter`
`authorize-starter`是为`spring boot`提供的一个快速配置。主要是配置了`authorize-core`的拦截器`AccessInterceptor`。

# 三、总结
`authorize`是为了快速便捷进行权限管理的开源框架，在github上开源地址是[https://github.com/sunbufu/sunbufu-authorize](https://github.com/sunbufu/sunbufu-authorize)。欢迎大家关注、加星，也欢迎大家随时联系我[sunyoubufu@163.com]()，谢谢。
