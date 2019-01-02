---
layout: post
title: 数据库工具类
categories: [java]
description: 数据库工具类
keywords: java, jdbc
---

`DataBaseUtil.properties`
```
##choose which database
datatype=mysql
##oracle
oracleDriver=oracle.jdbc.driver.OracleDriver
oracleUrl=jdbc:oracle:thin:@127.0.0.1:1521:xe
oracleUser=scott
oraclePassword=tiger
##mysql
mysqlDriver=com.mysql.jdbc.Driver
mysqlUrl=jdbc:mysql://127.0.0.1:3306/bjsxt20151014
mysqlUser=root
mysqlPassword=123456
```

`DBUtils.java`

```java
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class DBUtils {
	//获取数据库配置信息
		private static Properties properties = new Properties();
		//定义JDBC需要的参数
		private static String datatype = null;
		private static String driver = null;
		private static String url = null;
		private static String user = null;
		private static String password = null;

		static {
			//可以保证只加载一次，而且调用的时候肯定已经加载完成
			try {
				//加载配置文件
				properties.load(DBUtils.class.getClassLoader().getResourceAsStream("DataBaseUtil.properties"));
				//获取配置文件里的配置信息
				datatype = properties.getProperty("datatype");
				driver = properties.getProperty(datatype + "Driver");
				url = properties.getProperty(datatype + "Url");
				user = properties.getProperty(datatype + "User");
				password = properties.getProperty(datatype + "Password");
				//加载驱动
				Class.forName(driver);
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		/**
		 * 获取连接
		 * @return
		 */
		public static Connection getConnection() {
			Connection connection = null;
			try {
				connection = DriverManager.getConnection(url, user, password);
			} catch (SQLException e) {
				System.out.println("DataBaseUtil.getConnection()" + url + ":" + user + ":" + password);
				e.printStackTrace();
			}
			return connection;
		}

		/**
		 * 关闭连接
		 * @param connection
		 */
		public static void closeConnection(Connection connection) {
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}

		/**
		 * 获取清单对象
		 * @param connection
		 * @return
		 */
		public static Statement getStatement(Connection connection) {
			Statement statement = null;
			try {
				//判断连接是否为空 如果为空创建一个新的
				if (connection == null) {
					connection = getConnection();
				}
				statement = connection.createStatement();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			return statement;
		}

		/**
		 * 关闭清单对象
		 * @param statement
		 */
		public static void closeStatement(Statement statement) {
			if (statement != null) {
				try {
					statement.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}

		/**
		 * 获取预处理清单对象
		 * @param connection
		 * @param sql
		 * @return
		 */
		public static PreparedStatement getPstmt(Connection connection, CharSequence sql) {
			PreparedStatement preparedStatement = null;
			try {
				//判断连接是否为空 如果为空创建一个新的
				if (connection == null) {
					connection = getConnection();
				}
				preparedStatement = connection.prepareStatement(sql.toString());
			} catch (SQLException e) {
				e.printStackTrace();
			}
			return preparedStatement;
		}

		/**
		 * 关闭结果集合
		 * @param resultSet
		 */
		public static void closeResultSet(ResultSet resultSet) {
			if (resultSet != null) {
				try {
					resultSet.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}

		/**
		 * 释放所有的资源
		 * @param connection
		 * @param statement
		 * @param resultSet
		 */
		public static void closeAll(Connection connection, Statement statement, ResultSet resultSet) {
			closeResultSet(resultSet);
			closeStatement(statement);
			closeConnection(connection);
		}

		/**
		 * 将结果集合里面的数据存放至容器
		 * @param resultSet
		 * @param clazz
		 * @return
		 */
		public static <T> List<T> resultset2list(ResultSet resultSet, Class<T> clazz) {
			//声明一个容器
			List<T> list = new ArrayList<T>();
			try {
				//将结果集中的数据注入给对象(遍历)
				while (resultSet.next()) {
					//确定要注入值的对象
					T bean = clazz.getConstructor(null).newInstance(null);
					//获取列的名字(属性的名字和列的名字正好对应)
					Field[] dfs = clazz.getDeclaredFields();
					//开始遍历属性
					for (int i = 0; i < dfs.length; i++) {
						//获取当前属性
						Field field = dfs[i];
						//获取属性的名字
						String fname = field.getName();
						//获取属性对应的值
						Object fvalue = resultSet.getObject(fname);
						//将值注入给对象(因为属性是私有的，所以这种方式被否决)
						//					field.set(bean, fvalue);
						//获取属性对应的set方法
						String methodName = "set" + fname.toUpperCase().substring(0, 1) + fname.substring(1);
						//获取对应的方法
						Method method = clazz.getMethod(methodName, field.getType());
						//执行方法
						method.invoke(bean, fvalue);
					}
					//将对象存放至List
					list.add(bean);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			//返回数据
			return list;
		}
}
```