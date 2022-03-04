# MySQL视图

## 介绍

视图view是一个虚拟表，非真实存在，其本质是根据SQL语句获取动态的数据集，并为其命名，用户使用时只需要使用视图名称即可获取结果集，并可以将其当作表来使用。

数据库只存放了视图的定义，而并没有存放视图中的数据，这些数据还是放在原来的数据表中。

￼￼使用视图查询数据时，数据库系统会从原来的数据表中取出对应的数据。因此，视图中的数据是依赖于源数据表中的数据，源数据改变，显示在视图中的数据也会发生改变。

## 作用

简化代码，可以把重复使用的查询封闭成视图重复使用，同时可以使复杂的查询易于理解和使用

安全原因，如果一张表中有很多数据，很多信息不希望被所有人看到，此时可以使用视图，如：有一张表只显示姓名和一些不敏感字段开放给别人，身份证和和薪资不显示，可以对不同的用户，设定不同的视图。



## 视图的创建

语法格式：

``` sql
create [or replace] [algorithm = {undefind | mgerge | templtable } }]
view view_name [ {column_list} ]
as select_statement
[with [cascaded | local ] check option ]
```

参数说明：

- algorithm: 可选项，表示视图选择的算法
- view_name： 表示要创建的视图名称
- column_list：可选项，指定视图中各个属性的名词，默认情况下与select语句中的查询的属性相同
- select_statement： 表示一个完整的查询语句，将查询记录导入视图中
- [width [cascaded | local ] check option ]： 可选项，表示更新视图要保证在视图的权限范围之内

操作示例：

```sql
-- 创建视图1

create or replace view view1_emp 
as
select emp_name from emp;
￼
-- 查询所有表，区分视图
select full tables;
```

### 修改视图

修改视图是指修改数据库中已存在的表的定义。当其本表的某些字段发生改变时，可以通过修改视图来保持视图和其本表这间一致。MySQL中通过CREATE REPLACE VIEW语句和ALTER VIEW语句来修改视图。

格式：

```sql
alter view 视图名 as select 语句
```

示例：

```sql
-- 修改视图
alter view view1_emp
AS
select emp_name, salary from emp;
```



### 更新视图

某些视图是可更新的。也就是说，可以在UPDATE、DELETE或者INTER等语句中使用它们，以更基表（数据源表）的内容。对于可更新的视图，在视图中的行和基表中的行必须具有一对一的关系，如果视图包含下述结构中的任何一种，那么它就是不可更新的。

- 聚合函数（SUM(), MIN(), MAX(), AVG(), COUNT()等）
- DISTINCT
- GROUP BY
- HAVING
- UNION或者UNION ALL
- JOIN
- FORM子句中的不可更新视图
- WHERE子句中的子查询，引用FROM子句中的表
- 仅引用文字值

视图中虽然可以更新数据，但是有很多的限制，一般情况下，最好将视图作为查询数据的虚拟表，而不要通过视图更新数据。因为，使用视图更新数据时，如果没有全面考虑更新数据的限制，就可能会造成数据更新失败。



### 视图的其他操作

重命名视图

```sql
-- 重命名视图
rename table view1_emp to myview1;
```

删除视图

```sql
-- 删除视图 
drop view if exists myview1
```

