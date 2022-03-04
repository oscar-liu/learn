# MySQL基本操作-DQL

## 概念

- 数据库管理系统一个重要的功能就是数据查询，数据查询不应只是简单返回数据库中存储的数据，还应该根据需要对数据进行筛选以及确定数据以什么样的格式显示。
- MySQL提供了功能强大、灵活的语句来实现这些操作。
- 关键字：select

## 语法格式

```sql
-- 基础语法
select
	[all|distinct]
	<目标列的表达式1> [别名],
	<目标列的表达式2> [别名]...
from <表名或视图名> [别名], <表名或视图名> [别名]...
[where<条件表达式>]
[group by <列名>]
[having <条件表达式>]
[order by <列名> [asc|desc]]
[limit <数字或列表>];

-- 简洁语法
select *|列名 from 表名 where 条件表达式

-- 示例
select * from student; -- 查询整表所有字段列
select * from student where id = 1; -- 符合ID=1
select id,name from student ; -- 查询所有数据，只显示id和name列
```

数据示例：

```sql
create database if not EXISTS mydb2;
use mydb2;
create table product(
	pid int(6) PRIMARY KEY auto_increment,
	pname VARCHAR(20) not null,
	price double, 
	category_id varchar(20)
);
INSERT INTO product values(null, '衬衣', 300, 'c002');
INSERT INTO product values(null, '西裤', 800, 'c002');
INSERT INTO product values(null, '花花公子夹克', 100, 'c002');
INSERT INTO product values(null, '卫衣', 200, 'c002');
INSERT INTO product values(null, '运动裤', 100, 'c002');
INSERT INTO product values(null, '阿迪鞋子', 900, 'c002');
INSERT INTO product values(null, '面霜', 800, 'c003');
INSERT INTO product values(null, '精华水', 100, 'c003');
INSERT INTO product values(null, '香奈儿', 200, 'c003');
INSERT INTO product values(null, 'SK-II神仙水', 100, 'c003');
INSERT INTO product values(null, '粉底', 900, 'c003');
INSERT INTO product values(null, '方便面', 10, 'c004');
INSERT INTO product values(null, '海带', 20, 'c004');
INSERT INTO product values(null, '三只松鼠', 80, 'c004');
```

## 查询SELECT

### 1、简单查询

```sql
-- 查询所有
select * from product;
-- 查询商品名称和商品分类pname,category_id
select panme,category_id from product;
-- 列别名
select pname, price from product;
-- 去掉重复值  distinct关键词
select distinct price from product; 
-- 查询结果是表达式(运算查询)，将所有商品的价格+10无进行运算
select pname, price+10 from product;
```



### 2、运算符

##### 简介

数据库中的表结构确定后，表中的数据代表的意义就已经确定。通过MySQL运算符进行运算，就可以获取到表结构以外的另一种数据。

MySQL支持4种运算符

- 算术运算符：+ - *  /或者DIV % 或者MOD
- 比较运算符
- 逻辑运算符
- 位运算符

##### 算术运算符

| 算术运算符 | 说明               |
| ---------- | ------------------ |
| +          | 加法运算           |
| -          | 减法运算           |
| *          | 乘法运算           |
| /或者DW    | 除法运算，返回商   |
| %或者MOD   | 求余运算，返回余数 |

##### 比较运算符

| 比较运算符          | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| =                   | 等于                                                         |
| < 和 <=             | 小于和小于等于                                               |
| > 和 >=             | 大于和大于等于                                               |
| <=>                 | 安全的等于，两个操作码均为NULL时，其所得值 为1；而当一个操作码为NULL时，其所得值 为0 |
| <>或者!=            | 不等于                                                       |
| IS NULL 或者 ISNULL | 判断一个值 是否为NULL                                        |
| IS NOT NULL         | 判断一个值 是否不为NULL                                      |
| LEAST               | 当有两个或多个参数时，返回最小值                             |
| GREATEST            | 当有两个或者多个参数时，返回最大值                           |
| BETWEEN AND         | 判断一个值是否落在两个值 之间                                |
| IN                  | 判断一个值 是IN列表中的任意一个值                            |
| NOT IN              | 判断一个值 不是IN列表中的任意一个值                          |
| LIKE                | 通配符匹配                                                   |
| REGEXP              | 正则表达式匹配                                               |

##### 逻辑运算符

 

| 逻辑运算符   | 说明     |
| ------------ | -------- |
| NOT 或者 ！  | 逻辑非   |
| AND 或者 &&  | 逻辑与   |
| OR 或者 \|\| | 逻辑或   |
| XOR          | 逻辑异或 |



##### 位运算符

位运算符是在二进制上进行计算的运算符，会先将操作数变成二进制，进行位运算。然后再将计算结果从二进制转变回十进制。很少用到。

| 位运算符 | 说明                   |
| -------- | ---------------------- |
| !        | 按位或                 |
| &        | 按位与                 |
| ^        | 按位异或               |
| <<       | 按位左移               |
| >>       | 按位右移               |
| ~        | 按位取反，反转所有比特 |
|          |                        |

### 3、排序查询

关键词：order by

- asc代表升序，desc代表降序，如果不写默认是升序
- order by用于子句中可以支持单个字段，多个字段，表达式，函数，别名
- order by子句，放在查询语句的最后面。limit 子句除外

**示例：**

```
-- 使用价格排序
select * from product order by price desc;
-- 在价格排序的基础上，以分类排序
select * from product order by price desc, category_id asc;
--显示商品的价格（去重复），并排序
select distinct price from product order by price desc;
```



### 4、聚合查询 

前面描述的查询都是横向查询，都是根据条件一行一行的进行判断，而使用聚合查询是纵向查询，它是对一列的值 进行计算，然后返回一个单一的值 ；另外聚合查询会忽略空值 。

| 聚合函数 | 作用                                                         |
| -------- | ------------------------------------------------------------ |
| count()  | 统计指定列不为NULL的记录行数                                 |
| sum()    | 计算指定列的数值和，如果指定列类型不是数值类型，那么计算结果为0 |
| max()    | 计算指定列的最大值，如果指定列是字符串类型，那么使用字符串排序运算 |
| min()    | 计算指定列的最小值，如果指定列是字符串类型，那么使用字符串排序运算 |
| avg()    | 计算指定列的平均值，如果指定列类型不是数值类型，那么计算结果为0 |

#### 聚合函数对NULL值 的处理

- count函数对null值的处理，如果count函数的参数为星号(*)，则统计所有记录的个数。而如果参数为某字段，不统计含null值 的记录个数。
- sum和avg函数对null值 的处理，这两个函数忽略null值 的存在，就好像这条记录不存在。
- max和min函数同样忽略null值的存在。



### 5、分组查询 group by

分组查询是指使用group by 字句对子查询进行分组。

格式：

```sql
select 字段1, 字段2 ... from 表名 group by 分组字段 having 分组条件;
```

示例：

```
-- 统计各分类商品的个数
select category_id, count(*) from product group by category_id;
```

**分组之后，则select子句之后，只能出现分组的字段和聚合统计函数，其它的字段不能出现。**

##### 分组之后的条件筛选having

- 分组之后对统计结果进行筛选的话必须使用having，不能使用where
- where子句用来筛选FROM子句中指定的操作所产生的行
- group by 子句用来分组WHERE子句的输出
- **having子句用来从分组结果中筛选行**

**格式：**

`select 字段1,字段2... from 表名 group by 分组字段 having 分组条件；`

**操作：**

```sql
-- 统计各个分类商品的个数，且只显示个数大于1的信息
select category_id, count(*) from product group by category_id having count(*) > 1;
-- 统计各商品分类数，总条数，总金额，并加having筛选多重条件，分类总金额之和大于30
select category_id, count(*), sum(price) from product group by category_id having count(*) >１ and sum(price) > 30;

```

![image-20220109182824134](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220109182824134.png)



#### 6、分页查询 limit

格式

```sql
-- 方式1，显示前n条
select 字段1, 字段2 ... from 表名 limit n

-- 方式2 分页显示
select 字段1, 字段2 ... from 表名 limit m,n
m: 整数，表示从第几条索引开始，计算方式（当前页-1) * 每页显示条数
n: 整数，表示查询多少条数据
```

示例：

```sql
-- 查询前5条记录
select * from product limit 5;

-- 从第5条开始，显示5条
select * from product limit 5,5;
```



#### 7、INSERT INTO SELECT语句

将一张表的数据导入到另一张表，要求目标表必须存在

格式：

`insert into table2(field1, field2, ...) select value1, value2, ... from table1;`

或者

`insert into table2 select * from table1;`

示例：

```
-- 创建一个product2表，将表1的数据商品名称及价格插入到product2表

CREATE TABLE PRODUCT2(
	pname varchar(20),
	price double
);

insert into product2 (pname, price) select pname, price from product;
```

示例2：

```sql
-- 创建一个product3表，统计商品分类统计数量
CREATE table product3(
	category_id varchar(20),
	product_count int
);

insert into product3 select category_id, count(*) from product group by category_id;
```



