---
layout: post
title: 日志中的requestId
categories: [java]
description: 日志中的requestId
keywords: requestId
---

# 1 定义
在日志采集和分析的过程中，有时希望能根据每一次请求把日志串联起来，让日志更能暴露出这一次请求所存在的问题。我们引入requestId作为单次请求的唯一标识，并在这条请求的所有日志中打印出该requestId。  

# 2 生成
为了能够唯一标识一条请求，在这里我使用的是UUID作为requestId。
```java
/**
 * requestId的工具类
 */
public class RequestIdUtils {

    /**
     * requestId的最大长度
     */
    public static final int MAX_LENGTH = 32;

    public static final String REQUEST_ID_KEY = "requestId";

    /**
     * 生成requestId
     *
     * @return
     */
    public static String generateRequestId() {
        return UUID.randomUUID().toString().replace("-", "");
    }

}
```

# 3 记录
在本例中，我依赖log4j的MDC做requestId的记录。MDC类似于ThreadLocal，在日志格式的配置`%X{requestId}`即可记录到日志中。
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">

    <properties>
        <property name="logHome">/logs</property>
        <property name="projectName">test</property>
    </properties>

    <Appenders>

        <Console name="console" target="SYSTEM_OUT">
            <PatternLayout pattern="[%d{MM-dd HH:mm:ss,SSS} %-5p] %X{requestId} [%t] %c{2.} - %m%n%ex"/>
        </Console>

        <RollingFile name="infoAppender" fileName="${logHome}/${projectName}-info.log" filePattern="${logHome}/${projectName}-info.log.%d{yyyy-MM-dd}">
            <PatternLayout>
                <Pattern>[%d{yyyy-MM-dd HH:mm:ss} 0 %level{TRACE=0,DEBUG=0,INFO=1,WARN=3,ERROR=4,FATAL=5}] [${projectName}] %X{requestId} &lt;%t %C{1.}.%M(%L) %c{1.}&gt; - %m%n%ex
                </Pattern>
            </PatternLayout>
            <Policies>
                <TimeBasedTriggeringPolicy/>
            </Policies>
            <!--删除超过7天的日志-->
            <DefaultRolloverStrategy>
                <Delete basePath="${logHome}" maxDepth="1">
                    <IfFileName glob="${projectName}-info.log.*" />
                    <IfLastModified age="7d" />
                </Delete>
            </DefaultRolloverStrategy>
        </RollingFile>

        <RollingFile name="warnAppender" fileName="${logHome}/${projectName}-warn.log" filePattern="${logHome}/${projectName}-warn.log.%d{yyyy-MM-dd}">
            <PatternLayout>
                <Pattern>[%d{yyyy-MM-dd HH:mm:ss} 0 %level{TRACE=0,DEBUG=0,INFO=1,WARN=3,ERROR=4,FATAL=5}] [${projectName}] %X{requestId} &lt;%t %C{1.}.%M(%L) %c{1.}&gt; - %m%n%ex
                </Pattern>
            </PatternLayout>
            <Filters>
                <ThresholdFilter level="error" onMatch="DENY" onMismatch="NEUTRAL"/>
                <ThresholdFilter level="warn" onMatch="ACCEPT" onMismatch="DENY"/>
            </Filters>
            <Policies>
                <TimeBasedTriggeringPolicy/>
            </Policies>
            <DefaultRolloverStrategy>
                <Delete basePath="${logHome}" maxDepth="1">
                    <IfFileName glob="${projectName}-warn.log.*" />
                    <IfLastModified age="7d" />
                </Delete>
            </DefaultRolloverStrategy>
        </RollingFile>

        <RollingFile name="errorAppender" fileName="${logHome}/${projectName}-error.log" filePattern="${logHome}/${projectName}-error.log.%d{yyyy-MM-dd}">
            <PatternLayout>
                <Pattern>[%d{yyyy-MM-dd HH:mm:ss} 0 %level{TRACE=0,DEBUG=0,INFO=1,WARN=3,ERROR=4,FATAL=5}] [${projectName}] %X{requestId} &lt;%t %C{1.}.%M(%L) %c{1.}&gt; - %m%n%ex
                </Pattern>
            </PatternLayout>
            <ThresholdFilter level="error" onMatch="ACCEPT" onMismatch="DENY"/>
            <Policies>
                <TimeBasedTriggeringPolicy/>
            </Policies>
            <DefaultRolloverStrategy>
                <Delete basePath="${logHome}" maxDepth="1">
                    <IfFileName glob="${projectName}-error.log.*" />
                    <IfLastModified age="7d" />
                </Delete>
            </DefaultRolloverStrategy>
        </RollingFile>
    </Appenders>

    <Loggers>
        <Root level="info">
            <AppenderRef ref="console"/>
            <AppenderRef ref="infoAppender"/>
            <AppenderRef ref="warnAppender"/>
            <AppenderRef ref="errorAppender"/>
        </Root>
    </Loggers>

</Configuration>
```

# 4 传递
传递是比较麻烦的问题，因为在微服务盛行的今天，服务间调用是很平常的事情，给每个接口都加上一个requestId的参数就不现实了。  
传递主要有两种情况：
  
## 4.1 分层调用（例如controller与service层的调用）
我们在controller和service层分别做了两个切面，用于requestId的生成与传递
```java
/**
 * requestId的切面
 * 处理controller层的requestId
 */
@Aspect
@Component
@Order(0)
public class RequestIdControllerAspect {

    @Pointcut("execution(public * sunbufu..*Controller.*(..))")
    public void controllerPoint() {
    }

    /**
     * controller的requestId处理策略<p>
     * 在controller执行前生成requestId并设置到MDC中。执行完成后清除requestId
     *
     * @param joinPoint
     * @return
     * @throws Throwable
     */
    @Around("controllerPoint()")
    public Object doControllerPointAround(ProceedingJoinPoint joinPoint) throws Throwable {
        MDC.put(RequestIdUtils.REQUEST_ID_KEY, RequestIdUtils.generateRequestId());
        try {
            return joinPoint.proceed();
        } finally {
            MDC.remove(RequestIdUtils.REQUEST_ID_KEY);
        }
    }

}
```

## 4.2 rpc调用（这里我们以dubbo为例）
dubbo之间的调用就需要额外的配置了，这里我们在consumer端实现了个dubbo的Filter用于传递requestId，在provider端的service层实现切面用于接收requestId。
 
### 4.2.1 consumer端
```java
/**
 * dubbo的RequestId过滤器
 * <p>
 * dubbo的customer在消费之前，添加requestId到RpcContext中
 */
public class RequestIdFilter implements Filter {

    @Override
    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        String requestId = MDC.get(RequestIdUtils.REQUEST_ID_KEY);
        if (requestId == null) {
            requestId = RequestIdUtils.generateRequestId();
        }
        RpcContext.getContext().setAttachment(RequestIdUtils.REQUEST_ID_KEY, requestId);
        return invoker.invoke(invocation);
    }

}
```
在`resource/META-INF\dubbo`下新建`com.alibaba.dubbo.rpc.Filter`文件，在其中配置RequestIdFilter，如下所示。
```
RequestIdFilter=sunbufu.filter.RequestIdFilter
```

在dubbo的配置文件中配置上filter，如下所示：
```xml
<dubbo:reference id="queryInfoService" interface="sunbufu.IQueryInfoService" timeout="120000" filter="RequestIdFilter"/>
```


### 2.2.2 provider端
```java
/**
 * requestId的切面
 * 处理service层的requestIdm
 */
@Aspect
@Component
@Order(0)
public class RequestIdServiceAspect {

    @Pointcut("execution(public * sunbufu.service..*ServiceImpl.*(..))")
    public void serviceImplPoint() {
    }

    /**
     * service的requestId处理策略
     * <p>
     * 1.Controller调用：MDC中有requestId。使用MDC中。不需要清除MDC
     * 2.dubbo调用：MDC中没有requestId，RpcContext中有requestId。把RpcContext的requestId放入MDC。调用完成后清除MDC中requestId
     * 3.其他项目dubbo调用：MDC，RpcContext都没有。需要生成requestId。调用完成后清除MDC中requestId
     *
     * @param joinPoint
     * @return
     * @throws Throwable
     */
    @Around("serviceImplPoint()")
    public Object doServiceImplPointAround(ProceedingJoinPoint joinPoint) throws Throwable {
        Object result = null;
        //Controller调用
        if (MDC.get(RequestIdUtils.REQUEST_ID_KEY) != null) {
            result = joinPoint.proceed();
        } else {
            //检查dubbo上下文中是否有requestId
            String requestId = RpcContext.getContext().getAttachment(RequestIdUtils.REQUEST_ID_KEY);
            if (requestId == null) {
                //其他项目dubbo调用
                requestId = RequestIdUtils.generateRequestId();
            }
            //调用，并在完成后清除MDC的requestId
            MDC.put(RequestIdUtils.REQUEST_ID_KEY, requestId);
            try {
                result = joinPoint.proceed();
            } finally {
                MDC.remove(RequestIdUtils.REQUEST_ID_KEY);
            }
        }
        return result;
    }

}
```
