---
layout: post
title: S_MarkDownEditor
categories: [open source]
description: MarkDownEditor介绍
keywords: java, markdown
---

# S_MarkDownEditor(-一款MarkDown编辑器)

## 0、写在前面
在网上查资料的时候，发现一个很有趣的现象。很多开源项目的READERME都是用MarkDown写的。很好奇这是个什么玩意，然后在强大的国产谷歌—百度的帮助下突然觉得这TM不正是我苦苦追寻的“东西”吗？
以前写文档整理资料只能通过word或者什么叉叉笔记，所以也就不得不花费很大的精力在文档格式、字体颜色等完全没用的地方。一直很苦恼，但是对于此也是无计可施。MarkDown的出现让我看到了一丝“光亮”。好了，不扯这些没用的了，如果到现在你还对MarkDown没有一个具体的认识，可以出门左拐自行百度。
但随之出现了另一个让我很是苦恼的问题，就是在Windows平台下找不到令人满意的MarkDown编辑器。我也尝试百度了许多工具，Such AS，叉叉PAD，CMD叉叉。要不就是死活在我电脑上罢工，要不就是网页应用，再要不就是卡的我受不了，让我完全找不到MarkDown的感觉= =。
"为什么不自己写一个呢？"，这个想法也吓了我一跳，但是谁叫我年轻来。写就写吧，正好最近在学习Java。
就这样终于经过一段时间的冥思苦想、求助百度、以及压迫键盘后就有了现在的这个版本的S_MarkDownEditor。虽然功能算不上强大，甚至还有很多的BUG和垃圾的地方，但是毕竟“能用”了。哈哈哈哈

## 1、简介
目前这个编辑器没有什么太强大的功能，甚至还很“弱小”，但我还是尝试对传统MarkDown的语法进行了点稍微的“本土化优化”，让他能更好，更强的出现在我的应用列表里（因为本人比较狭隘，写这个软件的目的只是为了自己写MarkDown的时候方便点）。

### 1）首行缩进
首先是首行缩进，因为MarkDown是外国人规定的，而在英文的语法中并没有像中文段落首行的那种首行缩进，所以我稍微做了一点处理。效果如下：
**传统段落显示效果**
![传统段落显示效果]({{ site.url }}/images{{ page.url }}/classical.jpg)
**缩进后段落显示效果**
![缩进后段落显示效果]({{ site.url }}/images{{ page.url }}/20151021192448010.jpg)
首行缩进的作用在这里就不一一描述了，有兴趣的朋友还请自行百度。

### 2）表格
其次是在MarkDown的标准语法中，如果你想使用表格有两种方法。一种是你用其他方式生成表格后截图然后插进来；另一种是使用HTML的语法`<table>...</table>`，很是繁琐。其实现在的**很多MarkDown编辑器都支持下面这个语法了**
```
| row1 col1 | row1 col2 | row1 col3 | row 1 col4|
|-----------|-----------|-----------|-----------|
| row2 col1 | row2 col2 | row2 col3 | row 2 col4|
| row3 col1 | row3 col2 | row3 col3 | row 3 col4|
| row4 col1 | row4 col2 | row4 col3 | row 4 col4|
```
效果如下：
![表格语法]({{ site.url }}/images{{ page.url }}/20151021194111491.jpg)
注：*如果觉得实在是难看受不了，请勿喷，良辰在此谢过！*

## 2、基本语法演示

### 2.1 标题
```
# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6
```
![标题语法]({{ site.url }}/images{{ page.url }}/20151021194411896.jpg)

### 2.2 文本样式
```
链接 :[Title](URL)  
加粗 :
**Bold**  
斜体字 :
*Italics*  
删除线 :~~text~~  
高亮 :==text==  
段落 : 段落之间空一行  
换行符 : 一行结束时输入两个空格  
列表 :* 添加星号成为一个新的列表项。  
引用 :> 引用内容  
内嵌代码 : `alert('Hello World');`  
画水平线 (HR) :
***
---
```
![文本样式]({{ site.url }}/images{{ page.url }}/20151021194743759.jpg)

### 2.3 图片
```
![头像圆.jpg](H:\头像圆.jpg)
```
![这里写图片描述]({{ site.url }}/images{{ page.url }}/20151021194943900.jpg)

### 2.4 代码高亮
java:
public class Test{
	public static void main(String[] args){
		System.out.println("Hello World");//打印数据
	}
}

sql:
SELECT * FROM EMP;--查询EMP表中的全部数据
![代码高亮]({{ site.url }}/images{{ page.url }}/20151021195317405.jpg)

### 2.5 导出为(*.md)
![选择]({{ site.url }}/images{{ page.url }}/20151025152035581.jpg)
查看效果：
![效果]({{ site.url }}/images{{ page.url }}/20151025152145446.jpg)

### 2.6 导出为(*.html)
![选择]({{ site.url }}/images{{ page.url }}/20151025152252593.jpg)

效果如下：
![效果]({{ site.url }}/images{{ page.url }}/20151025152418465.jpg)
html文本如下：
![html文本]({{ site.url }}/images{{ page.url }}/20151025152451617.jpg)

### 2.7 导出为(*.pdf)
![选择]({{ site.url }}/images{{ page.url }}/20151025152555509.jpg)
效果如下：
![pdf效果]({{ site.url }}/images{{ page.url }}/20151025152658087.jpg)

### 2.5 其他
还有一些其他的例如缩进`>`等的语法在此不再演示。
如果有喜欢的可以[下载S_MarkDownEditor](http://download.csdn.net/album/detail/2349)自己体验下，过一段时间抽空整理下资料，如果不出意外会开源的，反正也没有什么技术含量，哈哈哈哈（此处自行脑补猥琐的笑声）。

## 3、整体设计逻辑

## 4、后记
本来想了好多话，但是突然忘了。前几天在看90GOD直播的时候突然得知他要结婚了，时间好快啊。想来第一次看他直播的时候还以为他是一个猥琐的少年，没想到现在已经成了一个猥琐的“大叔”了。不知道下次这么悠闲的时候是什么时候了。谨以此文纪念我的这段时光吧！虽然可能记不住什么。

>2015-10-20
孙不服
记于北京海淀的某个屋檐下