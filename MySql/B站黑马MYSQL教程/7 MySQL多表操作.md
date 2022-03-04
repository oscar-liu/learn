# MySQL多表操作

## 多表关系

MySQL多表之间的关系可以概括为：一对一，一对多/多对一关系，多对多。

### 一对一关系

- 一个学生只有一张身份证；一张身份证只能对应一个学生
- 在任一表中添加唯一外键，指向另一方主键，确保一对一关系
- 很少见，如果一张表的信息字段太多了，一些访问频率不高的数据可以放到另一个表，需要的时候再联表查询。



### 一对多/多对一关系

部门和员工：

分析：一个部门有多个员工，一个员工只能对应一个部门

实现原则：在多的一方建立外键，指向一的一方的主键。

<img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220112091214210.png" alt="image-20220112091214210" style="zoom:50%;" />





### 多对多关系

学生和课程

分析：一个学生可以选择很多门课程，一个课程也可以被很多学生选择

原则：多对多关系实现需要借助第三线中间表，中间表至少包含两个字段，将多对多的关系，拆成一对多的关系，中间表至少需要两个外键，这两个钟点外键分别指向原来的那两张表的主键。

<img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220112091506119.png" alt="image-20220112091506119" style="zoom: 50%;" />





## 外键约束

MySQL外键约束(FOREIGN KEY)是表的一个特殊字段，经常与主键约束一起使用。对于两个具有关联关系的表而言，相关联字段中主键所在的表就是主表（父表），外键所在的表就是从表（子表）。

外键用来建立主表与从表的关联关系，为两个表的数据建立连接，约束两个表中数据的一致性和完整性。

### 特点：

定义一个外建时，需要遵守以下规则：

- 主表必须已经存在于数据库中，或者是当前正在创建的表。
- 必须为主表定义主键
- 主键不能包含空值，但允许在外键中出现空值。也就是说，只要外键的每个非空值出现在指定的主键中，这个外键的内容就是正确的。
- 外键中列的数目必须和主表的主键中列的数目相同。
- 外键中列的数据类型必须和主表主键中对应列的数据类型相同。



### 创建外键约束

方式1：在创建表时设置外键约束

在create table 语句中，通过foreign key 关键字来指定外键，语法格式如下：

```
[constraint <外键名> foreign key 字段名 [字段2, ...] references <主表名> 主键列1, [主键列2, ...] ]
```

示例实现1：

```
create database mydb3;
use mydb3;
-- 创建部门表-主表
create table if not exists dept(
	depid varchar(20) primary key, --部门ID 
	name varchar(20) --部门名称
);

-- 创建从表，子表
create table if not exists emp(
	eid varchar(20) primary key, 
	ename varchar(20),
	depid varchar(20),
	constraint emp_fk foreign key (depid) references dept (depid)
);
```

方式2：

```sql
alter table <数据表名> add constraint <外键名> foreign key(<列名>) references
```

### 删除数据

- 主表的数据被从表依赖时，主表的数据不能删除
- 从表的数据可以随意删除

- 外建只要被删除了，就会解除主表和从表的关联关系。

格式：

```
alter table <表名> drop foreign key <外键约束名>;
```

实现：

```
alter table emp2 drop foreign key dep_id_fk;
```



### 多对多关系

在多对多关系中，A表的一行对应B的多行，B表的一行对应A表的多行，我们要新增加一个中间表，来建立多对多关系。

- 有外键列的表为从表
- 外键列引用的表为主表

<img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220115145641218.png" alt="image-20220115145641218" style="zoom:67%;" />



## 多表联合查询

### 介绍

多表查询就是同时查询两个或者两个以上的表，因为有的时候用户在查看数据的时候，需要显示的数据来自多张表。

多表查询：

<img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220115150925942.png" alt="image-20220115150925942" style="zoom:67%;" />

- 交叉连接查询

  语法：select * from a, b;

- 内连接查询 inner join --inner可以省略

  隐式内连接（SQL92标准）: select * from a,b where 条件;

  显式内连接（SQL99标签）: select * from a inner join b on 条件;

- 外链接查询 outer join --outer可以省略

  左外连接：left outer join

  select * from A left outer join B on 条件;

  右外连接：right outer join

  select * from A right outer join B on 条件;

  满外边接：full outer join

  select * from A full outer join B on 条件;

- 子查询

  select嵌套

- 表自关联

  将一张表当成多张表来用

### 交叉连接查询

交叉连接查询返回被连接的两个表所有数据行的笛卡尔积。

笛卡尔积可以理解为一张表的每一行去和另外一张表的任意一行进行匹配，假如A表有M行数据，B表中有N行数据，则返回M*N行数据，笛卡尔积会产生很多冗余的数据，后期的其他查询可以在该集合的基础上进行条件筛选

格式：

```
select * from 表1, 表2, 表3,...;
```

实现：

```
-- 不加筛选条件就是显示所有，迪卡尔积
select * from dep, emp;
-- 部门ID查询条件
select * from dep, emp where dep.depid = emp.depid;
```



### 内连接查询

内连接查询可以理解为取多表的交集

格式：

```sql
隐式内边接： select * from tableA, tableB where 条件;
显示内边接： select * from tableA inner join tableB on 条件;
```

操作：

```sql
-- 查询每个部门的所属员工
-- 隐式
select * from dept, emp, where dep.depid = emp.depid;
-- 显式
select * from dept inner join emp on dept.deptid = emp.deptid;
-- 查询某部门数据
select * from dept join emp on dept.depid = emp.depid and dept.name in ('市场部','行政部');
-- 查询部门数据人数大于3的部门，并按人数降序排序
SELECT 
	a.id, a.name, count(1) as total_cnt
from dept a
	join emp b on a.id = b.depid
GROUP BY
	a.id, a.name
HAVING 
	total_cnt >= 2
order by 
	total_cnt desc;
```

 建议使用显式操作。

### 外连接查询

外边接查询分为左外链接（left outer join)，右外边接(right outer join)，满外连接(full outer join)。

outer可以省略， MySQL中的full outer join不支持，采用union。

格式：

```sql
-- 左外连接
select * from tableA left outer join tableB on <条件>;
-- 右外连接
select * from tableA right outer join tableB on <条件>;
-- 满外连接
select * from tableA full outer join tableB on <条件>;
```

操作示例：

```sql
-- 外边接查询
-- 查询部门员工数据
SELECT * from dept left join emp on dept.id = emp.depid;

-- 查询员工部门
SELECT * from dept right join emp on dept.id = emp.depid;

-- 满外连接

SELECT * from dept left join emp on dept.id = emp.depid
	union
SELECT * from dept right join emp on dept.id = emp.depid;
```

union 去重

union all 不去重



### 子查询

子查询就是指在一个完整的查询语句之中，嵌套若干个不同功能的小查询，从而一起完成复杂查询的一种编写形式，通俗一点就是包含select嵌套的查询。

子查询一般出现在where和from子句中

- where子句中的子查询：该位置处的子查询一般返回单行单列、多行多列、单选多列数据记录。
- from子句的子查询，该位置处的子查询一般返回多行多列数据记录，可以当作一张临时表。



在数据量较大的前提下，子查询性能优于连接查询。



```sql
示例：

-- 关联查询
select * from dept join emp on dept.id = emp.depid and (dept.name = '市场部' and age < 30 );

-- 查询市场部，年龄大于30

-- 2个结果进行关联查询
select * from (select * from dept where `name` = '市场部') t1 join (select * from emp where age > 30) t2 on t1.id = t2.depid;

-- 子查询
SELECT * from emp where depid = (SELECT id from dept where `name` = '市场部') and age > 30;

```



#### 子查询关键字

- ALL
- ANY
- SOME
- IN，NOT IN
- EXISTS

##### ALL关键字

格式：

```sql
select ... from ... where c > all(查询语句);
-- 等价于
select ... from ... where c > result and c > result2 and c > result3 ...
```

特点：

- all与子查询返回的所有值比较为true则返回true
- ALL可以与运算符结合来使用
- ALL表示指定列中的值 必须要大于子查询集的每一个值，即必须要大于子查询值的最大值或者最小值 （视运算符号）

示例：

```sql
-- 查询年龄小于部门ID=1003的所有年龄员工信息
select * from emp where age > all( select age from emp where depid = '1003');
-- 查询不属于任何一个部门的员工信息

```

##### ANY和SOME

格式：

```sql
select ... from ... where c > any(查询语句)
-- 等价于
select ... from ... where c > result1 or c > result or c > result3...
```

特点：

- ANY与子查询返回的任何值比较为true则返回true
- ANY可以与=,>,>=,<,<=,<>结合使用
- SOME和ANY的作用一样，SOME可以理解为ANY的别名

操作示例：

```sql
-- 查询年龄大于1003部门任意一个员工年龄的员工信息
select * from emp where age > any(select age from emp where depid = '1003');
```

##### IN

格式：

```sql
select ... from ... where c in (查询语句)
-- 等价于
select ... from ... where c = result1 or c = result2 or c = result3 ...
```

特点：

- IN关键字，用于判断某个记录的值 ，是否在指定集合中
- 在INT关键字前面可以加上NOT可以将条件取反

##### EXISTS

关键字EXISTS是一个布尔类型，当返回结果集时为TRUE，不能返回结果集时为FALSE。

查询时EXISTS对外表采用遍历方式逐条查询，每次查询都会比较EXISTS的条件语句，当EXISTS里的条件语句返回记录行时则条件为真，此时返回当前遍历到的记录，反之，如果EXISTS里面的条件语句不能返回记录行，则丢弃当前遍历到的记录。

格式：

```sql
select ... from ... where exists(查询语句)
```

