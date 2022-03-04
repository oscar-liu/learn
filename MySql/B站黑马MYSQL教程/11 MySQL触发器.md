# MySQL触发器



## 介绍

触发器是一种特殊的存储过程，触发器和存储过程一样是一个能够完成特定功能，存储在数据库服务器上的SQL片断，但是触发器无需调用，当对数据表中的数据执行DML操作时自动触 发这个SQL片断的执行，无需手动调用。

在MySQL中，只有执行insert, delete, update操作时才能触发触发器的执行

触发器的这种特性可以协助应用在数据库端确保数据的完整性，日志记录，数据校验等操作

使用别名OLD和NEW来引用触发器中发生变化的记录内容，这与其它的数据库是相似的。现在的触发器还只支持行级触发，不支持语句级触发。



## 触发器的特性

1、 什么条件会触发： I，D，U

2、什么时候触发，在增删改前或者后

3、触发频率：针对每一行执行

4、触发器定义在表上，附着在表上



## 触发器的操作

### 创建触发器

格式：

触发事件： inter , delete, update

```sql
-- 创建只有一个执行语句的触发器
create trigger 触发器名 before|after 触发事件
on 表名 for each row
执行语句;
```



```sql
-- 创建有多个执行语句的触发器
create trigger 触发器名 before | after 触发事件
on 表名 for each row
begin
	执行语句列表
end;
```



示例：

```sql
-- 数据准备
create database if not exists mydb_trigger;
use mydb_trigger;

-- 用户表
create table user(
	uid int primary key,
    username varchar(50) not null,
    password varchar(50) not null
);

-- 用户信息操 作日志表
create table user_logs(
	id int primary key auto_increment,
    time timestamp,
    log_text varchar(255)
);

-- 需求： 当用户表，添加一行数据，则会自动在user_logs添加日志记录

-- 定义触发器
create trigger trigger_user_inster after insert
on user for each row
insert into user_logs values(NULL, now(), 'user表新增了一条记录');

-- 此语句会触发往user_logs中新增一条日志记录
insert into user values(1,'张三','123456');
```



### NEW与OLD

MySQL中定义了NEW和OLD，用来表示触发器所在表中，触发了触发器的那一行数据，来引用触发器中发生变化的记录内容

| 触发器类型     | 触发器类型NEW和OLD的使用                               |
| -------------- | ------------------------------------------------------ |
| INSERT型触发器 | NEW表示将要或者已经新增的数据                          |
| UPDATE型触发器 | OLD表示修改之前的数据，NEW表示将要或者已经修改后的数据 |
| DELETE型触发器 | OLD表示将要或者已经删除的数据                          |

使用方法：

NEW.columnName (columnName为相应数据表某一列名)

示例：

```sql
 -- insert类型的触发器
create trigger trigger_user_inster_new after insert
on user for each row
insert into user_logs values(NULL, now(), concat('有新用户增加，信息为：', NEW.uid, NEW.username, NEW.password));

insert into user values(4, '芒果', '1111111');

```

```sql
-- update 类型的触发器
create trigger trigger_user_update_old after update
on user for each row
insert into user_logs values(NULL, now(), concat('有用户信息修改，信息为：', OLD.uid, OLD.username, OLD.password,"修改为：",NEW.uid, NEW.username, NEW.password));

update user set username = '芒果2' where uid = 4;
```



### 查询定义的的触发器

```sql
-- 查询MYSQL中定义好的触发器
SELECT TRIGGER_SCHEMA,TRIGGER_NAME,EVENT_OBJECT_TABLE FROM information_schema.`TRIGGERS`;

TRIGGER_SCHEMA是所在的库名称
TRIGGER_NAME 触发器名称
EVENT_OBJECT_TABLE 触发器所在表名称

方法2: 查看触发器
show triggers;
```



### 删除触发器

使用DROP TRIGGER语句可以删除MySQL中已经定义的触发器

```sql
drop trigger if exists 触发器名称;
```



### 注意事项

- 不能对本表进行insert,update,delete操 作，避免递归循环
- 尽量少使用触发器
- 触发器是针对每一行的，对增删改非常频繁的表切记不要使用触发器，非常消耗资源。
