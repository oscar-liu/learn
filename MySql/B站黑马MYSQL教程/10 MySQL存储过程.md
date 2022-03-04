# MySQL存储过程

## 概述

**什么是存储过程？**

存储过程就是一组SQL语句集，功能强大，可以实现一些较复杂的逻辑功能，是数据库SQL语言层面的代码封闭和重用。

**有什么特性？**

有输入输出参数，可以声明变量，有IF、ELSE，while等控制语句，通过编写存储过程，可以实现复杂的逻辑功能；函数的普通特性，模块化，封装，代码利用，速度快，只有首次执行需要经过编译和优化，后续被调用可以直接执行，省去编译。



## 格式

```sql
delimiter 自定义结束符号
create procedure 存储名( [in, out, inout] 参数名 数据类型...)
begin
	sql语句
end 自定义的结束符号
delimiter;
```

示例1：

```sql
-- 示例1
delimiter $$
create procedure proname1()
begin
	select dname, ename from employee;
end $$
delimiter;

-- 调用存储过程
call proname1()
```



### 变量

#### 直接变量：

```sql
-- 变量
delimiter $$
create procedure p2()
BEGIN
	declare var1 varchar(20) default 'aaa'; -- 创建变量
	set var1 = 'setname'; -- 给变量赋值
	select var1; -- 输出变量
end $$;

delimter ;
call p2();
```

#### 查询语句变量：

也可以使用select into语句为变量赋值，查询结果只能输出单行单列。

```sql
select col_name [...] into val_name[,...]
from table_name where condition
```

示例：

```sql
-- 查询语句变量
delimiter $$
create procedure p3()
BEGIN
	declare var2 varchar(20) default ''; -- 创建变量
	select ename into var2 from employee where eid = '1001'; -- 给变量赋值
	select var2; -- 输出变量
end $$;
delimiter ;

call p3();

```



#### 用户变量

用户自定义，当前会话有效。

语法：

@var_name，不需要提前声明，使用即声明

示例：

```sql

-- 用户变量
delimiter $$
create procedure p4()
BEGIN
	set @var_name1 = 'litchi';
end $$
call p4() $$
select @var_name1 $$;

```

#### 系统变量

系统变量分为全局变量与会话变量

全局变量在MYSQL启动的时间由服务器自动将它们初始化为默认值，这些默认值可以通过更改my.ini这个文件来更改。

会话变量在每次建立一个新的连接的时候 ，由MYSQL来初始化，MYSQL会将全当前所有全局变量的值复制来一份，来做为会话变量。

也就是说，如果在建立 会话后，没有手动更改过会话变量与全局变量的值，那所有的变量值是一样的。

**区别：**

全局变量与会话变量的区别就在于，对全局变量的修改会影响到整个服务器，但是对会话变量的修改，只会影响到当前的会话（也就是当前的数据库连接）



**全局变量**

语法格式：

```sql
@@global.var_name
```

操作示例：

```sql
-- 全局变量
show global variables;
-- 查看某全局变量
select @@global.auto_increment_increment;
-- 修改全局变量的值
set global sort_buffer_size = 40000; -- 262144
-- 查询全局变量
select @@global.sort_buffer_size;

```



**会话变量**

```sql

-- 会话变量
show session variables;
-- 查看某会话变量
select @@session.auto_increment_increment;
-- 修改会话变量
set session sort_buffer_size = 60000;
-- 查看修改
select @@session.sort_buffer_size;
```

​                                                         

### 存储过程传参

#### IN 关键词

in表示传入的参数，可以传入数值或者变量，即使传入变量，并不会更改变量的值，可以内部更新，仅仅作用在函数范围内。

示例：

```sql
-- 封装有参数 的存储过程，传入员工编号，查找员工信息
delimiter $$
create procedure dec1(in param_eid varchar(20))
begin
	select * from employee where eid = param_eid;
end $$;
delimiter ;

call dec1(1001);

-- 示例多参数
delimiter $$
create procedure dec2(in param_dname varchar(20), in param_salary int(10))
begin
	select * from employee where dname = param_dname and salary > param_salary;
end $$;
delimiter ;

call dec2('蜀国', 5000);
```



#### OUT 关键词

out 传出

示例：

```sql
-- 传入员工编号 ，返回员工名字
delimiter $$
create procedure dec3(in param_eid int(10), out out_ename varchar(20) )
begin
	select ename into out_ename from employee where eid = param_eid;
end $$;
delimiter ;

call dec3(1001, @ename);
select @ename;

-- 传入员工编号 ，返回员工名字和薪资
delimiter $$
create procedure dec4(in param_eid int(10), out out_ename varchar(20), out out_salary decimal(10,2) )
begin
	select 
		ename, salary into out_ename, out_salary
	from employee where eid = param_eid;
end $$;
delimiter ;

call dec4(1001, @ename, @salary);
select @ename;
select @salary;
```



INOUT

inout表示从外部传入的参数 经过修改后可以返回的变量，即可以传入变量的值也可以修改变量的值（即使函数执行完）

示例：

```sql
-- 传入一个数字，返回这个数字的10倍
delimiter $$
create procedure dec5(inout num int)
begin
	set num = num * 10;
end $$
delimiter ;
set @inout_num = 20;
call dec5(@inout_num);
select @inout_num;

-- 传入员工ID，返回部门号，薪资，年薪
delimiter $$
create procedure dec6(inout inout_ename varchar(20), inout inout_salay int(20) )
begin
	select concat_ws("，", eid, ename, salary ) into inout_ename from employee where ename = inout_ename;
	set inout_salay = inout_salay * 12;
end $$
delimiter ;

set @inout_ename = '刘备';
set @inout_salay= 3000;
call dec6(@inout_ename, @inout_salay);
select @inout_ename;
select @inout_salay;

```



### 流程控制判断

IF语句

IF语句包含多个条件判断，根据结果为TRUE， FALSE执行语句，

语法格式：

```sql
if search_condition then statement_list
	[elseif search_condition_2 then statement_list_2] ...
	[else statement_list_n]
end if
```

代码示例：

```sql
-- 控制流程示例1
delimiter $$
create procedure dec7(in score int)
BEGIN
	if score < 60
		then 
			select "不及格";
	elseif score >= 60 and score < 90
		then 
			select "良好";
	elseif score >= 90 and score <= 100
		then 
			select "优秀";
	ELSE
		select "成绩异常";
	end if;
end $$
delimiter ;

set @score = 60;
call dec7(90)
select @score;

```



CASE语句

```sql
-- 语法1
case case_value
	when when_value then statement_list
	[when when_value then statement_list] ...
	[else statement_list]
end case

-- 语法2
case 
	when search_condition then statement_list
	[when search_condition then statement_list] ...
	[else statement_list]
end case
```



### 循环语句

while, repeat, loop

#### while格式

```sql
[标签：] while 循环条件 do
	循环体：
end while [标签]
```

循环控制

leave类似break，跳出，结束当前所在的循环

iterate类似于continue，继续，结束本次循环继续下一次



#### repeat

```sql
[标签:] repeat
	循环本;
until 条件表达式
end repeat [标签];
```



### 游标cursor

游标(cursor)是用来存储查询结果集的数据类型，在存储过程和函数中可以使用光标对结果集进行循环处理，光标的使用包括光标的声明、OPEN、FETCH和CLOSE

格式：

```sql
-- 声明语法
declare cursor_name cursor for select_statement
-- 打开语法
open cursor_name
-- 取值语法
fetch cursor_name into var_name [, var_name] ...
-- 关闭语法
close cursor_name
```



### 异常处理

