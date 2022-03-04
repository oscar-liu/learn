# MySql基本操作-DML

### DML解释

DML是指数据操作语言，英文全称是(Data Manipulation Language)，用来对数据库中的表的数据记录进行增加、删除、修改。

关键字：

- insert 插入
- update 更新
- delete 删除



### 数据插入 insert

语法格式：

​		insert into 表(列1, 列2, 列3, ...) values (值1, 值2, 值3, ...); // 向表中插入值 ，类型必须匹配

​		insert into 表 values (值1, 值2, 值3, ...); //给所有列插入值 

示例：

​		insert into student (sid, name, gender, age, birth, address) values (1, 'oscar', 'man', 18, '2010-12-12', '深圳市龙岗区');



### 数据更新 update

语法格式：

​		update 表名 set 字段名 = 值 , 字段名=值

示例：

```
#没有加条件，那么整个表的所有地址都将变更为深圳
update student set address = '深圳'

#带有查询条件，只有指定条件才生效
update student set address = '深圳' where id = 1

#可以同时更新多个字段的值 ，以逗号隔开
update student set address = '深圳', name = 'litchi' where id = 1
```



### 数据删除 delete

语法格式

​		delete form 表名 [where 条件]

​		truncate table 表名 或者truncate 表名

示例：

```
-- 删除sid为1的数据
delete form student where sid = 1
-- 删除表所有数据
delete from student;
-- 清空数据
truncate table student;
truncate student;
```

delete 是删除表中的所有数据，而truncate是等同于删除表后再重建表数据结构，更为彻底。



### 总结

DML是数据操作语言，主要是针对MySql进行增删除改

三个基础操作：

insert

delete

update

