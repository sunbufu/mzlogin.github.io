---
layout: post
title: Java IO流
categories: [java]
description: java IO流总结
keywords: java, io
---

# 一、流(Stream)

## 1、流(Stream)的定义
流是个抽象的概念，是对输入输出设备的抽象，Java程序中，对于数据的输入/输出操作都是以“流”的方式进行。设备可以是文件，网络，内存等。
![流]({{ site.url }}/images{{ page.url }}/20151026090104644.png)

流具有方向性，至于是输入流还是输出流则是一个相对的概念，一般以程序为参考，如果数据的流向是程序至设备，我们成为输出流，反之我们称为输入流。
可以将流想象成一个“水流管道”，水流就在这管道中形成了，自然就出现了方向的概念。
![流的方向性]({{ site.url }}/images{{ page.url }}/20151026090019118.jpeg)

## 2、流的特点
### 1) 方向性
### 2) 连续性
### 3) 单位性 

## 3、IO流的分类
1) 从方向性分：输入流(`Input Stream`)和输出流(`Output Stream`)  
2) 从单位性分：字节流(8为二进制(`bit`))和字符流  
3) 从功能分（从是否有数据源）：节点流和处理流

## 4、在Java中，所有的流均来自于`java.io`包四个抽象类
1)抽象的字节输入流类：`InputStream`  
2)抽象的字节输出流类：`OutputStream`  
3)抽象的字符输入流类：`Reader`  
4)抽象的字符输出流类：`Writer`  
***
# 二、四个基本抽象类
**使用步骤：**  
1）声明对象  
2）创建对象  
3）使用（输入输出）  
4）刷新（`flush()`输出的时候）
5）关闭
## 1、抽象的字节输入流类（InputStream）及其文件操作实现类（FileInputStream）
### 1）以字节方式来读取数据
### 2）提供的常用方法：
```java
int read();//用来读取一个字节，反馈这个字节对应的整数[0, 255]。当返回-1是，表示读取结束
void close();//关闭字节输入流，释放所占资源，确保数据安全
```
## 2、抽象的字节输出流类（OutputStream）及其文件操作实现类（FileOutputStream）
### 1) 将给定的数据以字节方式输出到文件中；
### 2) 它提供的常用方法:
```java
void write( int x );//  将给定的整数以字节方式输出。因此，当给定的整数超出了[ 0, 255 ]时，则会失真。
void flush();// 将缓冲区中的数据一次性输出到目的地。确保数据输出成功。
void close();// 关闭字节输出流，释放所占资源，确保数据安全。
```

注意：必须使用`flush()`方法。  
Windows文件中输出换行使用`/r/n`，即回车换行。（回车指：将光标回到该行的首部。换行指：将光标移到下一行。）
## 3、字符输入流类（Reader）及其文件操作实现类（FileReader）
### 1）它以字符的方式来读取数据。
### 2）他提供的方法：
```java
int read();//  它以字符方式来读取数据，并反馈这个数据的int型值。因此，其范围是[ 0, 65535 ]；当反馈一个-1时，则结束。
void close();// 关闭字符输入流。
```
## 4、字符输出流类（Writer）及其文件操作实现类（FileWriter）
### 1) 将给定的数据以字符方式输出。
### 2) 它提供的常用方法:
```java
void write( int x );//  将给定的整数以字符方式输出，数据在[ 0, 65535 ]范围中。
void flush();// 将缓冲区中的数据一次性输出，确保输出成功。
void close();// 关闭输出流，释放所在占资源，确保安全。
```
## 5、字节流和字符流的区别：

### 1) 字节流可以处理任意类型的文件。
### 2) 字符流只能用来处理文本文件。

# 三、四个缓冲流类（属于处理流）

作用：用来**提高**输入和输出的**效率**  
注意：使用时需要套接在节点流上

## 1、字节缓冲流
`BufferedInputStream`  字节缓冲输入流  
`BufferedOutputStream`  字节缓冲输出流  
应用在`FileInputStream`和`FileOutputStream`的基础上
```java
FileInputStream fis = new FileInputStream( path_r );
FileOutputStream fos = new FileOutputStream( path_w );
BufferedInputStream bis = new BufferedInputStream( fis ); //将节点流处理成缓冲流
BufferedOutputStream bos = new BufferedOutputStream( fos ); 
```

## 2、字符缓冲流
`BufferedReader` 字符缓冲输入流  
`BufferedWriter` 字符缓冲输出流  
应用在`FIleReader`和`FileWriter`的基础上
```java
FileReader fr = new FileReader( path_r );
FileWriter fw = new FileWriter( path_w );
BufferedReader br = new BufferedReader( fr ); //将节点流处理成缓冲流
BufferedWriter bw = new BufferedWriter( fw ); 
```

# 四、数据流（属于处理流）

目的：保证**数据类型不变**  
注意：使用时需要套接在节点流上，存储和读取时顺序必须一致（因为数据流按照队列存储）。

## 1、DataInputStream数据的字节输入流类
用来**读取八种基本类型**的数据及字符串。
```java
byte readByte();// byte
short readShort();// short
int readInt();// int
long readLong();// long
char readChar();// char
float readFloat();// float
double readDouble();// double
boolean readBoolean();// boolean
String readUTF();// string
```

## 2、DataOutputStrean数据的字节输出流类
用来**输出八种基本类型**的数据及字符串
```java
void writeByte(byte);// byte
void writeShort(short);// short
void writeInt(int);// int
void writeLong(long);// long
void writeChar(char);// char
void writeFloat(float);// float
void writeDouble(double);// double
void writeBoolean(boolean);// boolean
void wirteUTF(String);// string
```

# 五、对象流（属于处理流）

作用：**保证对象的性质不变**  
注意：  
>使用时需要套接在节点流上，要存储的对象**必须实现`java.io.Serializable`接口**  
`transient` 修饰属性或方法，表示该属性或方法不可以序列化

## 1、ObjectInputStream对象的字节输入流类
读取对象
```java
ObjectInputStream ois = new ObjectInputStream(new FileInputStream(path));
```

## 2、ObjectOutputStream对象的字节输出流类
输出对象
```java
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(path));
```

# 六、转换流（属于处理流）

在使用`FileInputStream`时，读取数据乱码，**给的数据和要的数据在单位上不一致，则需要转换流处理**。

## 1、InputStreamReader（字节转换成字符的输入流类）
功能：  
1）**字节转换成字符**，以字符的方式读取数据    
2）在创建转换流对象时，可以**指定字符编码方案，实现数据的管理**
```java
InputStreamReader isr = new InputStreamReader(new FileInputStream(path), "utf-8");
```

## 2、OutputStreamWriter（字符转换成字节的输出流类）
功能：  
1）**字符转换成字节**，以字节方式将给定数据输出  
2）在创建转换流对象时，可以**指定字符编码方案，实现数据的管理**
```java
OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream(path), "utf-8");
```

# 十、打印流（输入输出流）

特点：  
>均**属于输出流**，模拟打印机的特点来输出信息  
具有**字符转化成字节**的自动转换功能  
打印流输出后，会**自动调用`flush()`**方法。  
他提供的常用方法`print();`和`println();`。  
打印流**属于节点流**（不直接连接数据源，不需要套接到数据流上）。  

了解：
>System类的静态字段：
`out`默认是屏幕，可以通过`System.setOut(PrintStream);`,修改  
`in`默认是键盘  
`err`错误信息，默认也是屏幕

## 1、字节打印流(PrintStream)
```java
System.out.println();//这个方法属于字节打印流
```

## 2、字符打印流(PrintWriter)

