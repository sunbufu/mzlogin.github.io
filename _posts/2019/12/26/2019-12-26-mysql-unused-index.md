---
layout: post
title: 关于索引失效
categories: [sql]
description: 状态模式的实现
keywords: mysql, unused index
---

# 1. 使用 `EXPLAIN`
`EXPLAIN` 是很重要的一个 sql 关键字，可以帮我们查看 sql 的执行计划，寻找到 sql 的问题，优化你的 sql。 
使用起来却很简单，只需要在你原来的 sql 前面添加 `EXPLAIN` 即可，但是我们的重点是在分析执行计划上。
```sql
EXPLAIN SELECT * FROM t_order;
```
执行计划各列的含义如下：详情请参考[官方文档](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html)

| 列名 | 含义 |
|----|----|
| id | 执行序号，mysql 会按照从大到小的顺序执行 |
| select_type | 查询类型：`SIMPLE` 简单查询，`PRIMARY` 外层查询，`SUBQUERY` 子查询，`DERIVED` 派生查询（FROM 中包含的子查询），`UNION` UNION 中第二个或后面的那个查询，`UNION RESULT` UNION 的结果 |
| table | 引用的表 |
| partitions | 所属分区 |
| type | 访问类型[官方文档](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#explain-join-types)，常见访问类型：`system` 只有一条记录的表（=系统表），`const` 通过索引一次就查询到，`eq_ref` 唯一索引等值扫描，`ref` 非唯一索引等值扫描，`range` 范围索引扫描，`index` 索引扫描，`all` 全表扫描 |
| possible_keys | 可能使用的索引（优化前） |
| key | 实际使用的索引（优化后） |
| key_len | 使用索引的长度 |
| ref | 上述表的连接匹配条件（哪些列或常量被用于查找索引列上的值） |
| rows | 必须扫描的行数 |
| Extra | 附加信息[官方文档](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#explain-extra-information)，常见附加信息：`Using filesort` mysql 无法利用索引完成排序操作，`Using temporary` 使用了临时表保存中间结果，`Using index` select 操作使用了覆盖索引，`Using where` 使用 where 过滤，`using join buffer` 使用了连接缓存，`impossible where` where子句的值总是false，不能用来获取任何记录，`distinct` 优化 distinct，在找到第一个匹配的记录后停止扫描同样值的动作 |

# 2. 索引失效

索引失效是指，虽然建立了索引，查询中也使用了索引做条件，但是最后执行的时候却没有使用索引的情况。

1. `OR` 关联非索引列  
2. 隐式类型转换  
   假设我们有个 varchar 类型 order_id 的索引。  
   反例：`SELECT * FROM order WHERE order_id = 123;`  
   正例：`SELECT * FROM order WHERE order_id = '123';`  
3. 运算符的使用  
   假设我们有个 int 类型 order_id 的索引。  
   反例：`SELECT * FROM order WHERE order_id - 1 = 9;`  
   正例：`SELECT * FROM order WHERE order_id = 10;`  
4. 函数的使用  
   假设我们有个 int 类型 order_id 的索引。  
   反例：`SELECT * FROM order WHERE ABS(order_id) = 9;`  
   正例：`SELECT * FROM order WHERE order_id = 9;`  
5. `LIKE` 以 % 开头  
   假设我们有个 varchar 类型的 user_name 的索引。  
   反例：`SELECT * FROM order WHERE user_name LIKE '%三';`  
   正例：`SELECT * FROM order WHERE user_name LIKE '张%';`  
6. 联合索引，未使用最左侧索引  
   假设我们有个联合索引 a,b,c，那么我们其实有 a，ab，abc。如果不使用 '最左前缀' 的话，无法使用复合索引。  
   反例：`SELECT * FROM order WHERE b = 1;`  
   正例：`SELECT * FROM order WHERE a = 1 AND b = 1;`  
7. mysql 觉得全表扫描更快(表数据少)

# 3. 总结

索引在数据库的查询中，是很重要的点，合理的设置和使用索引，可以大大提升系统的响应速度。
索引失效又是索引使用过程中需要躲避的一个大坑，特此记录，以备查用。