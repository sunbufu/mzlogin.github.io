---
layout: post
title: javascript
categories: [web]
description: javascript
keywords: javascript
---

# 一、变量
## 1.1 声明变量
>1) JavaScript是一种弱类型的语言。  
>2) 变量的声明(变量使用之前必须加`var`声明，编程规范)
>>可以通过var关键字来声明一个变量   
>>典型声明方式：
```js
var a=1;
var a, b=2, c;
var date = new Date(); 
var array = new Array();
```
**不能使用未经声明的变量。** 

>3) 全局变量 
>>在方法外部声明的变量   
>>方法内部，没有加var关键字声明的变量 (小心使用，会对全局变量造成污染)

>4) 局部变量 
>>方法内部，使用var声明的变量 

>5) 补充：
>>Javascript:void(0); 用于超链接   
>>Javascript伪协议   
在a标签中的href的内容添加以上内容。

>6) 变量的命名规则

>>1.变量命名必须以英文字母或是下标符号”_”或者”$”为开头。  
>>2.变量名长度不能超过255个字符。  
>>3.变量名中不允许使用空格。  
>>4.不用使用脚本语言中保留的关键字及保留符号作为变量名。例如：`var`、`*`等。   
>>5.变量名区分大小写。(javascript是区分大小写的语言)**

## 1.2 变量的类型
>1) `undefined` 未定义（声明了变量，但是未赋值）  
>2) `null` 空（赋值为`null`），属于`undefined`的衍生类  
>3) `boolean` 布尔类型（`true`,`false`）  
>4) `string` 字符串,(单引号、双引号均可) 
>5)`number` 数值类型：
包括整数和小数，`NaN`（Not a Number），`Infinity`（无穷大）, `-Infinity`（负无穷小） 

>6) `object` 对象类型

## 1.3 数据类型的自动转换
>布尔型<-> 字符串<->数值型
>>true<->”true” <->1  
>>false<->”false” <->0  

>数字<->字符串 
>>234<->”1234”

>null <->布尔型<->数字<->字符串 
>>null<->false<->0<->”null”    
>>undefined <->布尔型<->数字<->字符串   
>>undefined <->false<->0<->” undefined ”

# 二、运算符

|运算符|描述|
|-------|----|
|`+`|加|
|`-`|减|
|`*`|乘|
|`/`|除|
|`%`|求余数 (保留整数)|
|`++`|累加、自增|
|`--`|递减、自减|
|`==`|相等|
|`>=`|大于或等于|
|`<=`|小于或等于|
|`!=`|不等于|
|`>`|大于|
|`<`|小于|
|`&&`|逻辑与|
|``|逻辑或|
|`!`|逻辑非|

# 三、控制语句

## 3.1 分支语句
### 1) if...else语句
```js
if(条件){
	执行语句
}else{
	执行语句
}
```
### 2) switch语句
```js
switch (expression){
	case const1:
		语句块1
	case  const1:
		语句块2
	…… 
	default:
		语句块N
}
```
## 3.2 循环语句
### 1）for循环
```js
for (初始化部分；条件部分；更新部分){
    语句块… 
}
```
### 2）while循环
```js
while(条件) {
	语句块；
}
```
### 3）do-while循环
```js
do{
	语句块；
}while(条件)
```
### 4）break和continue语句
`break`语句是结束当前的循环，并把程序的控制权交给循环的下一条语句。  
这里是**结束循环**，循环到此为止  

`continue`语句是结束当前的某一次循环，但是并没有跳出整个的循环。  
这里是**结束本次循环**，整个循环还在进行

# 四、函数

## 1、函数的定义
一个典型的JavaScript函数定义如下：
```js
function 函数名称(参数表)
{
	函数执行部分;
	return 表达式;
};
```

**注意：**  

+ 参数列表直接写形参名即可，不用写`var`
+ 每个函数都有返回值，默认为`undefined`
+ JS不支持函数的重载

## 2、函数的声明方式
第一种：声明式（见1、函数的定义）  
第二种：`new`出函数对象（在js中，函数就是对象）
```js
var 方法名 = new Functiong((参数表),函数体);
```

第三种：赋值式
```js
var 方法名 = function(参数表){
	函数体;
}
```

## 3、内部函数
JS 包含以下 7 个全局函数，用于一些常用的功能：

<center>
|函数名|函数作用|
|---------|----------------------|
|escape()|将字符串转义成16进制|
|unescape()|将16进制转译成字符串|
|isNan()|是不是非数字类型|
|isFinite()|函数用于检查其参数是否是无穷大。|
|parseFloat()|将字符串转换给浮点类型|
|parseInt()|将字符串转换成int|
|Eval()方法|执行代码|
</center>

## 4、Event 事件
事件是对象发送的消息，以发信号通知操作的发生。操作可能是由用户交互（例如鼠标单击）引起的，也可能是由某些其他的程序逻辑触发的。  
为什么要使用JavaScript的事件呢？主要有下面的两个用途：  
>1．验证用户输入窗体的数据。  
2．增加页面的动感效果。
    

|onclick()|被点击|
|--------|-------|
|ondblclick|被双击|
|onmouesemove|鼠标移动|
|onfocus|成为焦点|
|onblur|失去焦点|
|onchange|选中对象的值发生变化|
|onload|页面装载|
|onunload|页面卸载|


## 5、常见对象

### 1) String
我们一般利用String对象提供的函数来处理字符串。String对字符串的处理主要提供了下列方法：

`charAt(idx)`：返回指定位置处的字符  
`indexOf(Chr)`：返回指定子字符串的位置，从左到右。找不到返回-1  
`substr(m,n)`：返回给定字符串中从m位置开始，取n个字符，如果参数n省略，则意味着取到字符串末尾。   
`substring(m,n)`：返回给定字符串中从m位置开始，到n位置结束，如果参数n省略，则意味着取到字符串末尾。   
`toLowerCase()`：将字符串中的字符全部转化成小写。  
`toUpperCase()`：将字符串中的字符全部转化成大写。    
`length`: 属性，不是方法，返回字符串的长度。


### 2) Date
使用以前必须先申明：
```js
var curr=new Date();
```

主要的方法

+ getyear, getmonth, … 
+ setyear, setmonth, … 
+ toLoacaleString();


### 3) Math(固有对象类似JAVA中静态对象)
内置的Math对象可以用来处理各种数学运算
可以直接调用的方法：  
`Math.数学函数(参数)`  
求随机数方法
```js
Math.random();//产生[0，1)范围的一个任意数
```

## 6、对话框
警告框
```js
alter('警告');
```

询问框
```js
var name = prompt("您没有登录，请输入用户名：");
```

确认框  
```js
var isLogin = confirm("您确认登录吗？");// 返回true/false.
if (isLogin) {
	alert("您同意登录");
}else {
	alert("您不同意登录");
}
```

# 五、对象类

## 1、JS只是基于对象并非面向对象。它的面向对象特征没有JAVA那么强大：
|语言|抽象|继承|多态|封装|
|--|--|--|--|--|
|JAVA|具备：类，接口，抽象类|支持，`Extends`|支持|支持。四个级别封装|
|JavaScript|只有：类，一个概念|支持，`prototype`|不支持|支持较差，两个级别封装：`private`，`public`|

## 2、JS中类的定义方式
```js
// 方法1 对象直接量
var obj1 = {
    v1 : "",
    get_v1 : function() {
        return this.v1;
    },
    set_v1 : function(v) {
        this.v1 = v;
    }
};
// 方法2 定义函数对象
var Obj = function() {
    this.v1 = "";// this 指当前对象
    this.get_v1 = function() {
        return this.v1;
    };
    this.set_v1 = function(v) {
        this.v1 = v;
    }
};
// 方法3 原型继承
var Obj3 = new Function();
Obj3.prototype = {
    v1 : "",
    get_v1 : function() {
        return this.v1;
    },
    set_v1 : function(v) {
        this.v1 = v;
    }
};
// 方法4 工厂模式
function loadObj() {
    this.tmp = new Object();
    tmp.v1 = "";
    tmp.get_v1 = function() {
        return tmp.v1;
    };
    tmp.set_v1 = function(v) {
        tmp.v1 = v;
    };
    return tmp;
}
obj1.set_v1('hello1');
ssalert(obj1.get_v1());
var obj2 = new Obj();
obj2.set_v1('hello2');
alert(obj2.get_v1());
var obj3 = new Obj();
obj3.set_v1('hello3');
alert(obj3.get_v1());
var obj4 = loadObj();
obj4.set_v1('hello4');
alert(obj4.get_v1());
alert(obj1);
alert(obj2);
alert(obj3);
alert(obj4);
```

**原型(`prototype`)可用于定义公用对象，实现类似于JAVA中`static`的功能**

## 3、继承的实现
子类的原型(`prototype`)指向父类的对象。
```js
function Father(){};
function Son(){};
Son.prototype = new Father();
```

## 4、JSON
JSON就是指：Javascript   object  native   (javascript原生对象)  
JSON也是一种轻量级数据交换格式。JSON非常易于人阅读与编写，同时利于机器解析与生成。JSON是在AJAX中代替XML交换数据的更佳方案。

```js
var user = {
name:"李四",
age:24
};
```
