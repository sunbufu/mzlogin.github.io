---
layout: post
title: Spring StateMachine介绍
categories: [java, spring]
description: Spring StateMachine介绍
keywords: Spring StateMachine
---

# 一、状态机
有限状态机是一种用来进行对象行为建模的工具，其作用主要是描述对象在它的生命周期内所经历的状态序列，以及如何响应来自外界的各种事件。在电商场景（订单、物流、售后）、社交（IM消息投递）、分布式集群管理（分布式计算平台任务编排）等场景都有大规模的使用。

## 状态机的要素：
状态机可归纳为4个要素，现态、条件、动作、次态。“现态”和“条件”是因，“动作”和“次态”是果。  
1. 现态：指当前所处的状态
2. 条件：又称“事件”，当一个条件被满足，将会触发一个动作，或者执行一次状态的迁移
3. 动作：条件满足后执行的动作。动作执行完毕后，可以迁移到新的状态，也可以仍旧保持原状态。动作不是必须的，当条件满足后，也可以不执行任何动作，直接迁移到新的状态。
4. 次态：条件满足后要迁往的新状态。“次态”是相对于“现态”而言的，“次态”一旦被激活，就转换成“现态”。

## 状态机动作类型：
1. 进入动作：在进入状态时进行
2. 退出动作：在退出状态时进行
3. 输入动作：依赖于当前状态和输入条件进行
4. 转移动作：在进行特定转移时进行

# 二、spring statemachine
spring statemachine是使用 Spring框架下的状态机概念创建的一种应用程序开发框架。它使得状态机结构层次化，简化了配置状态机的过程。  
官方文档：<https://docs.spring.io/autorepo/docs/spring-statemachine/1.0.0.M3/reference/htmlsingle/#sm-statecontext>

## 例子一：简单订单状态
![订单状态流程]({{ site.url }}/images{{ page.url }}/20180507125704883.jpg)  
源码已经上传到[github](https://github.com/sunbufu/spring-state-machine-demo)。  
如下所示：
### 1 引入依赖

```xml
<!--spring statemachine-->
<dependency>
    <groupId>org.springframework.statemachine</groupId>
    <artifactId>spring-statemachine-core</artifactId>
    <version>2.0.1.RELEASE</version>
</dependency>
```

### 2 创建订单状态枚举类和状态转换枚举类

```java
/**
 * 订单状态
 * 
 * @author sunbufu
 */
public enum OrderState {
    /** 待支付 */
    WAIT_PAYMENT,
    /** 待发货 */
    WAIT_DELIVER,
    /** 待收货 */
    WAIT_RECEIVE,
    /** 完结 */
    FINISH;
}
```

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

### 3 添加配置

```java
/**
 * 订单状态机配置
 * 
 * @author sunbufu
 */
@Configuration
@EnableStateMachine(name = "orderStateMachine")
public class OrderStateMachineConfig extends EnumStateMachineConfigurerAdapter<OrderState, OrderEvent> {

    @Override
    public void configure(StateMachineStateConfigurer<OrderState, OrderEvent> states) throws Exception {
        states.withStates()
            // 默认状态
            .initial(OrderState.WAIT_PAYMENT)
            // 全部状态
            .states(EnumSet.allOf(OrderState.class));
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions) throws Exception {
        transitions.withExternal()
            // 支付事件 待支付 -> 待发货
            .source(OrderState.WAIT_PAYMENT).target(OrderState.WAIT_DELIVER).event(OrderEvent.PAYED)
            // 发货事件 待发货 -> 待收货
            .and().withExternal().source(OrderState.WAIT_DELIVER).target(OrderState.WAIT_RECEIVE).event(OrderEvent.DELIVERY)
            // 收货事件 待收货 -> 完结
            .and().withExternal().source(OrderState.WAIT_RECEIVE).target(OrderState.FINISH).event(OrderEvent.RECEIVED);
    }

    /** 状态机持久化 */
    @Bean
    public StateMachinePersister<OrderState, OrderEvent, Order> orderStateMachinePersister() {
        return new DefaultStateMachinePersister<>(new StateMachinePersist<OrderState, OrderEvent, Order>() {
            @Override
            public void write(StateMachineContext<OrderState, OrderEvent> context, Order order) {
                // 进行持久化操作
                order.setStatus(context.getState());
            }

            @Override
            public StateMachineContext<OrderState, OrderEvent> read(Order order) {
                // 读取状态并设置到context中
                return new DefaultStateMachineContext<>(order.getStatus(), null, null, null);
            }
        });
    }
}
```

### 4 添加订单状态监听器

```java
/**
 * 订单状态变更监听器
 * 
 * @author sunbufu
 */
@Component
@WithStateMachine(name = "orderStateMachine")
public class OrderStateListener {

    @OnTransition(source = "WAIT_PAYMENT", target = "WAIT_DELIVER")
    public boolean payTransition(Message<OrderEvent> message) {
        System.out.println("待支付 --支付--> 待发货");
        return true;
    }

    @OnTransition(source = "WAIT_DELIVER", target = "WAIT_RECEIVE")
    public boolean deliverTransition(Message<OrderEvent> message) {
        System.out.println("待发货 --发货--> 待收货");
        return true;
    }

    @OnTransition(source = "WAIT_RECEIVE", target = "FINISH")
    public boolean receiveTransition(Message<OrderEvent> message) {
        System.out.println("待收货 --收货--> 完成");
        return true;
    }
}
```

### 5 service中使用

```java
/**
 * 订单服务
 *
 * 待支付 -> 待发货 -> 待收货 -> 完结
 *
 * @author sunbufu
 */
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private StateMachine<OrderState, OrderEvent> orderStateMachine;

    @Autowired
    private StateMachinePersister<OrderState, OrderEvent, Order> orderStateMachinePersister;

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public Order create() {
        Order order = new Order();
        order.setStatus(OrderState.WAIT_PAYMENT);
        return orderMapper.save(order);
    }

    @Override
    public Order pay(int id) {
        Order order = orderMapper.select(id);
        if (!sendEvent(OrderEvent.PAYED, order)) {
            throw new RuntimeException(" 等待支付 -> 等待发货 失败, 状态异常 order=" + order);
        }
        return order;
    }

    @Override
    public Order deliver(int id) {
        Order order = orderMapper.select(id);
        if (!sendEvent(OrderEvent.DELIVERY, order)) {
            throw new RuntimeException(" 等待发货 -> 等待收货 失败，状态异常 order=" + order);
        }
        return order;
    }

    @Override
    public Order receive(int id) {
        Order order = orderMapper.select(id);
        if (!sendEvent(OrderEvent.RECEIVED, order)) {
            throw new RuntimeException(" 等待收货 -> 完成 失败，状态异常 order=" + order);
        }
        return order;
    }

    /**
     * 发送订单状态转换事件
     *
     * @param event 事件
     * @param order 订单
     * @return 执行结果
     */
    private boolean sendEvent(OrderEvent event, Order order) {
        boolean result = false;
        try {
            orderStateMachine.start();
            // 设置状态机状态
            orderStateMachinePersister.restore(orderStateMachine, order);
            result = orderStateMachine.sendEvent(MessageBuilder.withPayload(event).setHeader("order", order).build());
            // 保存状态机状态
            orderStateMachinePersister.persist(orderStateMachine, order);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            orderStateMachine.stop();
        }
        return result;
    }
}
```

### 6 测试

```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class OrderServiceImplTest {

    @Autowired
    private OrderService orderService;

    @Test
    public void testSuccess(){
        Order order = orderService.create();
        orderService.pay(order.getId());
        orderService.deliver(order.getId());
        orderService.receive(order.getId());
        assertTrue(OrderState.FINISH == order.getStatus());
    }

    @Test(expected = RuntimeException.class)
    public void testError(){
        Order order = orderService.create();
//        orderService.pay(order.getId());
        orderService.deliver(order.getId());
        orderService.receive(order.getId());
        assertTrue(OrderState.FINISH == order.getStatus());
    }

}
```
