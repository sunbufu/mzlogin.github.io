---
layout: post
title: ANE打包步骤
categories: [action script]
description: ANE的打包步骤（包括Android和IOS）
keywords: ANE, Android, IOS
---

# 一、新建工程

## 1、新建Android工程
**记得选中`Mark this project as a library`**

### 1.1 构建路径导入Jar包
FlashRuntimeExtensions.jar
路径如：flashbuilder\sdks\4.6.0\lib\android\

### 1.2 三个必须类：

1. 实现`FREFunction`，实现其中的`call`方法。`call`方法是真正和`android`交互的方法。
2. 继承`FREContext`，其中的`getFunctions`方法用于获取1）的类对象的`Map`容器，容器的`key`用于以后获取该对象。
3. 实现`FREExtension`，其中`createContext`方法用于获取2）类的对象。

### 1.3 导出*.jar包

## 2、新建iPhone工程（Cocoa Touch Static Library）

### 2.1 导入头文件
FlashRuntimeExtensions.h
路径如：Application/Adobe Flash Builder 4.6/sdks/4.6.0/include/

### 2.2 必须实现的方法

1. contextInitializer用来执行初始化操作（例如将与iPhone的原生实现的方法添加到里面）
2. iPhone的原生实现的方法

### 2.3 导出*.a静态库
command+B,编译出*.a文件

# 二、新建AS的Lib工程，用于调用一、（记得选中包括Adobe AIR库）
	
```javascript
var context:ExtensionContext = ExtensionContext.createExtensionContext("com.three.Extension","");//com.three.Extension为Android项目中FREExtension的实现的全路径名
context.call("test", value);//为FREContext的子类Map容器的key	
```

复制出AS工程bin目录下的*.swc文件
注意：有时需要在Flex库编译器中添加 -swf-version 18

# 三、新建extension.xml文件
内容如下：

```xml
<extension xmlns="http://ns.adobe.com/air/extension/20.0">
	<id>shs.ANE.pay</id>
	<versionNumber>1.0.0</versionNumber>
	<platforms>
		<platform name="iPhone-ARM">
			<applicationDeployment>
				<nativeLibrary>libPayiPhone.a</nativeLibrary>
				<initializer>init</initializer>
			</applicationDeployment>
		</platform>
        <platform name="Android-ARM">
            <applicationDeployment>
                <nativeLibrary>PayAndroid.jar</nativeLibrary>
                <initializer>shs.ANE.PayExtension</initializer>
            </applicationDeployment>
        </platform>
	</platforms>
</extension>
```

# 四、按一下目录结构放置文件：

![目录结构]({{ site.url }}/images{{ page.url }}/20160309132231238.jpg)

其中：  
*.ane----最后获得的ane文件  
*.swc----FB编译得到的调用原生代码的文件  
Android-ARM----Android用到的文件目录  
iPhone-ARM-----iPhone用到的文件目录  
package.sh----打包的命令脚本  
extension.xml----ANE的配置文件  
platformoptions.xml----iPhone中需要用到的库文件的引用的配置  
res----存放Android中用到的资源文件  
libs----存放iPhone中用到的库文件。  

# 五、执行打包命令

```
adt路径 -package -tsa none -storetype pkcs12 -keystore p12文件 -storepass 密码 -target ane 生成的ANE名称 extension.xml -swc swc文件 -platform Android-ARM -C ./Android-ARM . -platform iPhone-ARM -platformoptions platformoptions.xml -C ./iPhone-ARM .
```

# 六、遇到的问题和解决方案

## 6.1 Android
### 6.1.1 在打包*.jar的过程中注意勾选Export all output folders for checked projects。然后将Android中的res拷贝出来。
### 6.1.2 在打包ANE之前，要将jar包及其引用的jar包合并成一个jar包，命令如下：

```
	@echo off
	::转到当前盘符
	%~d0
	::打开当前目录
	cd %~dp0
	::你做的主JAR包的路径
	set MainJar=PayAndroid.jar
	::第三方JAR包的路径
	set ExternalJar=alipaySdk-20160223.jar
	::第三方JAR包顶级包名称
	set packageName=com
	echo =========== start combin ==============
	::解压第三方包
	jar -xf %ExternalJar%
	::合并主JAR包
	jar -uf %MainJar% %packageName% 
	::如果还有别的顶级包可以接着合并，例如：
	::jar -uf %MainJar% %packageName2%
	jar -uf %MainJar% org
	::jar -uf %MainJar% cn
	echo =========== over ==============
	echo 合并完成
```

### 6.1.3 安卓也可以主动调用AS中的方法：

```javascript
/**1) Android中*/
context.dispatchStatusEventAsync(TAG, result);
/**2) AS中*/
context.addEventListener(StatusEvent.STATUS, statusHandler);
		
private function statusHandler(event:StatusEvent):void
{
	dispatchEvent(event);
	trace(event.leve);
}
```

## 6.2 iPhone
### 6.2.1 打包过程中注意库文件的引用，也就是platformoptions.xml的配置

```xml
<platform xmlns="http://ns.adobe.com/air/extension/20.0">
    <sdkVersion>1.0</sdkVersion>
    <linkerOptions>
        <option>-ios_version_min 6.0</option>
        <option>-framework AlipaySDK</option>
    </linkerOptions>
    <packagedDependencies>
        <packagedDependency>libs/libcrypto.a</packagedDependency>
        <packagedDependency>libs/libssl.a</packagedDependency>
        <packagedDependency>libs/AlipaySDK.framework</packagedDependency>
    </packagedDependencies>
</platform>
```

### 6.2.2 异步返回
因为在支付宝的调用过程中，支付结果的返回时异步的。*.a文件又不存在AppDelegate类。所以需要我们动态的替换掉这个类。
参照[利用ios的hook机制实现adobe air ios ane下appdelegate的动态替换](http://blog.csdn.net/ashqal/article/details/40979353)

### 6.2.3 主动发送数据到AS
类似于6.1.3

```javascript
/**1) iPhone中*/
FREDispatchStatusEventAsync(FREContext ctx, const uint8_t *code, const uint8_t *level);
/**2) AS中*/
context.addEventListener(StatusEvent.STATUS, statusHandler);

private function statusHandler(event:StatusEvent):void
{
	dispatchEvent(event);
	trace(event.leve);
}
```

### 6.2.4 必须在MACOS环境下打包