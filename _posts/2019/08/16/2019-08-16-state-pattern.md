---
layout: post
title: 状态模式的实现
categories: [design patterns]
description: 状态模式的实现
keywords: design patterns, state pattern
---

# 一、写在前面
之前有介绍过状态模式，但是不是特别直接。后来写了一篇 [Spring StateMachine 介绍]({{ site.url }}/2018/06/13/spring-statemachine/)，有几位同学联系我说想要源码。但是其实我觉得如果不是逻辑特别复杂的话，我不是特别推荐使用状态机。因为我们完全可以通过状态模式来实现，而且更加灵活和简单。

# 二、状态模式
状态模式的定义此处不在赘述，有兴趣的同学可以看下[之前的文章]({{ site.url }}/2018/06/06/design-patterns-04/#20%E7%8A%B6%E6%80%81%E6%A8%A1%E5%BC%8Fstate)。  
首先，我们来定义几个名词。  
+ 状态（state）  
这个比较好理解，状态模式嘛，就是管理状态的变更，所以首先我们要定义状态。
+ 事件（event）  
所谓事件，就是指状态变化的原因。例如，订单在经过支付事件之后，由 "待支付" 状态变为了 "待发货" 状态。
+ 上下文（context）  
负责状态以及状态的变更。

# 三、示例
为了跟 spring 的 state-machine 对比，我们依然使用简单订单状态的例子。  
![订单状态流程]({{ site.url }}/images{{ page.url }}/20180507125704883.jpg)  

## 3.1 状态（state）  
![订单的状态定义]({{ site.url }}/images{{ page.url }}/orderstate.png)

```java
/**
 * 订单状态
 */
public interface OrderState {

    /**
     * 处理订单事件
     * @param orderStateContext  上下文
     * @param orderEvent    事件
     */
    default void handle(OrderStateContext orderStateContext, OrderEvent orderEvent){
        System.out.println("can not handle this event " + orderEvent);
    }
}
```

```java
/**
 * 订单待支付状态
 *
 * @author sunbufu
 */
public class WaitPayState implements OrderState {

    @Override
    public void handle(OrderStateContext orderStateContext, OrderEvent orderEvent) {
        if (OrderEvent.PAYED == orderEvent) {
            System.out.println("pay...");
            orderStateContext.setOrderState(new WaitDeliveryState());
        } else {
            System.out.println("WaitPayState can not handle " + orderEvent);
        }
    }
}
```

```java
/**
 * 订单待发货状态
 *
 * @author sunbufu
 */
public class WaitDeliveryState implements OrderState {

    @Override
    public void handle(OrderStateContext orderStateContext, OrderEvent orderEvent) {
        if (OrderEvent.DELIVERY == orderEvent) {
            System.out.println("delivery...");
            orderStateContext.setOrderState(new WaitReceiveState());
        } else {
            System.out.println("WaitDeliveryState can not handle " + orderEvent);
        }
    }
}
```

```java
/**
 * 订单待收货状态
 *
 * @author sunbufu
 */
public class WaitReceiveState implements OrderState {

    @Override
    public void handle(OrderStateContext orderStateContext, OrderEvent orderEvent) {
        if (OrderEvent.RECEIVED == orderEvent) {
            System.out.println("receive...");
            orderStateContext.setOrderState(new FinishState());
        } else {
            System.out.println("WaitReceiveState can not handle " + orderEvent);
        }
    }
}
```

```java
/**
 * 订单完结状态
 *
 * @author sunbufu
 */
public class FinishState implements OrderState {

    @Override
    public void handle(OrderStateContext orderStateContext, OrderEvent orderEvent) {
        System.out.println("FinishState can not handle " + orderEvent);
    }
}
```

## 3.2 事件（event）
```java
/**
 * 订单事件
 * 
 * @author sunbufu
 */
public enum OrderEvent {
    /** 支付 */
    PAYED,
    /** 发货 */
    DELIVERY,
    /** 收货 */
    RECEIVED;
}
```

## 3.3 上下文（context）
```java
/**
 * 订单状态上下文
 * 
 * @author sunbufu 
 */
public class OrderStateContext {

    private Order order;

    /**
     * 修改订单状态
     *
     * @param orderState
     */
    public void setOrderState(OrderState orderState) {
        System.out.println(getOrder().getState() + " --> " + orderState);
        order.setState(orderState);
    }

    /**
     * 处理订单事件
     *
     * @param orderEvent
     */
    public void handle(OrderEvent orderEvent) {
        order.getState().handle(this, orderEvent);
    }

    public OrderStateContext() {
    }

    public OrderStateContext(Order order) {
        this.order = order;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

}
```

## 3.4 测试
```java
public class Application {

    public static void main(String[] args) {
        OrderStateContext orderStateContext = new OrderStateContext(new Order(1, new WaitPayState()));

        orderStateContext.handle(OrderEvent.PAYED);
        orderStateContext.handle(OrderEvent.DELIVERY);
        orderStateContext.handle(OrderEvent.RECEIVED);
    }
}
```

# 四、总结
我觉得，很多可以简单实现的功能，没必要引入庞大的框架，也许框架更容易实现你的功能，但是你在引入框架的同时，也让你的程序变得臃肿。所以这个度还需要开发者自己把握啊。
