---
layout: post
title: 设计模式 1
categories: [design patterns]
description: 设计模式的介绍，工厂模式，抽象工厂模式，单例模式，建造者模式，原型模式
keywords: design patterns, 设计模式
---

# 设计模式（Design Patterns）
>——可复用面向对象软件的基础

设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性。 毫无疑问，设计模式于己于他人于系统都是多赢的，设计模式使代码编制真正工程化，设计模式是软件工程的基石，如同大厦的一块块砖石一样。项目中合理的运用设计模式可以完美的解决很多问题，每种模式在现在中都有相应的原理来与之对应，每一个模式描述了一个在我们周围不断重复发生的问题，以及该问题的核心解决方案，这也是它能被广泛应用的原因。

## 一、设计模式的分类
总体来说设计模式分为三大类：

+ 创建型模式，共五种：工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式。
+ 结构型模式，共七种：适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式。
+ 行为型模式，共十一种：策略模式、模板方法模式、观察者模式、迭代子模式、责任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式。
+ 剩余还有两类：并发型模式和线程池模式。
![设计模式关系]({{ site.url }}/images{{ page.url }}/20160104133307214.jpg)  

## 二、设计模式的六大原则

### 1、开闭原则（Open Close Principle）
开闭原则就是说对扩展开放，对修改关闭。在程序需要进行拓展的时候，不能去修改原有的代码，实现一个热插拔的效果。所以一句话概括就是：为了使程序的扩展性好，易于维护和升级。想要达到这样的效果，我们需要使用接口和抽象类，后面的具体设计中我们会提到这点。

### 2、里氏代换原则（Liskov Substitution Principle）
里氏代换原则(Liskov Substitution Principle LSP)面向对象设计的基本原则之一。 里氏代换原则中说，任何基类可以出现的地方，子类一定可以出现。 LSP是继承复用的基石，只有当衍生类可以替换掉基类，软件单位的功能不受到影响时，基类才能真正被复用，而衍生类也能够在基类的基础上增加新的行为。里氏代换原则是对“开-闭”原则的补充。实现“开-闭”原则的关键步骤就是抽象化。而基类与子类的继承关系就是抽象化的具体实现，所以里氏代换原则是对实现抽象化的具体步骤的规范。—— From Baidu 百科

### 3、依赖倒转原则（Dependence Inversion Principle）
这个是开闭原则的基础，具体内容：真对接口编程，依赖于抽象而不依赖于具体。

### 4、接口隔离原则（Interface Segregation Principle）
这个原则的意思是：使用多个隔离的接口，比使用单个接口要好。还是一个降低类之间的耦合度的意思，从这儿我们看出，其实设计模式就是一个软件的设计思想，从大型软件架构出发，为了升级和维护方便。所以上文中多次出现：降低依赖，降低耦合。

### 5、迪米特法则（最少知道原则）（Demeter Principle）
为什么叫最少知道原则，就是说：一个实体应当尽量少的与其他实体之间发生相互作用，使得系统功能模块相对独立。

### 6、合成复用原则（Composite Reuse Principle）
原则是尽量使用合成/聚合的方式，而不是使用继承。

## 三、Java的23种设计模式
从这一块开始，我们详细介绍Java中23种设计模式的概念，应用场景等情况，并结合他们的特点及设计模式的原则进行分析。

### 1、工厂方法模式（Factory Method）
工厂方法模式分为三种：

#### 1.1 普通工厂模式
就是建立一个工厂类，对实现了同一接口的一些类进行实例的创建。首先看下关系图：
![普通工厂模式]({{ site.url }}/images{{ page.url }}/20160104133629064.jpg)  
举例如下：（我们举一个发送邮件和短信的例子）
1) 创建二者的共同接口：
```java
public interface Sender {
	public void Send();
}
```
2) 创建产品的实现类
```java
public class MailSender implements Sender {
	@Override
	public void Send() {
		System.out.println("this is mailsender!");
	}
}
```
```java
public class SmsSender implements Sender {  
    @Override  
    public void Send() {  
        System.out.println("this is sms sender!");  
    }  
} 
```
4) 建立工厂类
```java
public class SendFactory {  
    public Sender produce(String type) {  
        if ("mail".equals(type)) {  
            return new MailSender();  
        } else if ("sms".equals(type)) {  
            return new SmsSender();  
        } else {  
            System.out.println("请输入正确的类型!");  
            return null;  
        }  
    }  
}  
```
5) 测试
```java
public class FactoryTest {  
    public static void main(String[] args) {  
        SendFactory factory = new SendFactory();  
        Sender sender = factory.produce("sms");  
        sender.Send();  
    }  
}  
```

#### 1.2 多个工厂方法模式
对普通工厂方法模式进行改进，在普通工厂方法模式中，如果传递的字符串出错，则不能正确创建对象，而多个工厂方法模式是提供多个工厂方法，分别创建对象。关系图：
![多个工厂方法模式]({{ site.url }}/images{{ page.url }}/20160104134208732.jpg)  
改动SendFactory类，如下：
```java
public class SendFactory {  

    public Sender produceMail(){  
        return new MailSender();  
    }  
      
    public Sender produceSms(){  
        return new SmsSender();  
    }  
}  
```
测试：
```java
public class FactoryTest {  
    public static void main(String[] args) {  
        SendFactory factory = new SendFactory();  
        Sender sender = factory.produceMail();  
        sender.Send();  
    }  
}  
```

#### 1.3 静态工厂方法模式
将上面的多个工厂方法模式里的方法置为静态的，不需要创建实例，直接调用即可。
```java
public class SendFactory {  
      
    public static Sender produceMail(){  
        return new MailSender();  
    }  
      
    public static Sender produceSms(){  
        return new SmsSender();  
    }  
}  
```
```java
public class FactoryTest {    
    public static void main(String[] args) {      
        Sender sender = SendFactory.produceMail();  
        sender.Send();  
    }  
}
```

#### 1.4 工厂模式总结
总体来说，工厂模式**适合**：凡是出现了**大量的产品需要创建**，并且**具有共同的接口**时，可以通过工厂方法模式进行创建。在以上的三种模式中，第一种如果传入的字符串有误，不能正确创建对象，第三种相对于第二种，不需要实例化工厂类，所以，大多数情况下，我们会选用第三种——静态工厂方法模式。

### 2、抽象工厂模式（Abstract Factory）
工厂方法模式有一个“缺陷”就是，类的创建依赖工厂类，也就是说，如果想要拓展程序，必须对工厂类进行修改，这违背了闭包原则，所以，从设计角度考虑，有一定的问题，如何解决？就用到抽象工厂模式，创建多个工厂类，这样一旦需要增加新的功能，直接增加新的工厂类就可以了，不需要修改之前的代码。因为抽象工厂不太好理解，我们先看看图，然后就和代码，就比较容易理解。
![抽象工厂模式]({{ site.url }}/images{{ page.url }}/20160104134853471.jpg)  
#### 2.1 抽象工厂模式实例
1) 产品类需实现的接口
```java
public interface Sender {  
    public void Send();  
}  
```
2) 两个产品的实现类
```java
public class MailSender implements Sender {
	@Override
	public void Send() {
		System.out.println("this is mailsender!");
	}
}
```
```java
public class SmsSender implements Sender {  
    @Override  
    public void Send() {  
        System.out.println("this is sms sender!");  
    }  
} 
```
3) 工厂类需实现的接口
```java
public interface Provider {  
    public Sender produce();  
}  
```
4) 两个工厂的实现类
```java
public class SendMailFactory implements Provider {     
    @Override  
    public Sender produce(){  
        return new MailSender();  
    }  
}  
```
```java
public class SendSmsFactory implements Provider{  
    @Override  
    public Sender produce() {  
        return new SmsSender();  
    }  
}  
```
5) 测试
```java
public class Test {  
    public static void main(String[] args) {  
        Provider provider = new SendMailFactory();  
        Sender sender = provider.produce();  
        sender.Send();  
    }  
}  
```

#### 2.1 抽象工厂模式总结
其实这个模式的好处就是，如果你现在想增加一个功能：发及时信息，则只需做一个实现类，实现`Sender`接口，同时做一个工厂类，实现`Provider`接口，就OK了，无需去改动现成的代码。这样做，拓展性较好！

### 3、单例模式（Singleton）
单例对象（Singleton）是一种常用的设计模式。在Java应用中，单例对象能保证在一个JVM中，该对象只有一个实例存在。这样的模式有几个好处：

+ 1、某些类创建比较频繁，对于一些大型的对象，这是一笔很大的系统开销。
+ 2、省去了new操作符，降低了系统内存的使用频率，减轻GC压力。
+ 3、有些类如交易所的核心交易引擎，控制着交易流程，如果该类可以创建多个的话，系统完全乱了。（比如一个军队出现了多个司令员同时指挥，肯定会乱成一团），所以只有使用单例模式，才能保证核心交易服务器独立控制整个流程。

首先我们写两个简单的单例类：

#### 3.1 饿汉式
```java
public class Singleton {
	private Singleton() {//私有的构造方法
	}
	private static Singleton singleton = new Singleton();//私有的静态的对象
	public static Singleton getInstance(){//公共的静态的获取对象的方法
		return singleton;
	}
}
```
**饿汉式是天生线程安全的。**

#### 3.2 懒汉式
```java
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
注意：此方法为线程不安全的，如果多个线程同时在`instance = null`时进行`instace == null`判断，则会生成多份实例。

#### 3.3 线程安全的懒汉式
```java
public class Singleton {

    private static Singleton instance = null;
    private Singleton(){}
    
    public static Singleton getInstance(){
        if (instance == null) {
            synchronized(Singleton.class){
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        
        return instance;
    }

}
```

### 4、建造者模式（Builder）
工厂类模式提供的是创建单个类的模式，而建造者模式则是将各种产品集中起来进行管理，用来创建复合对象，所谓复合对象就是指某个类具有不同的属性，其实建造者模式就是前面抽象工厂模式和最后的Test结合起来得到的。我们看一下代码：
还和前面一样，一个`Sender`接口，两个实现类`MailSender`和`SmsSender`。
#### 4.1 建造者模式实例
```java
public class Builder {  
      
    private List<Sender> list = new ArrayList<Sender>();  
      
    public void produceMailSender(int count){  
        for(int i=0; i<count; i++){  
            list.add(new MailSender());  
        }  
    }  
      
    public void produceSmsSender(int count){  
        for(int i=0; i<count; i++){  
            list.add(new SmsSender());  
        }  
    }  
}  
```
测试
```java
public class Test {  
  
    public static void main(String[] args) {  
        Builder builder = new Builder();  
        builder.produceMailSender(10);  
    }  
}  
```

#### 4.2 建造者模式总结
从这点看出，建造者模式将很多功能集成到一个类里，这个类可以创造出比较复杂的东西。所以与工程模式的区别就是：工厂模式关注的是创建单个产品，而建造者模式则关注创建符合对象，多个部分。因此，是选择工厂模式还是建造者模式，依实际情况而定。

### 5、原型模式（Prototype）
原型模式虽然是创建型的模式，但是与工程模式没有关系，从名字即可看出，该模式的思想就是将一个对象作为原型，对其进行复制、克隆，产生一个和原对象类似的新对象。本小结会通过对象的复制，进行讲解。在Java中，复制对象是通过`clone()`实现的，先创建一个原型类：
```java
public class Prototype implements Cloneable {

	public Object clone() throws CloneNotSupportedException {
		Prototype proto = (Prototype) super.clone();
		return proto;
	}
}
```
很简单，一个原型类，只需要实现`Cloneable`接口，覆写`clone`方法，此处`clone`方法可以改成任意的名称，因为`Cloneable`接口是个空接口，你可以任意定义实现类的方法名，如`cloneA`或者`cloneB`，因为此处的重点是`super.clone()`这句话，`super.clone()`调用的是`Object`的`clone()`方法，而在`Object`类中，`clone()`是`native`的，具体怎么实现，我会在另一篇文章中，关于解读Java中本地方法的调用，此处不再深究。在这儿，我将结合对象的浅复制和深复制来说一下，首先需要了解对象深、浅复制的概念：

+ 浅复制：将一个对象复制后，基本数据类型的变量都会重新创建，而引用类型，指向的还是原对象所指向的。
+ 深复制：将一个对象复制后，不论是基本数据类型还有引用类型，都是重新创建的。简单来说，就是深复制进行了完全彻底的复制，而浅复制不彻底。

此处，写一个深浅复制的例子：
```java
public class Prototype implements Cloneable, Serializable {

	private static final long serialVersionUID = 1L;
	private String string;

	private SerializableObject obj;

	/* 浅复制 */
	public Object clone() throws CloneNotSupportedException {
		Prototype proto = (Prototype) super.clone();
		return proto;
	}

	/* 深复制 */
	public Object deepClone() throws IOException, ClassNotFoundException {

		/* 写入当前对象的二进制流 */
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		ObjectOutputStream oos = new ObjectOutputStream(bos);
		oos.writeObject(this);

		/* 读出二进制流产生的新对象 */
		ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
		ObjectInputStream ois = new ObjectInputStream(bis);
		return ois.readObject();
	}

	public String getString() {
		return string;
	}

	public void setString(String string) {
		this.string = string;
	}

	public SerializableObject getObj() {
		return obj;
	}

	public void setObj(SerializableObject obj) {
		this.obj = obj;
	}

}

class SerializableObject implements Serializable {
	private static final long serialVersionUID = 1L;
}
```

参考[Java之美[从菜鸟到高手演变]之设计模式](http://blog.csdn.net/zhangerqing/article/details/8194653)