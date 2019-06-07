---
layout: post
title: 单例模式的实现
categories: [design patterns]
description: design patterns, 单例模式, singleton
keywords: pages, pwa
---

# 一、定义
单例模式，是一种常用的软件设计模式。在它的核心结构中只包含一个被称为单例的特殊类。通过单例模式可以保证系统中，应用该模式的一个类只有一个实例。即一个类只有一个对象实例。    
详情可以参考之前的博客 [单例模式]({{ site.url }}/2018/06/06/design-patterns-01/#3单例模式singleton){:target="_blank"}。
# 二、实现
## 2.1 基本实现
单例模式可以笼统的分为 饿汉式 和 懒汉式。
```java
// 饿汉式
public class Singleton {
    /** 私有的构造方法 */
    private Singleton() {
    }
    /** 私有的静态的对象 */
    private static Singleton singleton = new Singleton();
    /** 公共的静态的获取对象的方法 */
    public static Singleton getInstance(){
        return singleton;
    }
}
```
```java
// 懒汉式
public class Singleton {
    /* 持有私有静态实例，防止被引用，此处赋值为null，目的是实现延迟加载 */
    private static Singleton instance = null;
    /* 私有构造方法，防止被实例化 */
    private Singleton() {
    }
    /* 静态工程方法，创建实例 */
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
    /* 如果该对象被用于序列化，可以保证对象在序列化前后保持一致 */
    public Object readResolve() {
        return instance;
    }
}
```
饿汉式 会在类加载时直接创建对象。懒汉式 有点类似懒加载的感觉，在第一次使用的时候创建对象，但是这样也带来一个问题，如何保证线程安全。
上面的 懒汉式 其实是有问题的，多线程同时调用的时候会创建多个实例，所以用的比较多的是 double check 的实现方式。
```java
// double check
public class Singleton {
    /* 持有私有静态实例，防止被引用，此处赋值为null，目的是实现延迟加载 */
    private static Singleton instance = null;
    
    /* 私有构造方法，防止被实例化 */
    private Singleton() {
    }
    
    /* 静态工程方法，创建实例 */
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
    
    /* 如果该对象被用于序列化，可以保证对象在序列化前后保持一致 */
    public Object readResolve() {
        return instance;
    }
}
```
这样就能保证线程安全，保障只有一个实例最后会被创建。但还有一个问题，JVM 可能会在执行的时候进行指令重排序，
因为 `instance = new Singleton();` 这条语句并不是一个原子性操作，实际上是执行了三件事情。
1. 给 `Singleton` 分配空间
2. 调用构造方法，实例化
3. 将 `instance` 指向 1 中分配的空间

只要第 3 步执行完成，`instance` 就已经不是 `null`。但是 JVM 可能会进行指令重排序，2 和 3 的先后顺序是不确定的。  
如果 JVM 是按照 132 执行的，且恰好有多个线程在竞争的时候，那么可能会出现 第一个线程在执行到 3 的时候被暂停，第二个线程开始执行，执行到 `if (instan == null)` 的判断时，直接拿 `instance` 出去使用了，但是当前的 `instance` 并没有实例化完成，也就会出现问题。  
解决方案可以给 `instance` 添加 `volatile` 关键字。实现如下所示：
```java
public class Singleton {
    /* 持有私有静态实例，防止被引用，此处赋值为null，目的是实现延迟加载 */
    private static volatile Singleton instance = null;
    /* 私有构造方法，防止被实例化 */
    private Singleton() {
    }
    /* 静态工程方法，创建实例 */
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class){
                if (instance == null){
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
    /* 如果该对象被用于序列化，可以保证对象在序列化前后保持一致 */
    public Object readResolve() {
        return instance;
    }
}
```
`volatile` 表示所有的对所修饰变量的操作，都不会被拷贝到线程缓存中执行。阻止 JVM 的指令重排序，要求按照 123 的顺序来执行。

## 2.2 其他实现  
这样看起来，就越来越繁琐了，本来就是想实现一个简单、高效的单例模式，一点一点的增加了很多代码。所以有人提出了下面的两种实现方式。

### 2.2.1 静态内部类
```java
public class Singleton {
    private Singleton() { }
    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
    
    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
}
```
采用 `SingletonHolder` 的方式，使用静态内部类保证类只会被实例化一次，同时又会在 `getInstance()` 第一次调用的时候被实例化。

### 2.2.2 枚举
```java
public class Singleton {
    private Singleton() { }
    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE.getSingleton();
    }
    
    private enum SingletonHolder {
        INSTANCE;
        private Singleton singleton;
        SingletonHolder() {
            singleton = new Singleton();
        }
        private Singleton getSingleton() {
            return singleton;
        }
    }
}
```
采用 `SingletonHolder` 的方式，使用枚举。因为枚举会由 JVM 保证只会实例化一次，所以肯定是线程安全的。  
当前，你也可以直接用枚举来做单例，直接写方法到枚举中。
```java
public enum Singleton {
    INSTANCE;
    
    public void func1(){
        // do some thing.
    }
}
```

# 三、总结
最后，推荐借助枚举的实现方式，枚举的实现方式已经成为单例模式的最佳实践。前一段时间看到 `RestTemaple` 的实现的时候，有看到在执行 `URLEncode` 的时，各种字符便是保存在枚举实现的单例模式中。