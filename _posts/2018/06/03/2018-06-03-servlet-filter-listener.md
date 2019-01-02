---
layout: post
title: Servlet过滤器和监听器
categories: [java]
description: Servlet过滤器和监听器
keywords: servlet filter, servlet listener
---

# 一、过滤器

实现`javax.servlet.Filter`接口；
一般客户端发出请求后会交给Servlet；如果过滤器存在，则客户端发出的请求都是先交给过滤器，然后交给Servlet；

我们可以完成一些在执行Servlet之前必须要做的事，比如`request.setCharacterEncoding("UTF-8")`;
必须实现以下方法：

1. `public void init(FilterConfig config) throws ServletException{}`
2. `public void doFilter(ServletRequest req,ServletResponse resp,FilterChain chain){}`
3. `public void destroy(){}`

注意：

1. `init`方法在Web容器初始化时就会调用；
2. `doFilter`的参数是`ServletRequest`和`ServletResponse`而不是`Http`的；
3. `FilterChain`含有`public void doFilter(ServletRequest req,ServletResponse resp){}`
4. 一般代码形式如下：

```java
public void doFilter(ServletRequest req,ServletResponse resp,FilterChain chain){
    chain.doFilter(req,resp);//执行Servlet操作；
}
```

则这个函数会调用两次，一次是执行`chain.doFilter`之前，一次是执行`chain.doFilter()`之后；
写完过滤器后，我们必须要限制过滤器调用的范围，即域名为多少时会调用过滤器，我们在`web.xml` 中进行配置；

```xml
<filter>
    <filter-name></filter-name>
    <filter-class></filter-class>
</filter>
<filter-mapping>
    <filter-name></filter-name>
    <url-pattern></url-pattern>            <!--过滤器应用的范围，如果为/*，则如果域名设置形如/a 或/abc等都会调用过滤器-->
</filter-mapping>
```

# 二、监听器

监听器的作用类似于`Swing`中的监听器的作用，效果也差不多，即当某个事件发生时，就触发了某个设置好的监听器，这里监听器能监听`application`、`session`、`request`对象。
写好监听器类后需要配置`web.xml`,形式如下：

```xml
<listener>
    <listener-class></listener-class>
</listener>
```

## 1.application监听器：`ServletContextListener`
需要实现的方法：
 1. `public void contextInitialized(ServletContextEvent e);       //在web容器初始化是就调用`
 2. `public void contextDestroyed(ServletContextEvent e);        //当web容器销毁时调用`
`ServletContextEvent`含有`getServletContext()`方法取得`application`对象；

## 2.application属性监听器：`ServletContextAttributeListener`
需要实现的方法：
 1. `public void attributeAdded(ServletContextAttributeEvent e);            //当调用application.setAttribute()时调用`
 2. `public void attributeRemoved(ServletContextAttributeEvent e); //当调用applcaition.removeAttribute()时调用`
 3. `public void attributeReplaced(ServletContextAttributeEvent e);        //当调用两次application.setAttribute()赋予相同属性时调用`

`ServletContextAttributeEvent` 的方法有：
 1. `getName();`
 2. `getValue();`

## 3.session监听器：`HttpSessionListener`
需要实现的方法：
 1. `public void sessionCreated(HttpSessionEvent e);                //当调用关于session对象的方法时，比如session.getId()`
 2. `public void sessionDestroyed(HttpSessionEvent e);            //当调用session.invalidate();或超时 时调用`
`HttpSessionEvent`的方法有`getSession();`   

## 4.session属性监听器：`HttpSessionAttributeListener`
需要实现的方法：
 1. `public void attributeAdded(HttpSessionBindingEvent e);            //当调用session.setAttribute()时调用`
 2. `public void attributeRemoved(HttpSessionBindingEvent e);        //当调用session.removeAttribute()时调用`
 3. `public void attributeReplaced(HttpSessionBindingEvent e);         //当调用两次session.setAttribute()赋予相同属性时调用`

`HttpSessionBindingEvent`方法：
 1. `getSession();`
 2. `getName();`
 3. `getValue();`

## 5.`session`属性绑定监听器：HttpSessionBindingListener
需要实现的方法：
 1. `public void valueBound(HttpSessionBindingEvent e);`                   
 2. `public void valueUnbound(HttpSessionBindingEvent e);`

注意：这个监听器不用在`web.xml`中进行配置，而自动生效。
当实现这个接口的类被作为属性添加如内置对象时，就会触发`valueBound`；当删除这个属性时，则会触发`valueUnbound`；
比如

```java
class A implements HttpSessionBindingListener{
    .....
    public void valueBound(HttpSessionBindingEvent e){}
    public void valueUnbound(HttpSessionBindingEvent e){}
}
```

当调用`session.setAttribute("info",new A())`时即添加A类对象时，则会触发`valueBound`方法，当调用`session.removeAttribute("info")`时触发`valueUnbound`方法；

## 6.`request`监听器：`ServletRequestListener`
需要实现的方法：
 1. `public void requestInitialized(ServletRequestEvent e);        //当请求一个网页时会调用`
 2. `public void requestDestroyed(ServletRequestEvent e);       //当请求结束时会调用`

`ServletRequestEvent` 方法：
 1. `getServletContext();`
 2. `getServletRequest();`

## 7.request属性监听器：`ServletRequestAttributeListener`
需要实现的方法：
 1. `attributeAdded(ServletRequestAttributeEvent e);                            //当调用request.setAttribute()时调用`
 2. `attributeRemoved(ServletRequestAttributeEvent e);                     //当调用request.removeAttribute()时调用`
 3. `attributeReplaced(ServletRequestAttributeEvent e);                     //当调用两次request.setAttribute()赋予相同属性时调用`

`ServletRequestAttributeEvent` 方法：
 1. `getName();`
 2. `getValue();`

转自[xiazdong](http://blog.csdn.net/xiazdong/article/details/6900480)