---
layout: post
title: Servlet分析Request和Response
categories: [java]
description: servlet分析request和response
keywords: java web, servlet
---

分析Request
```java
import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Interface
 * 		servlet容器（服务器）创建了这个对象,和服务器耦合性高
 * 为了让解析请求信息更加的方便
 * 		行
 * 		头
 * 		网
 * 		体		
 */
public class HiServlet extends HttpServlet {
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//获取请求行信息
		getRequestLine(request);
		//获取请求头信息
		getRequestHeader(request);
		//获取网络信息信息
		getRequestNet(request);
		//获取请求体信息
		getRequestBody(request);
	}

	/**
		 * 获取请求行信息
		 * @param request
		 */
	private void getRequestLine(HttpServletRequest request) {
		System.out.println("请求方式" + request.getMethod());
		System.out.println("资源路径url" + request.getRequestURL());
		System.out.println("资源路径uri" + request.getRequestURI());
		System.out.println("协议" + request.getScheme());
		System.out.println("协议版本" + request.getProtocol());
		System.out.println("项目名称" + request.getContextPath());
	}

	/**
	 * 获取请求头信息
	 * @param request
	 */
	private void getRequestHeader(HttpServletRequest request) {
		//获取指定的请求头信息
		System.out.println("User-Agent:" + request.getHeader("User-Agent"));
		System.out.println("User-Agent:" + request.getHeader("User-Agent".toLowerCase()));//大小写无影响
		System.out.println("User-Agent:" + request.getHeader("User-Agent".toUpperCase()));
		//获取所有的请求头信息
		Enumeration<String> headerNames = request.getHeaderNames();
		//遍历所有的名字
		while (headerNames.hasMoreElements()) {
			//获取请求头的名字
			String headerName = headerNames.nextElement();
			//获取名字对应的值
			System.out.println(headerName + ":" + request.getHeader(headerName));
		}
	}

	/**
	 * 获取网络信息
	 * @param request
	 */
	private void getRequestNet(HttpServletRequest request) {
		System.out.println("服务器信息:" + request.getLocalAddr() + ":" + request.getLocalPort());
		System.out.println("客户端信息:" + request.getRemoteAddr() + ":" + request.getRemotePort());
	}

	/**
	 * 获取请求参数
	 * @param request
	 */
	private void getRequestBody(HttpServletRequest request) {
		//获取请求参数对应的值
		System.out.println("用户名" + request.getParameter("uname"));//text
		System.out.println("密码" + request.getParameter("pwd"));//password
		System.out.println("电子邮箱" + request.getParameter("email"));//text
		System.out.println("年龄" + request.getParameter("age"));//text
		System.out.println("真实姓名" + request.getParameter("realname"));//text
		System.out.println("性别" + request.getParameter("gender"));//radio
		//一对多的时候
		String[] favs = request.getParameterValues("fav");//checkbox
		//判断是否为空
		if (favs != null && favs.length >= 1) {
			//遍历
			for (int i = 0; i < favs.length; i++) {
				System.out.println(favs[i]);
			}
		}
	}
}

```
分析Response
```java
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 服务器创建了这个对象
 * 		行
 * 		头
 * 		体
 * @author Administrator
 *
 */
public class HiServlet extends HttpServlet {
	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		System.out.println("HiServlet.service()");
		//响应行(一般不需要程序员手动操作
		//		resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
		//响应头
		resp.setHeader("Server", "Tomcat");
		//不能设置同名的值，新值会覆盖掉上一个值
		resp.setHeader("hello", "bjsxt");
		resp.setHeader("hello", "sxt");
		//允许多个同名的值
		resp.addHeader("hi", "hanmeimei");
		resp.addHeader("hi", "lilei");
		//设置mime类型(可以解决中文乱码)
		resp.setCharacterEncoding("UTF-8");
		resp.setHeader("content-type", "text/html;charset=utf-8");
		//响应实体内容
		resp.getWriter().print("<h1>hello <font onclick='alert(1234567890);' color='red'>汉字</font>  jin liang bu yao chu xian zhong wen" + Math.random() + " </h1>");
	}
}
```