# MySQL基本操作- DDL

### 1、DDL解释

DDL（Data Definition Language）数据定义语言

- 对数据库的常用操作
- 对表结构的常用操作
- 修改表结构

Database -> Table 

对数据库、表操作，不涉及到数据



### 2、DDL数据库操作

| 功能             | SQL                                                  |
| ---------------- | ---------------------------------------------------- |
| 查看所有数据库   | show databases;                                      |
| 创建数据库       | create database [if not exists] mydb1 [charset=utf8] |
| 切换、选择数据库 | use mydb1;                                           |
| 删除数据库       | drop database [if exists] mydb1;                     |
| 修改数据库编码   | alter database mydb1 character set utf8;             |
|                  |                                                      |

### 3、DDL数据表操作



##### 创建表格式

create table [if not exists] 表名 (

​	字段名1  类型[(宽度)] [约束条件] [comment '字段说明'],

​	字段名2 类型[(宽度)] [约束条件] [comment '字段说明']

)[表的一些设置];

创建表是构建一张空表，指定这个表的名字，这个表有几列，每一列叫什么名字，以及每一列的存储数据类型。

use mydb1;

create table if not exists student (

​	sid int,

​	name varchar(20),

​	age int,

​	birth date,

​	address varchar(20)

);



##### 数据类型

定义字段列时需要指定数据类型及类型大小。

###### 数值类型

整型，浮点型

| 类型          | 大小   | 范围(有符号)                                       | 范围(无符号)                                       | 用途           |
| ------------- | ------ | -------------------------------------------------- | -------------------------------------------------- | -------------- |
| TINYINT       | 1 byte | (-128,127)                                         | (0,255)                                            | 小整数值       |
| SMALLINT      | 2byte  | (-32768, 32767)                                    | (0,65535)                                          | 大小整 数值    |
| MEDIUMINT     | 3byte  | (-8388608, 8388607)                                | (0, 16777215)                                      | 大整数值       |
| INT或者INTGER | 4byte  | (-2147483648, 2147483647)                          | (0, 4294967295)                                    | 大整数值       |
| BIGINT        | 8byte  | (-9223372036854775808， 9223372036854775808)       | (0, 18446744073709551615)                          | 极大整 数值    |
| DOUBLE        | 8byte  | (-17976931348623157E+308， 17976931348623157E+308) | (0,22250738585072014E-308, 17976931348623157E+308) | 双精度浮点数值 |
| DECIMAL       |        | 依赖于M和D的值                                     | 依赖于M和D的值                                     | 小数值         |
|               |        |                                                    |                                                    |                |

###### 字符串类型

| 类型       | 大小               | 用途                          |
| ---------- | ------------------ | ----------------------------- |
| char       | 0-255bytes         | 定长定符串                    |
| varchar    | 0-65536 bytes      | 变长定符串                    |
| tinyblog   | 0-255bytes         | 不超过255个字符的二进制字符串 |
| tinytext   | 0-255bytes         | 短文本字符串                  |
| blog       | 0-65535 bytes      | 二进制形式的长文本数据        |
| text       | 0-65535 bytes      | 长文本数据                    |
| mediumblog | 0-16777215 bytes   | 二进制形式的中等长度文本数据  |
| mediumtext | 0-16777215 bytest  | 中等长度的文本数据            |
| longblog   | 0-4294967295 bytes | 二进制形式的极大文本数据      |
| longtext   | 0-4294967295 bytes | 极大文本数据                  |
|            |                    |                               |

######日期和时间类型

| 类型      | 大小bytes | 范围                                                         | 格式                | 用途                      |
| --------- | --------- | ------------------------------------------------------------ | ------------------- | ------------------------- |
| DATE      | 3 bytes   | 1000-01-01 9999-12-31                                        | YYYY-MM-DD          | 日期值                    |
| TIME      | 3 bytes   | -838:59:59 / 838:59:59                                       | HH:MM:SS            | 时间值 或者持续时间       |
| YEAR      | 1 bytes   | 1901/2155                                                    | yyyy                | 年份值                    |
| DATETIME  | 8 bytes   | 1000-01-01 00:00:00 / 9999-12-31 23:59:59                    | YYYY-MM-DD HH:MM:SS | 混合日期和时间值          |
| TIMESTAMP | 4 bytes   | 1970-01-01 00:00:00 /2038 结束时间是第2147483647秒，北京时间2038-1-19 11:14:07 ，格林尼治时间2038年1月19日凌晨03:14:07 | YYYYMMDD HH:MM:SS   | 混合日期和时间值 ，时间戳 |
|           |           |                                                              |                     |                           |

### 4、对表结构的常用操作

| 功能                       | SQL                     |
| -------------------------- | ----------------------- |
| 查看当前数据库的所有表名称 | show tables;            |
| 查看指定表的创建语句       | show create table 表名; |
| 查看表结构                 | desc 表名;              |
| 删除表                     | drop table 表名；       |

##### 修改表结构格式

###### 修改表添加列

语法格式：

```mysql
alter table 表名 add 列名 类型(长度) [约束]
```

示例：

```mysql
-- 为student表添加一个新字段为：系别 dept 类型为 varchar(20)
ALTER TABLE student ADD `dept` VARCHAR(20)
```



###### 修改列名和类型

语法格式

```mysql
alter table 表名 change 旧列名 新列名 类型(长度) [约束];
```

示例：

```mysql
-- 为student表的dept字段更换为department varchar(30)
ALTER TABLE student change `dept` department VARCHAR(30);
```



###### 修改表中字段顺序

```sql
alter table table_name modify 属性名 数据类型 first|after 属性名2;
-- 示例1, 将isdel字段移动到第一位
alter table table_name modify isdel tinyint(2) first; 

-- 示例2，将isdel字段移动到id列的后面
alter table table_name modify isdel tinyint(2) after id;
```



###### 修改表删除列

语法格式：

```mysql
alter table 表名 drop 列名;
```

示例：

```mysql
-- 删除student表名的department列
ALTER TABLE student DROP department;
```



###### 修改表名

语法格式：

```mysql
rename table 表名 to 新表名;
```

示例：

```mysql
-- 将表student 改名成stu
RENAME TABLE student to stu;
```

