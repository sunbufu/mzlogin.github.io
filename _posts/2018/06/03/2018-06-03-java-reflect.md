---
layout: post
title: Java反射
categories: [java]
description: Java反射的简单介绍
keywords: java, reflect
---

# 一、Java反射

## 1.1 Java反射的定义
JAVA反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的方法的功能称为java语言的反射机制。
JAVA反射（放射）机制：“程序运行时，允许改变程序结构或变量类型，这种语言称为动态语言”。从这个观点看，Perl，Python，Ruby是动态语言，C++，Java，C#不是动态语言。但是JAVA有着一个非常突出的动态相关机制：Reflection，用在Java身上指的是我们可以于运行时加载、探知、使用编译期间完全未知的classes。换句话说，Java程序可以加载一个运行时才得知名称的class，获悉其完整构造（但不包括methods定义），并生成其对象实体、或对其fields设值、或唤起其methods。

## 1.2 反射机制的作用：
1. 反编译：`*.class`-->`*.java`
2. 通过反射机制访问java对象的属性，方法，构造方法等；

## 1.3 反射相关类

```java
java.lang.Class;                
java.lang.reflect.Constructor; 
java.lang.reflect.Field;        
java.lang.reflect.Method;
java.lang.reflect.Modifier;
```

# 二、具体功能实现

## 2.1 反射机制获取类有三种方法，我们来获取`Employee`类型 

```java
//第一种方式：注意此处的Employee必须是全路径名(包名+文件名)
Classc1 = Class.forName("Employee");
//第二种方式：
//java中每个类型都有class属性.
Classc2 = Employee.class;
//第三种方式：
//java语言中任何一个java对象都有getClass 方法
Employeee = new Employee();
Classc3 = e.getClass(); //c3是运行时类 (e的运行时类是Employee)
```

## 2.2 创建对象：获取类以后我们来创建它的对象，利用`newInstance`：

```java
Class c =Class.forName("Employee"); 
//创建此Class 对象所表示的类的一个新实例
Objecto = c.newInstance(); //调用了Employee的无参数构造方法.
```

## 2.3 获取属性：分为所有的属性和指定的属性：
a，先获取所有的属性的写法：

```java
//获取整个类
Class c = Class.forName("java.lang.Integer");
//获取所有的属性
Field[] fs = c.getDeclaredFields();
//定义可变长的字符串，用来存储属性
StringBuffer sb = new StringBuffer();
//通过追加的方法，将每个属性拼接到此字符串中
//最外边的public(访问修饰符)定义
sb.append(Modifier.toString(c.getModifiers()) + " class " + c.getSimpleName() +"{\n");
//里边的每一个属性
for(Field field:fs){
	sb.append("\t");//制表符			
	sb.append(Modifier.toString(field.getModifiers())+" ");//获得属性的修饰符，例如public，static等等
	sb.append(field.getType().getSimpleName() + " ");//属性的类型的名字
	sb.append(field.getName()+";\n");//属性的名字+回车
}
sb.append("}");
System.out.println(sb);
```

 b，获取特定的属性，对比着传统的方法来学习：
 
```java
public static void main(String[] args) throws Exception {
	//以前的方式：  
	/* 
	User u = new User(); 
	u.age = 12; //set 
	System.out.println(u.age); //get 
	*/
	
	//获取类  
	Class c = Class.forName("User");
	//获取id属性  
	Field idF = c.getDeclaredField("id");
	//实例化这个类赋给o  
	Object o = c.newInstance();
	//打破封装(JVM运行时不检查属性修饰符)  
	idF.setAccessible(true); //使用反射机制可以打破封装性，导致了java对象的属性不安全。  
	//给o对象的id属性赋值"110"  
	idF.set(o, "110"); //set  
	//get  
	System.out.println(idF.get(o));
}
```

## 2.4 获取方法，和构造方法，不再详细描述，只来看一下关键字：

|方法关键字|含义|
|--|--|
|`getDeclaredMethods()`|获取所有的方法|
|`getReturnType()`|获得方法的返回类型|
|`getParameterTypes()`|获得方法的形式参数类型|
|`getDeclaredMethod("方法名",参数类型.class,……)`|获得特定的方法|
 
|构造方法关键字|含义|
|--|--|
|`getDeclaredConstructors()`|获取所有的构造方法|
|`getDeclaredConstructor(参数类型.class,……)`|获取特定的构造方法|
 
|父类和父接口|含义|
|--|--|
|`getSuperclass()`|获取某类的父类|
|`getInterfaces()`|获取某类实现的接口|

**补充：**在获得类的方法、属性、构造函数时，会有`getXXX`和`getDeclaredXXX`两种对应的方法。之间的区别在于前者返回的是访问权限为`public`的方法和属性，包括父类中的；但后者返回的是所有访问权限的方法和属性，不包括父类的。

# 三、Java反射总结

## 3.1 Java反射的一般用法（步骤）
使用java的反射机制，一般需要遵循三步：

1. 获得你想操作类的`Class`对象
2. 通过第一步获得的`Class`对象去取得操作类的方法或是属性名
3. 操作第二步取得的方法或是属性

实例：

```java
/**
 * Java 反射练习。
 */
public class ReflectionTest {
    public static void main(String[] args) throws Exception {
        DisPlay disPlay = new DisPlay();
        // 获得Class
        Class<?> clazz = disPlay.getClass();
        // 通过Class获得DisPlay类的show方法
        Method method = clazz.getMethod("show", String.class);
        // 调用show方法
        method.invoke(disPlay, "Hello");
    }
}

class DisPlay {
    public void show(String name) {
        System.out.println("Hello :" + name);
    }
}
```

## 3.2 Java反射分析

### 3.2.1 反射的用途 (Uses of Reflection)
反射被广泛地用于那些需要在运行时检测或修改程序行为的程序中。这是一个相对高级的特性，只有那些语言基础非常扎实的开发者才应该使用它。如果能把这句警示时刻放在心里，那么反射机制就会成为一项强大的技术，可以让应用程序做一些几乎不可能做到的事情。

### 3.2.2 反射的缺点 (Drawbacks of Reflection)
尽管反射非常强大，但也不能滥用。如果一个功能可以不用反射完成，那么最好就不用。在我们使用反射技术时，下面几条内容应该牢记于心：

**性能第一** 反射包括了一些动态类型，所以JVM无法对这些代码进行优化。因此，反射操作的效率要比那些非反射操作低得多。我们应该避免在经常被 执行的代码或对性能要求很高的程序中使用反射。

**安全限制** 使用反射技术要求程序必须在一个没有安全限制的环境中运行。如果一个程序必须在有安全限制的环境中运行，如Applet，那么这就是个问题了

**内部暴露** 由于反射允许代码执行一些在正常情况下不被允许的操作（比如访问私有的属性和方法），所以使用反射可能会导致意料之外的副作用－－代码有功能上的错误，降低可移植性。反射代码破坏了抽象性，因此当平台发生改变的时候，代码的行为就有可能也随着变化。

参考[JAVA中的反射机制](http://blog.csdn.net/liujiahan629629/article/details/18013523)、[JAVA反射机制-百度百科](http://baike.baidu.com/link?url=Q4KEQp6Gc7ZFNWZASTkjANz_R374M2kQC0m5F9eKsKKDCehtRgVm6_O4141Mw_yb9Y_o-KOg1amdft4KqAEOFq)、[Java 反射机制浅析](http://www.cnblogs.com/gulvzhe/archive/2012/01/27/2330001.html)、[Java反射机制的缺点](http://www.cnblogs.com/dyllove98/archive/2013/06/15/3137620.html)