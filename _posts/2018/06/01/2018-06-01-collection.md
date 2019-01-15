---
layout: post
title: Collection(容器)
categories: [java]
description: collection
keywords: java, collection
---

# 0、容器 特点：
+ 存储各种各样的数据，以对象为单位；
+ 大小容量没有限制；
+ 存储元素最后变成object类型（统称为object类型）。  

# 1、容器接口
![容器接口]({{ site.url }}/images{{ page.url }}/20151026090908536.jpg)

+ Collection ：集合  
+ Set ：元素无序不重复。  
+ SortedSet ：有序set，可按大小自动排序，但仍然不重复。  
+ List ：元素有序可重复。  
+ Map ：(key-value)键值对，统称为元素。key是唯一的，值可以重复。且所有元素是无序的。  
+ SortedMap ：有序Map，所有元素按照key的大小排序，元素不重复。

# 2、常用实现类
![容器实现类]({{ site.url }}/images{{ page.url }}/20151026090940288.jpg)
数据结构 ：逻辑关系，物理关系

# 3、接口及其实现类特点

## 1）Set接口
### 1、Set接口的特性与其实现类是什么？  
   1) 元素无序；  
   2) 元素不重复；当添加重复的元素时，它会采用屏蔽技术屏蔽掉。  
   3) 它的常用实现类:  `HashSet`.
  
### 2、HashSet实现类的特性？
   1) 元素无序；  
   2) 元素不重复；当添加重复的元素时，它会采用屏蔽技术屏蔽掉。  
   3) 个性: 判断元素相等依赖 equals()方法， 但，同时，它还依赖 hashCode()方法。  
**注意**:  
1. 在Java语言中，规定  任何一个对象均有一个哈希编码，该编码是一个int型的整数，由系统自动生成。规则 相等的对象拥有相同的哈希编码值。  
2. 自定义类如果使用HashSet必须重写equals（）和HashCode（）方法。  
## 2）SortedSet 接口
### 1、SortedSet接口的特性及其实现类:
   1) 元素自动排序（按大小）;  
   2) 元素不重复; 当添加重复的元素时会采用屏蔽技术屏蔽掉。  
   3) 它的常用实现类: TreeSet .
### 2、TreeSet实现类的特性:
   1) 元素自动排序（按大小）;  
   2) 元素不重复; 当添加重复的元素时会采用屏蔽技术屏蔽掉。  
   3) **个性**: 判断元素相等依赖`equals()`，但它实质上依赖 `compareTo()`方法。  
**注意：自定义类如果使用TreeSet必须实现`comparable`接口的`compareTo()`方法。**
## 3）List接口
### 1、List接口的特性和常用实现类
   1) 元素在位置上是有序。即: 每个元素拥有一个位置编号，它从0开始到 `size()-1`；  
   2) 元素可以重复。因为，重复的元素可以在不同的位置上。  
   3) 个性: 它比较父接口 Collection多了一些与位置相关的操作方法。  
>  如: 获取某个位置上的元素，删除某个位置上的元素，修改某个位置上的元素等。  

  4) 它的常用实现类:  `LinkedList` 和 `ArrayList` 。
### List的实现类
#### 1、LinkedList实现类 和 ArrayList实现类的特性   
  a) 元素在位置上是有序;  
  b) 元素可以重复;  
  1) LinkedList实现类采用链表的原理来管理所有元素。  
  2) ArrayList实现类采用队列的原来来管理所有元素。  
  3) **LinkedList**特点: 在**插入和删除元素时效率较高**，而查询元素时效率较低 。  
  4) **ArrayList**特点: 在插入和删除元素时效率较低，而**查询元素时效率较高** 。   
#### 2、在Java中，专门为List接口提供一个迭代器，实现正向遍历和逆向遍历。 
  `Iterator` 迭代器接口  
  `ListIterator` 迭代器接口 (**注意: 这是List接口独有的**)。  
#### 3、在Java中，专门为List接口提供了一个工具类 `java.util.Collections`，用来实现List接口相关的容器进行排序等操作。
## 4）Map接口
### 1、Map接口的特性及其常用实现类:
   1) 元素由键和值组成，其中键是唯一，而值可以重复。键对应着值。  
   2) 元素无序。即: 元素没有按键排序。  
   3) 元素不重复。当添加重复的元素时采用覆盖技术，用新元素的值去覆盖旧元素的值。  
   4) 它的常用实现类为: `HashMap`  
   5) 它有一个子接口:  `SortedMap`。  
   6) Map接口提供的抽象方法：  
   >`put(key, value);`  //添加元素

### 2、通过`keySet()`来实现 `Map`相关的容器进行遍历。

```java
Set keys = m1.keySet(); //1 获取所有元素的键，并构建一个集合。
Iterator it = keys.iterator(); //2 获取一个迭代器
while( it.hasNext() ){ //3 判断
    Object key = it.next(); //4 访问
    Object value = m1.get( key ); //5 通过容器本身的方法来获取键对应的值。
    System.out.println( key + " <<<===>>> " + value );
}
```
### Map接口的实现类
#### 1、`HashMap`实现类的特性:  
   1) 元素由键(Key)和值(Value)组成，键对应着值； 其中键是唯一的，值可重复。  
   2) 元素无序。  
   3) 元素不重复。添加重复元素时采用覆盖技术。  
   4) 个性: 判断元素相等(实质是判断元素的键是否相等)依赖 `equals()`方法，同时，它还依赖 `hashCode()`方法。  
   **结论:**  
   当容器由  `HashMap` 实现类所构建，且元素的键为自定义类型时，则该键对应的类必须重写 `equals()`和`hashCode()`两个方法。
## 2、TreeMap接口
### 1、SortedMap 接口的特性及其实现类:
   1) 元素按键的大小自动排序。  
   2) 元素不重复。当添加重复的元素时采用覆盖技术。  
   3) 它常用实现类 TreeMap .  
### 2、TreeMap实现类的特性:
   1) 元素按键的大小自动排序。  
   2) 元素不重复。当添加重复的元素时采用覆盖技术。  
   3) 个性: 判断元素相等( 实质上是判断元素的键是否相等 )依赖 compareTo()方法。
### 结论: 
   1)当 容器由 TreeMap 实现类所构建，且元素的键是自定义类的对象时，则该类必须实现 Comparable接口，重写  compareTo()方法。   
   2)同时，注意: 在重写compareTo()方法时，要对对象的所有属性一一比较大小。  
实现类的**特点**  
HashSet ：  
如果容器内已经存在（通过equals（）和HashCode（）方法判断相等），则屏蔽。 注意：自定义方法如果使用HashSet必须重写equals（）和HashCode（）方法。  
TreeSet ：  
判断元素相等依赖于equals（），但实质上依赖于compareTo（）方法。
# 常用方法
```java
//collection常用方法
boolean add(Object element);// 添加元素
boolean remove(Object element);// 移除元素
boolean contains(Object element);// 是否包含元素
int size();// 容器大小
boolean isEmpty();// 是否为空
void clear();// 清空容器
iterator iterator();// 遍历容器
boolean containsAll(Collection c);// 是否包含某容器
boolean addAll(Collection c);// 添加容器内的元素
boolean removeAll(Collection c);// 移除参数容器内的元素
boolean retainAll(Collection c);// 取两容器交集
Object[] toArray();// 将容器转换为数组
//List常用方法：
// 和Collection相比，多了添加了一些和顺序有关的方法
void add(int index, Object element);// 添加元素到指定位置
Object get(int index);// 获取指定位置的元素
Object set(int index, Object element);// 更改指定位置的元素
Object remove(int index);// 移除指定位置的元素
int indexOf(Object element);// 返回某个元素的索引。如果没有该元素，返回-1
//Map常用方法：
Object put(Object key, Object value);// 添加元素
Object get(Object key);// 获取指定key的元素的value
Object remove(Object key);// 移除指定key的元素
boolean containsKey(Object key);// 是否包含指定key的元素
boolean containsValue(Object value);// 是否包含指定value的元素
int size();// 获取map的大小
boolean isEmpty();// map是否为空
void putAll(Map map);// 将map放入map中
void clear();// 移除map中所有元素
```
java.util.Collections 工具类方法：
