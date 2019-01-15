---
layout: post
title: Spring Cloud 保证微服务内安全
categories: [java, spring]
description: Spring Cloud 保证微服务内安全
keywords: Spring Cloud
---

# 一、简介
在微服务的架构下，我们需要把系统的业务划分成多个单一的微服务。每个微服务都会提供接口供其他微服务调用，在Dubbo中可以通过rmi、nio等实现，Spring Cloud中是通过http调用的。但有些时候，我们只希望用户通过我们的网关调用微服务，不允许用户直接请求微服务。这时我们就可以借助Spring Security来保障安全。

# 二、使用步骤
## 2.1 在提供接口的微服务项目中配置Spring Security
1 首先在pom.xml引入Spring Security的相关配置，如下

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

2 在qpplication.yml中配置账号密码，如下

```yml
security:
  basic:
    enabled: true
  user:
    name: sunbufu
    password: 123456
```

3 此时访问接口发现已经需要认证了。  
![需要认证]({{ site.url }}/images{{ page.url }}/20180208111542235.jpg)  
输入正确的账号和密码后就可以访问了。  

## 2.2在调用微服务项目中配置Feign的账号密码
1 在application.yml中配置账号密码

```yml
security:
  user:
    name: sunbufu
    password: 123456
```

2 添加Feign的配置文件

```java
package com.sunbufu.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.auth.BasicAuthRequestInterceptor;

@Configuration
public class FeignConfiguration {
	
	@Value("${security.user.name}")
	private String userName;
	
	@Value("${security.user.password}")
	private String passWord;
	
    @Bean
    public BasicAuthRequestInterceptor basicAuthRequestInterceptor(){
        return new BasicAuthRequestInterceptor(userName, passWord);
    }
}
```

3 这样完成后，就可以正常的访问了。
![正常访问]({{ site.url }}/images{{ page.url }}/20180208112147404.jpg)

# 三、实例

![工程介绍]({{ site.url }}/images{{ page.url }}/20180208105341622.jpg)

[源码地址](https://github.com/sunbufu/sunbufu-cloud)

下面是这4个工程的说明：
 1. sunbufu-erueka：Eureka服务的工程
 2. sunbufu-hello-face：服务接口的定义工程，其中包括定义微服务需要实现什么功能，其他微服务怎么调用，以及feign的配置
 3. sunbufu-hello-impl：服务接口的实现工程，实现了sunbufu-hello-face定义的功能
 4. sunbufu-hello-web：服务的网关工程，主要为了调用sunbufu-hello-face

