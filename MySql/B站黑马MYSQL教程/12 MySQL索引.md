# MySQL索引

## 概念介绍

### 什么是索引

索引就是一种将数据库中的记录按照特殊形式存储的数据结构。通过索引，能够显著地提高数据查询的效率，从而提升服务器的性能。

索引是一个排好序的列表，在这个列表中存储着索引的值和包含这个值的数据所在行的物理地址。在数据库十分庞大的时候，索引可以大大加快查询的速度，**这是因为使用索引后可以不用扫描全表来定位某行的数据，而是先通过索引表找到该行数据对应的物理地址然后访问相应的数据。**

索引，其实并不是 MySQL 数据库特有的机制，在关系型数据库中都会有类似不同的实现。这里我们也只是讨论 MySQL 数据库中的索引实现。

事实上，说是 MySQL 的索引其实并不准确。因为在 MySQL 中，索引是在存储引擎层而不是服务器层实现的。这意味着我们所讨论的索引准确来说是 InnoDB 引擎或 MyISAM 引擎或其它存储引擎所实现的。

所以索引即便是在 MySQL 中也没有统一的标准，不同存储引擎的所实现的索引工作方式也并不一样。不是所有的存储引擎都支持相同类型的索引，即便是多个引擎支持同一种类型的索引，其底层的实现也可能不同。

### 为什么需要索引

索引似乎就是给数据库添加了一个「目录页」，能够方便查询数据。但是索引的作用就仅此而已了吗，为什么需要大费周章的建立并优化索引？

使用索引后可以不用扫描全表来定位某行的数据，而是先通过索引表找到该行数据对应的物理地址然后访问相应的数据。这样的方式自然减少了服务器在响应时所需要对数据库扫描的数据量。

不仅如此，在执行数据库的范围查询时，若不使用索引，那么MySQL会先扫描数据库的所有行数据并从中筛选出目标范围内的行记录，将这些行记录进行排序并生成一张临时表，然后通过临时表返回用户查询的目标行记录。这个过程会涉及到临时表的建立和行记录的排序，当目标行记录较多的时候，会大大影响范围查询的效率。

所以当添加索引时，由于索引本身具有的顺序性，使得在进行范围查询时，所筛选出的行记录已经排好序，从而避免了再次排序和需要建立临时表的问题。

同时，由于索引底层实现的有序性，使得在进行数据查询时，能够避免在磁盘不同扇区的随机寻址。使用索引后能够通过磁盘预读使得在磁盘上对数据的访问大致呈顺序的寻址。这本质上是依据局部性原理所实现的。

> **局部性原理：**当一个数据被用到时，其附近的数据也通常会马上被使用。程序运行期间所需要的数据通常比较集中。由于磁盘顺序读取的效率很高(不需要寻道时间，只需很少的旋转时间) ，因此对于具有局部性的程序来说，磁盘预读可以提高I/O效率。

磁盘预读要求每次都会预读的长度一般为页的整数倍。而且数据库系统将一个节点的大小设为等于一个页，这样每个节点只需要一次 I/O 就可以完全载入。这里的页是通过页式的内存管理所实现的，概念在这里简单提一嘴。

> **分页机制**就是把内存地址空间分为若干个很小的固定大小的页，每一页的大小由内存决定。这样做是为了从虚拟地址映射到物理地址，提高内存和磁盘的利用率。

总结一下。索引的存在具有很大的优势，主要表现为以下三点：

- 索引大大减少了服务器需要扫描的数据量
- 索引可以帮助服务器避免排序和临时表
- 索引可以将随机I/0变成顺序I/0

以上三点能够大大提高数据库查询的效率，优化服务器的性能。因此一般来说，为数据库添加高效的索引对数据库进行优化的重要工作之一。

### 索引的弊端

索引的存在能够带来性能的提升，自然在其它方面也会付出额外的代价。

索引本身以表的形式存储，因此会占用额外的存储空间；索引表的创建和维护需要时间成本，这个成本随着数据量增大而增大；构建索引会降低数据的修改操作（删除，添加，修改）的效率，因为在修改数据表的同时还需要修改索引表；

所以对于非常小的表而言，使用索引的代价会大于直接进行全表扫描，这时候就并不一定非得使用索引了。



## 索引的分类

索引是存储引擎用来快速查找记录的一种数据结构，按照实现的方式分类，主要有Hash索引和B+Tree索引

### Hash索引

时间复杂度O(1)

原理：

根据特定的算法函数，生成hash值存储对应的行位置，查询的时候根据索引值换算成hash值命中hash值获取对应的行位置，避免全表扫描。

![在这里插入图片描述](https://img-blog.csdnimg.cn/8d8d1df640de4e4cb50360eacca8df93.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)



### B+Tree索引

待补充资料



### 索引类型

- 单列索引：

  一个索引只包含单列，但一个表中可以有多个单列索引，

  单列索引又可以分为：普通索引，唯一索引，主键索引

- 组合索引

- 全文索引

- 空间索引



## 索引操作

### 索引查看

```sql
-- 查看数据库所有索引
-- 语法
select * from mysql.`innode_index_stats` a where a.`database_name` = '数据库名';
-- 示例1, 查询mydb1库中的所有索引
select * from mysql.`innodb_index_stats` a where a.`database_name` = 'mydb1'; 
-- 示例2, 查询mydb1库中的student表中的所有索引
select * from mysql.innodb_index_stats a where a.database_name = 'mydb1' and table_name = 'student';

-- 查看表中所有索引 
-- 语法
show index from table_name;
-- 示例
show index from student;
```



![image-20220211182306793](https://img-blog.csdnimg.cn/abdaeae8480b449488ff91dd3a08b3c9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)

### 删除索引

```sql
-- 方式1
drop index 索引名 on 表名
-- 方式2
alter table 表名 drop index 索引名
```



### 单列索引 

单列索引又可以分为：普通索引，唯一索引，主键索引

#### 主键索引

每张表一般都会有自己的主键，当我们在创建表时，MySQL会自动在主键列上建立 一个索引，这就是主键索引 ，主键索引具有唯一性并且不允许为NULL。



#### 普通索引

MySQL中基本索引类型，没有什么限制，允许在定义索引的列中插入重复值和空值，纯粹为了查询数据更快一点。

创建普通索引的三种方式：

```sql
-- 在创建表的时候创建
create table user(
	uid int primary key,
    name varchar(50),
    index index_uid(uid) -- 给uid列创建普通索引
);

-- 方式2-直接创建
create index index_name on user(name); -- 给user表的name字段创建索引

-- 方式3 修改表结构（添加索引）
-- alter table tableName add index index_name(cloumnname)
alter table user add index index_name(name);
```



#### 唯一索引

索引列的值必须唯一，但允许有空值，如果是组合索引，则列值的组合必须唯一。

```sql
-- 方式1, 创建表的时候 直接指定
create table stu(
	sid int primary key,
	card_id varchar(20),
	name varchar(50),
	age int,
	phone varchar(11),
	unique index_card_id(card_id) -- 给card_id列创建唯一索引
);

-- 方式2,直接创建
-- create unique index 索引名 on 表名(列名)
create unique index index_card_id on stu(card_id);

-- 方式3,修改表结构
-- alter table 表名 add unique [索引名] (列名)
alter table stu add unique index_phone (phone)
```



### 组合索引

组合索引又名复合索引，是指在建立索引的时候 使用了多个字段，同样的可以建立为普通索引或者是唯一索引

复合索引的使用复合最左原则



格式：

```sql
-- 创建索引的基本语法
create index indexname on table_name(column1(length), column2(length));

-- 示例, 创建普通索引
create index index_phone_name on stu(phone, name);

-- 示例，创建唯一索引
create unique index unique_index on stu(phone, sid);
```



**什么叫最左原则？**

先匹配第一个索引字段，必须匹配到第一个字段才有可能命中索引。如果是and则两个都可以命中

示例

```sql
select * from stu where name = '姓名'; -- 没有命中索引
select * from stu where phone = '15507551111'; -- 命中索引
select * from stu where phone = '18888888888' and name = '姓名';  -- 命中索引
select * from stu where name = '姓名' and phone = '1888888888';  -- 命中索引
```





### 全文索引

全文索引的关键字是fulltext， 用的场景并不多

- 全文索引主要用来查找文本中的关键字，而不是直接与索引中的值比较，它更像是一个搜索引擎，基于相似度的查询，而不是简单的where语句的参数匹配

- 用like可以实现模糊匹配了，为什么还要全文索引？

  like 在文本比较少的时候 索引还可以，但是对大量的文本数据检索，效率和性能就不太行了。全文索引在大量文本数据面前，效果和性能比like更优。

#### 概述

全文索引在mysql5.6以前的版本，只有MyISAM存储引擎支持，5.6以后MyISAM和InnoDB存储引擎均支持全文索引。

只有字段的数据为char, varchar, text及其系列（longtext,等)才可以建立全文索引

MySQL中的全文索引，有几个关键变量，

最小搜索长度和最大搜索长度，小于最小的搜索长度和大于的大于最大的搜索长度都不会被索引。

```sql
-- 查看全局全文索引相关的变量
show variables like '%ft%';
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/36d759dc0a9a4198a5d9dc51eea1dbfa.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 操作全文索引

创建全文索引

创建方法与上面的唯一唯一类似，关键字是fulltext

使用索引

使用全文索引和常用的模糊匹配使用like 不同，全文索引有自己的语法格式，使用match和agains关键字。

格式：

```sql
match(col1, col2, ...) against(expr [search_modifier])
```

示例：

```sql
select * from article where match(content) against('新年快乐'); 
```



### 空间索引

在MySQL5.7之后的版本才支持空间索引。

空间索引是对空间数据类型的字段建立索引，了解有这玩意儿就行了，常规开发也用不上。

