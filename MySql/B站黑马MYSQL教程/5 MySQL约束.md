# MySql约束

### 简介，概念

constraint

约束实际上就是表中数据的限制条件

#### 作用

表在设计的时候加入了约束的目的是为了保证表中的记录完整性和有效性，比如用户表有些列的值不能为空，有的列的值不能重复。



#### 分类

- 主键约束(primary key) PK
- 自增长约束(auto_increment)
- 非空约束(not null)
- 唯一性约束(unique)
- 零填充约束(zerofill)
- 外键约束(foreign key) FK



### 主键约束primary key

#### 概念

- MySql主键约束是一个列或者多个列的组合，其值能唯一的标识表中的每一行，方便在RDBMS中尽快的找到某一行。

- 主键约束相当于唯一约束+非空约束的组合，主键约束列不允许重复，也不允许出现空值。

- 每个表最多只允许一个主键。

- 主键约束的关键字是：primary key

- 当创建主键约束时，系统默认会在所在的列和列组合上建立对应的唯一索引。

  

##### 操作主键

- 添加单列主键
- 添加多列联合主键
- 删除主键

constraint命名主键



#### 单列主键

创建单列主键有两种方式，一种是在定义字段的同时指定主键，一种是定义完字段后指定主键。

方式1语法：

```
-- 在create table语句中，通过 PRIMARY KEY 关键字来指定主键
-- 在定义字段的同时指定主键，语法格式如下：
crate table 表名(
	...
	<字段名> <数据类型> primary key
)
```

方式1实现示例：

```
crate table demo(
	sid int primay key,
	name VARCHAR(20)
);
```



方式2语法：

```
--在定义字段之后再定义主键
create table 表名(
	...
	[constraint <约束名>] primary key [字段名]
);

```

方式2实现：

```
create table demo2(
	id int,
	name varchar(20),
	constraint pk1 primary key (id)
);
```



#### 联合主键

主键是由一张表中多个字段组成的。

注意：

- 当主键是多个字段组成时，不能直接在字段名后面声明主键约束
- 一张表只能有一个主键，联合主键也是一个主键

语法：

```sql
create table 表名(
	...
	primary key (字段1,字段2,字段3)
);
```

示例：

```sql
create table demo3 (
	name varchar(20),
	depId int,
	num int,
	constraint nam1 primary key (name,depId)
);
```

任一字段均不能为空，两个主键不能同时成为重复值 。



#### 修改表结构添加主键

语法：

```sql
create table 表名( ... );
-- 通过alter table修改
ALTER TABLE <表名> add primary key (字段列表)；
```

示例：

```sql
-- 添加单列主键
create table demo4(
	id int,
	name varchar(20),
	depId int
);
alter table demo4 add primary key (id);
```

添加多列主键

```sql
alter table demo4 add primary key(id,name);
```



#### 删除主键

格式：

```sql
alter table <数据表名> drop primary key;
```

实现：

```
-- 删除单列主键
alter table demo1 drop primary key;
-- 删除多列主键
alter table demo1 drop primary key;
```



### 自增长约束auto_increment

#### 概念

当主键定义自增长后，这个主键的值 就不再需要用户输入数据 了，而由数据库系统根据定义自动赋值 。每增长一条记录，主键会自动以相同的步长进行增长。

通过给字段添加auto_increment属性来实现主键自增长。

语法：

```sql
字段名 数据类型 auto_increment	
```

操作

```
create table user (
	id int primary key auto_increment,
	name varchar(20)
);
```

#### 特点

- 默认情况下，auto_increment的初始值 是1，每新增一条记录，字段值 加1。
- 一个表中只能有一个字段使用auto_increment约束，则该字段必须有唯一索引，以避免序号重复（即为主键或者主键的一部分）
- auto_increment约束的字段必须具备NOT NULL属性
- auto_increment约束的字段只能是整数类型(TINYINT, SMALLINT, INT, BIGINT)等。
- auto_increment约束字段的最大值受该字段的数据类型约束，如果达到上限auto_increment就会失效。

#### 指定自增字段初始值 

如果第一条记录设置了该字段的初始值，那么新增加的记录就从这个初始值开始自增。如果表中插入的第1条记录的id值 是5，那么后续记录将会从5开始往上增加。

```
--方式1，创建表的时候指定
create table emp1 (
	id int primary key auto_increment,
	name varchar(20)
) auto_increment=100;
```



如果表中有数据了，想要自增主键从1开始，那么就需要删除这个字段，然后再添加一次即可

```
--删除ID字段
alter table student drop sid;
-- 添加sid字段
alter table student add id int(8) not null primary key AUTO_INCREMENT first;
```



delete和truncate在删除后自增列的变化

- delete后从自增最后的ID开始
- truncate从1开始



### 非空约束

not null

限定这个字段不能为空，必须有值 。

添加非空约束：

```sql
方式1：
<字段名> <数据类型> not null;

方式2：
alter table 表名 modify 字段 类型 not null

alter table student modify name varchar(20) not null;
```

删除非空约束

```
-- 直接使用modify关键字修改，不加not null
alter table student modify name varchar(20);
```



### 唯一约束unique

指字段这一列的记录中不能有重复的值。

语法：

```
--方式1
<字段名> <数据类型> unique
--方式2
alter table 表名 add constraint 约束名 unique(列)；
```

示例：

```sql
--创建表时指定
create table student (
	id int,
	name varchar(20),
	phone number varchar(20) unique --指定唯一约束
);

--修改表结构
ALTER TABLE student add constraint 约束名 unique(列)

--删除唯一约束
ALTER TABLE student drop index <唯一约束名>;

```



### 默认约束

MySQL默认值约束用来指定某列的默认值 。

语法

```
--方式1：
<字段名> <数据类型> default <默认值>
--方式2：
alter table 表名 modify 列表 类型 default 默认值；
```

示例

```
--方式1
create table student (
	id int,
	name varchar(20),
	address varchar(20) default '北京' --指定默认约束
);
-- 方式2
alter table student modify age int(20) default 20;
```



### 零填充约束

#### 概念

- 插入数据时，当该字段的值 的长度小于定义的长度时，会在该值 的前面补上相应的0
- zerofill默认为int(10)
- 当使用zerofill时，默认会自动加unsigned(无符号)属性，使用unsigned属性后，数值范围是原值 的2倍，例如：有符号为-128~+127，无符号为0-256

```
-- 使用方式类似，属性为 zerofill

create table demo1 (
	id int zerofill, -- 零填充约束
	name varchar(20)
);

-- 删除
alter table demo1 modify id int; -- 直接重新设置字段列的属性，去除zerofill关键字即可
```



### 总结

- 约束的分类
- 约束的作用
- 约束的用法