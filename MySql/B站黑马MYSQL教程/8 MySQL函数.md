# MySQL函数

## 概述

在MySQL中，为了提高代码重用性和隐藏实现细节，MySQL提供了很多函数，函数可以理解为别人封闭好的模板代码。

在MySQL中，函数非常多 ，主要分类有：

－ 聚合函数

－ 数学函数

－ 字符串函数

－ 日期函数

－ 控制流函数

－ 窗口函数



## 聚合函数 

count , sum, min, max, avg 这些都是聚合函数。

### group_concat

group_concat()  函数首先根据group by 指定的列进行分组，并且用分隔符分隔，并同一个分组中的值连接起来，返回一个字符串。

格式：

```sql
group_concat( [distinct] 字段名 [order by 排序字段 asc/desc] [separator '分隔符'] )
```

说明： 用distinct可以排除重复值，如果需要对结果中的值进行排序，可以使用order by子句，separator是一个字符串，默认为逗号。



示例：

```sql
use mydb1;
create table emp(
    emp_id int primary key auto_increment comment '编号',
    emp_name char(20) not null default '' comment '姓名',
    salary decimal(10,2) not null default 0 comment '工资',
    department char(20) not null default '' comment '部门'
 );
 
 insert into emp( emp_name, salary, department)
	values ('张飞', 5000, '蜀国'),
	 ('赵云', 8000, '蜀国'),
	 ('关云长', 10000, '蜀国'),
	 ('刘备', 25000, '蜀国'),
	 ('孙权', 25000, '吴国'),
	 ('孙尚香', 15000, '吴国'),
	 ('刘禅', 5000, '蜀国'),
	 ('司马', 15000, '魏国'),
	 ('曹操', 25000, '魏国'),
	 ('曹丕', 25000, '魏国'),
	 ('吕布', 35000, '群雄');

-- 将所有名字合并成一行
select group_concat(emp_name) from emp;
-- 张飞,赵云,关云长,刘备,孙权,孙尚香,刘禅,司马,曹操,曹丕,吕布
select group_concat(emp_name SEPARATOR '、') from emp;

-- 指定排序方式和分隔符
select department, group_concat(emp_name ) from emp group by department;
select department, group_concat(emp_name order by salary desc) from emp group by department;
```



## 数学函数

| 函数名                             | 描述                                                         | 示例                                                         |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ABS(x)                             | 返回x的绝对值                                                | SELECT ABS(-1) -- 返回1                                      |
| ACOS(x)                            | 求 x 的反余弦值（单位为弧度），x 为一个数值                  | `SELECT ACOS(0.25);`                                         |
| ASIN(x)                            | 求反正弦值（单位为弧度），x 为一个数值                       | `SELECT ASIN(0.25);`                                         |
| ATAN(x)                            | 求反正切值（单位为弧度），x 为一个数值                       | `SELECT ATAN(2.5);`                                          |
| ATAN2(n, m)                        | 求反正切值（单位为弧度）                                     | `SELECT ATAN2(-0.8, 2);`                                     |
| AVG(expression)                    | 返回一个表达式的平均值，expression 是一个字段                | 返回 Products 表中Price 字段的平均值：`SELECT AVG(Price) AS AveragePrice FROM Products;` |
| CEIL(x)                            | 返回大于或等于 x 的最小整数                                  | `SELECT CEIL(1.5) -- 返回2`                                  |
| CEILING(x)                         | 返回大于或等于 x 的最小整数                                  | `SELECT CEILING(1.5); -- 返回2`                              |
| COS(x)                             | 求余弦值(参数是弧度)                                         | `SELECT COS(2);`                                             |
| COT(x)                             | 求余切值(参数是弧度)                                         | `SELECT COT(6);`                                             |
| COUNT(expression)                  | 返回查询的记录总数，expression 参数是一个字段或者 * 号       | 返回 Products 表中 products 字段总共有多少条记录：`SELECT COUNT(ProductID) AS NumberOfProducts FROM Products;` |
| DEGREES(x)                         | 将弧度转换为角度                                             | `SELECT DEGREES(3.1415926535898) -- 180`                     |
| n DIV m                            | 整除，n 为被除数，m 为除数                                   | 计算 10 除于 5：`SELECT 10 DIV 5;  -- 2`                     |
| EXP(x)                             | 返回 e 的 x 次方                                             | 计算 e 的三次方：`SELECT EXP(3) -- 20.085536923188`          |
| FLOOR(x)                           | 返回小于或等于 x 的最大整数                                  | 小于或等于 1.5 的整数：`SELECT FLOOR(1.5) -- 返回1`          |
| GREATEST(expr1, expr2, expr3, ...) | 返回列表中的最大值                                           | 返回以下数字列表中的最大值：`SELECT GREATEST(3, 12, 34, 8, 25); -- 34`返回以下字符串列表中的最大值：`SELECT GREATEST("Google", "Runoob", "Apple");   -- Runoob` |
| LEAST(expr1, expr2, expr3, ...)    | 返回列表中的最小值                                           | 返回以下数字列表中的最小值：`SELECT LEAST(3, 12, 34, 8, 25); -- 3`返回以下字符串列表中的最小值：`SELECT LEAST("Google", "Runoob", "Apple");   -- Apple` |
| LN                                 | 返回数字的自然对数，以 e 为底。                              | 返回 2 的自然对数：`SELECT LN(2);  -- 0.6931471805599453`    |
| LOG(x) 或 LOG(base, x)             | 返回自然对数(以 e 为底的对数)，如果带有 base 参数，则 base 为指定带底数。 | `SELECT LOG(20.085536923188) -- 3 SELECT LOG(2, 4); -- 2`    |
| LOG10(x)                           | 返回以 10 为底的对数                                         | `SELECT LOG10(100) -- 2`                                     |
| LOG2(x)                            | 返回以 2 为底的对数                                          | 返回以 2 为底 6 的对数：`SELECT LOG2(6);  -- 2.584962500721156` |
| MAX(expression)                    | 返回字段 expression 中的最大值                               | 返回数据表 Products 中字段 Price 的最大值：`SELECT MAX(Price) AS LargestPrice FROM Products;` |
| MIN(expression)                    | 返回字段 expression 中的最小值                               | 返回数据表 Products 中字段 Price 的最小值：`SELECT MIN(Price) AS MinPrice FROM Products;` |
| MOD(x,y)                           | 返回 x 除以 y 以后的余数                                     | 5 除于 2 的余数：`SELECT MOD(5,2) -- 1`                      |
| PI()                               | 返回圆周率(3.141593）                                        | `SELECT PI() --3.141593`                                     |
| POW(x,y)                           | 返回 x 的 y 次方                                             | 2 的 3 次方：`SELECT POW(2,3) -- 8`                          |
| POWER(x,y)                         | 返回 x 的 y 次方                                             | 2 的 3 次方：`SELECT POWER(2,3) -- 8`                        |
| RADIANS(x)                         | 将角度转换为弧度                                             | 180 度转换为弧度：`SELECT RADIANS(180) -- 3.1415926535898`   |
| RAND()                             | 返回 0 到 1 的随机数                                         | `SELECT RAND() --0.93099315644334`                           |
| ROUND(x)                           | 返回离 x 最近的整数                                          | `SELECT ROUND(1.23456) --1`                                  |
| SIGN(x)                            | 返回 x 的符号，x 是负数、0、正数分别返回 -1、0 和 1          | `SELECT SIGN(-10) -- (-1)`                                   |
| SIN(x)                             | 求正弦值(参数是弧度)                                         | `SELECT SIN(RADIANS(30)) -- 0.5`                             |
| SQRT(x)                            | 返回x的平方根                                                | 25 的平方根：`SELECT SQRT(25) -- 5`                          |
| SUM(expression)                    | 返回指定字段的总和                                           | 计算 OrderDetails 表中字段 Quantity 的总和：`SELECT SUM(Quantity) AS TotalItemsOrdered FROM OrderDetails;` |
| TAN(x)                             | 求正切值(参数是弧度)                                         | `SELECT TAN(1.75);  -- -5.52037992250933`                    |
| TRUNCATE(x,y)                      | 返回数值 x 保留到小数点后 y 位的值（与 ROUND 最大的区别是不会进行四舍五入） | `SELECT TRUNCATE(1.23456,3) -- 1.234`                        |



## 字符串函数

| 函数                                  | 描述                                                         | 实例                                                         |
| ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ASCII(s)                              | 返回字符串 s 的第一个字符的 ASCII 码。                       | 返回 CustomerName 字段第一个字母的 ASCII 码：`SELECT ASCII(CustomerName) AS NumCodeOfFirstChar FROM Customers;` |
| CHAR_LENGTH(s)                        | 返回字符串 s 的字符数                                        | 返回字符串 RUNOOB 的字符数`SELECT CHAR_LENGTH("RUNOOB") AS LengthOfString;` |
| CHARACTER_LENGTH(s)                   | 返回字符串 s 的字符数                                        | 返回字符串 RUNOOB 的字符数`SELECT CHARACTER_LENGTH("RUNOOB") AS LengthOfString;` |
| CONCAT(s1,s2...sn)                    | 字符串 s1,s2 等多个字符串合并为一个字符串                    | 合并多个字符串`SELECT CONCAT("SQL ", "Runoob ", "Gooogle ", "Facebook") AS ConcatenatedString;` |
| CONCAT_WS(x, s1,s2...sn)              | 同 CONCAT(s1,s2,...) 函数，但是每个字符串之间要加上 x，x 可以是分隔符 | 合并多个字符串，并添加分隔符：`SELECT CONCAT_WS("-", "SQL", "Tutorial", "is", "fun!")AS ConcatenatedString;` |
| FIELD(s,s1,s2...)                     | 返回第一个字符串 s 在字符串列表(s1,s2...)中的位置            | 返回字符串 c 在列表值中的位置：`SELECT FIELD("c", "a", "b", "c", "d", "e");` |
| FIND_IN_SET(s1,s2)                    | 返回在字符串s2中与s1匹配的字符串的位置                       | 返回字符串 c 在指定字符串中的位置：`SELECT FIND_IN_SET("c", "a,b,c,d,e");` |
| FORMAT(x,n)                           | 函数可以将数字 x 进行格式化 "#,###.##", 将 x 保留到小数点后 n 位，最后一位四舍五入。 | 格式化数字 "#,###.##" 形式：`SELECT FORMAT(250500.5634, 2);     -- 输出 250,500.56` |
| INSERT(s1,x,len,s2)                   | 字符串 s2 替换 s1 的 x 位置开始长度为 len 的字符串           | 从字符串第一个位置开始的 6 个字符替换为 runoob：`SELECT INSERT("google.com", 1, 6, "runoob");  -- 输出：runoob.com` |
| LOCATE(s1,s)                          | 从字符串 s 中获取 s1 的开始位置                              | 获取 b 在字符串 abc 中的位置：`SELECT LOCATE('st','myteststring');  -- 5`返回字符串 abc 中 b 的位置：`SELECT LOCATE('b', 'abc') -- 2` |
| LCASE(s)                              | 将字符串 s 的所有字母变成小写字母                            | 字符串 RUNOOB 转换为小写：`SELECT LCASE('RUNOOB') -- runoob` |
| LEFT(s,n)                             | 返回字符串 s 的前 n 个字符                                   | 返回字符串 runoob 中的前两个字符：`SELECT LEFT('runoob',2) -- ru` |
| LOWER(s)                              | 将字符串 s 的所有字母变成小写字母                            | 字符串 RUNOOB 转换为小写：`SELECT LOWER('RUNOOB') -- runoob` |
| LPAD(s1,len,s2)                       | 在字符串 s1 的开始处填充字符串 s2，使字符串长度达到 len      | 将字符串 xx 填充到 abc 字符串的开始处：`SELECT LPAD('abc',5,'xx') -- xxabc` |
| LTRIM(s)                              | 去掉字符串 s 开始处的空格                                    | 去掉字符串 RUNOOB开始处的空格：`SELECT LTRIM("    RUNOOB") AS LeftTrimmedString;-- RUNOOB` |
| MID(s,n,len)                          | 从字符串 s 的 n 位置截取长度为 len 的子字符串，同 SUBSTRING(s,n,len) | 从字符串 RUNOOB 中的第 2 个位置截取 3个 字符：`SELECT MID("RUNOOB", 2, 3) AS ExtractString; -- UNO` |
| POSITION(s1 IN s)                     | 从字符串 s 中获取 s1 的开始位置                              | 返回字符串 abc 中 b 的位置：`SELECT POSITION('b' in 'abc') -- 2` |
| REPEAT(s,n)                           | 将字符串 s 重复 n 次                                         | 将字符串 runoob 重复三次：`SELECT REPEAT('runoob',3) -- runoobrunoobrunoob` |
| REPLACE(s,s1,s2)                      | 将字符串 s2 替代字符串 s 中的字符串 s1                       | 将字符串 abc 中的字符 a 替换为字符 x：`SELECT REPLACE('abc','a','x') --xbc` |
| REVERSE(s)                            | 将字符串s的顺序反过来                                        | 将字符串 abc 的顺序反过来：`SELECT REVERSE('abc') -- cba`    |
| RIGHT(s,n)                            | 返回字符串 s 的后 n 个字符                                   | 返回字符串 runoob 的后两个字符：`SELECT RIGHT('runoob',2) -- ob` |
| RPAD(s1,len,s2)                       | 在字符串 s1 的结尾处添加字符串 s2，使字符串的长度达到 len    | 将字符串 xx 填充到 abc 字符串的结尾处：`SELECT RPAD('abc',5,'xx') -- abcxx` |
| RTRIM(s)                              | 去掉字符串 s 结尾处的空格                                    | 去掉字符串 RUNOOB 的末尾空格：`SELECT RTRIM("RUNOOB     ") AS RightTrimmedString;   -- RUNOOB` |
| SPACE(n)                              | 返回 n 个空格                                                | 返回 10 个空格：`SELECT SPACE(10);`                          |
| STRCMP(s1,s2)                         | 比较字符串 s1 和 s2，如果 s1 与 s2 相等返回 0 ，如果 s1>s2 返回 1，如果 s1<s2 返回 -1 | 比较字符串：`SELECT STRCMP("runoob", "runoob");  -- 0`       |
| SUBSTR(s, start, length)              | 从字符串 s 的 start 位置截取长度为 length 的子字符串         | 从字符串 RUNOOB 中的第 2 个位置截取 3个 字符：`SELECT SUBSTR("RUNOOB", 2, 3) AS ExtractString; -- UNO` |
| SUBSTRING(s, start, length)           | 从字符串 s 的 start 位置截取长度为 length 的子字符串         | 从字符串 RUNOOB 中的第 2 个位置截取 3个 字符：`SELECT SUBSTRING("RUNOOB", 2, 3) AS ExtractString; -- UNO` |
| SUBSTRING_INDEX(s, delimiter, number) | 返回从字符串 s 的第 number 个出现的分隔符 delimiter 之后的子串。 如果 number 是正数，返回第 number 个字符左边的字符串。 如果 number 是负数，返回第(number 的绝对值(从右边数))个字符右边的字符串。 | `SELECT SUBSTRING_INDEX('a*b','*',1) -- a SELECT SUBSTRING_INDEX('a*b','*',-1)  -- b SELECT SUBSTRING_INDEX(SUBSTRING_INDEX('a*b*c*d*e','*',3),'*',-1)  -- c` |
| TRIM(s)                               | 去掉字符串 s 开始和结尾处的空格                              | 去掉字符串 RUNOOB 的首尾空格：`SELECT TRIM('    RUNOOB    ') AS TrimmedString;` |
| UCASE(s)                              | 将字符串转换为大写                                           | 将字符串 runoob 转换为大写：`SELECT UCASE("runoob"); -- RUNOOB` |
| UPPER(s)                              | 将字符串转换为大写                                           | 将字符串 runoob 转换为大写：`SELECT UPPER("runoob"); -- RUNOOB` |



## 日期函数

| 函数                                              | 描述                                                         | 实例                                                         |
| ------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ADDDATE(d,n)                                      | 计算起始日期 d 加上 n 天的日期                               | `SELECT ADDDATE("2017-06-15", INTERVAL 10 DAY); ->2017-06-25` |
| ADDTIME(t,n)                                      | n 是一个时间表达式，时间 t 加上时间表达式 n                  | 加 5 秒：`SELECT ADDTIME('2011-11-11 11:11:11', 5); ->2011-11-11 11:11:16 (秒)`添加 2 小时, 10 分钟, 5 秒:`SELECT ADDTIME("2020-06-15 09:34:21", "2:10:5");  -> 2020-06-15 11:44:26` |
| CURDATE()                                         | 返回当前日期                                                 | `SELECT CURDATE(); -> 2018-09-19`                            |
| CURRENT_DATE()                                    | 返回当前日期                                                 | `SELECT CURRENT_DATE(); -> 2018-09-19`                       |
| CURRENT_TIME                                      | 返回当前时间                                                 | `SELECT CURRENT_TIME(); -> 19:59:02`                         |
| CURRENT_TIMESTAMP()                               | 返回当前日期和时间                                           | `SELECT CURRENT_TIMESTAMP() -> 2018-09-19 20:57:43`          |
| CURTIME()                                         | 返回当前时间                                                 | `SELECT CURTIME(); -> 19:59:02`                              |
| DATE()                                            | 从日期或日期时间表达式中提取日期值                           | `SELECT DATE("2017-06-15");     -> 2017-06-15`               |
| DATEDIFF(d1,d2)                                   | 计算日期 d1->d2 之间相隔的天数                               | `SELECT DATEDIFF('2001-01-01','2001-02-02') -> -32`          |
| DATE_ADD(d，INTERVAL expr type)                   | 计算起始日期 d 加上一个时间段后的日期                        | `SELECT DATE_ADD("2017-06-15", INTERVAL 10 DAY);     -> 2017-06-25 SELECT DATE_ADD("2017-06-15 09:34:21", INTERVAL 15 MINUTE); -> 2017-06-15 09:49:21 SELECT DATE_ADD("2017-06-15 09:34:21", INTERVAL -3 HOUR); ->2017-06-15 06:34:21 SELECT DATE_ADD("2017-06-15 09:34:21", INTERVAL -3 MONTH); ->2017-04-15` |
| DATE_FORMAT(d,f)                                  | 按表达式 f的要求显示日期 d                                   | `SELECT DATE_FORMAT('2011-11-11 11:11:11','%Y-%m-%d %r') -> 2011-11-11 11:11:11 AM` |
| DATE_SUB(date,INTERVAL expr type)                 | 函数从日期减去指定的时间间隔。                               | Orders 表中 OrderDate 字段减去 2 天：`SELECT OrderId,DATE_SUB(OrderDate,INTERVAL 2 DAY) AS OrderPayDate FROM Orders` |
| DAY(d)                                            | 返回日期值 d 的日期部分                                      | `SELECT DAY("2017-06-15");   -> 15`                          |
| DAYNAME(d)                                        | 返回日期 d 是星期几，如 Monday,Tuesday                       | `SELECT DAYNAME('2011-11-11 11:11:11') ->Friday`             |
| DAYOFMONTH(d)                                     | 计算日期 d 是本月的第几天                                    | `SELECT DAYOFMONTH('2011-11-11 11:11:11') ->11`              |
| DAYOFWEEK(d)                                      | 日期 d 今天是星期几，1 星期日，2 星期一，以此类推            | `SELECT DAYOFWEEK('2011-11-11 11:11:11') ->6`                |
| DAYOFYEAR(d)                                      | 计算日期 d 是本年的第几天                                    | `SELECT DAYOFYEAR('2011-11-11 11:11:11') ->315`              |
| EXTRACT(type FROM d)                              | 从日期 d 中获取指定的值，type 指定返回的值。 t               | `SELECT EXTRACT(MINUTE FROM '2011-11-11 11:11:11')  -> 11`   |
| FROM_DAYS(n)                                      | 计算从 0000 年 1 月 1 日开始 n 天后的日期                    | `SELECT FROM_DAYS(1111) -> 0003-01-16`                       |
| HOUR(t)                                           | 返回 t 中的小时值                                            | `SELECT HOUR('1:2:3') -> 1`                                  |
| LAST_DAY(d)                                       | 返回给给定日期的那一月份的最后一天                           | `SELECT LAST_DAY("2017-06-20"); -> 2017-06-30`               |
| LOCALTIME()                                       | 返回当前日期和时间                                           | `SELECT LOCALTIME() -> 2018-09-19 20:57:43`                  |
| LOCALTIMESTAMP()                                  | 返回当前日期和时间                                           | `SELECT LOCALTIMESTAMP() -> 2018-09-19 20:57:43`             |
| MAKEDATE(year, day-of-year)                       | 基于给定参数年份 year 和所在年中的天数序号 day-of-year 返回一个日期 | `SELECT MAKEDATE(2017, 3); -> 2017-01-03`                    |
| MAKETIME(hour, minute, second)                    | 组合时间，参数分别为小时、分钟、秒                           | `SELECT MAKETIME(11, 35, 4); -> 11:35:04`                    |
| MICROSECOND(date)                                 | 返回日期参数所对应的微秒数                                   | `SELECT MICROSECOND("2017-06-20 09:34:00.000023"); -> 23`    |
| MINUTE(t)                                         | 返回 t 中的分钟值                                            | `SELECT MINUTE('1:2:3') -> 2`                                |
| MONTHNAME(d)                                      | 返回日期当中的月份名称，如 November                          | `SELECT MONTHNAME('2011-11-11 11:11:11') -> November`        |
| MONTH(d)                                          | 返回日期d中的月份值，1 到 12                                 | `SELECT MONTH('2011-11-11 11:11:11') ->11`                   |
| NOW()                                             | 返回当前日期和时间                                           | `SELECT NOW() -> 2018-09-19 20:57:43`                        |
| PERIOD_ADD(period, number)                        | 为 年-月 组合日期添加一个时段                                | `SELECT PERIOD_ADD(201703, 5);    -> 201708`                 |
| PERIOD_DIFF(period1, period2)                     | 返回两个时段之间的月份差值                                   | `SELECT PERIOD_DIFF(201710, 201703); -> 7`                   |
| QUARTER(d)                                        | 返回日期d是第几季节，返回 1 到 4                             | `SELECT QUARTER('2011-11-11 11:11:11') -> 4`                 |
| SECOND(t)                                         | 返回 t 中的秒钟值                                            | `SELECT SECOND('1:2:3') -> 3`                                |
| SEC_TO_TIME(s)                                    | 将以秒为单位的时间 s 转换为时分秒的格式                      | `SELECT SEC_TO_TIME(4320) -> 01:12:00`                       |
| STR_TO_DATE(string, format_mask)                  | 将字符串转变为日期                                           | `SELECT STR_TO_DATE("August 10 2017", "%M %d %Y"); -> 2017-08-10` |
| SUBDATE(d,n)                                      | 日期 d 减去 n 天后的日期                                     | `SELECT SUBDATE('2011-11-11 11:11:11', 1) ->2011-11-10 11:11:11 (默认是天)` |
| SUBTIME(t,n)                                      | 时间 t 减去 n 秒的时间                                       | `SELECT SUBTIME('2011-11-11 11:11:11', 5) ->2011-11-11 11:11:06 (秒)` |
| SYSDATE()                                         | 返回当前日期和时间                                           | `SELECT SYSDATE() -> 2018-09-19 20:57:43`                    |
| TIME(expression)                                  | 提取传入表达式的时间部分                                     | `SELECT TIME("19:30:10"); -> 19:30:10`                       |
| TIME_FORMAT(t,f)                                  | 按表达式 f 的要求显示时间 t                                  | `SELECT TIME_FORMAT('11:11:11','%r') 11:11:11 AM`            |
| TIME_TO_SEC(t)                                    | 将时间 t 转换为秒                                            | `SELECT TIME_TO_SEC('1:12:00') -> 4320`                      |
| TIMEDIFF(time1, time2)                            | 计算时间差值                                                 | `mysql> SELECT TIMEDIFF("13:10:11", "13:10:10"); -> 00:00:01 mysql> SELECT TIMEDIFF('2000:01:01 00:00:00',    ->                 '2000:01:01 00:00:00.000001');        -> '-00:00:00.000001' mysql> SELECT TIMEDIFF('2008-12-31 23:59:59.000001',    ->                 '2008-12-30 01:01:01.000002');        -> '46:58:57.999999'` |
| TIMESTAMP(expression, interval)                   | 单个参数时，函数返回日期或日期时间表达式；有2个参数时，将参数加和 | `mysql> SELECT TIMESTAMP("2017-07-23",  "13:10:11"); -> 2017-07-23 13:10:11 mysql> SELECT TIMESTAMP('2003-12-31');        -> '2003-12-31 00:00:00' mysql> SELECT TIMESTAMP('2003-12-31 12:00:00','12:00:00');        -> '2004-01-01 00:00:00'` |
| TIMESTAMPDIFF(unit,datetime_expr1,datetime_expr2) | 计算时间差，返回 datetime_expr2 − datetime_expr1 的时间差    | `mysql> SELECT TIMESTAMPDIFF(DAY,'2003-02-01','2003-05-01');   // 计算两个时间相隔多少天        -> 89 mysql> SELECT TIMESTAMPDIFF(MONTH,'2003-02-01','2003-05-01');   // 计算两个时间相隔多少月        -> 3 mysql> SELECT TIMESTAMPDIFF(YEAR,'2002-05-01','2001-01-01');    // 计算两个时间相隔多少年        -> -1 mysql> SELECT TIMESTAMPDIFF(MINUTE,'2003-02-01','2003-05-01 12:05:55');  // 计算两个时间相隔多少分钟        -> 128885` |
| TO_DAYS(d)                                        | 计算日期 d 距离 0000 年 1 月 1 日的天数                      | `SELECT TO_DAYS('0001-01-01 01:01:01') -> 366`               |
| WEEK(d)                                           | 计算日期 d 是本年的第几个星期，范围是 0 到 53                | `SELECT WEEK('2011-11-11 11:11:11') -> 45`                   |
| WEEKDAY(d)                                        | 日期 d 是星期几，0 表示星期一，1 表示星期二                  | `SELECT WEEKDAY("2017-06-15"); -> 3`                         |
| WEEKOFYEAR(d)                                     | 计算日期 d 是本年的第几个星期，范围是 0 到 53                | `SELECT WEEKOFYEAR('2011-11-11 11:11:11') -> 45`             |

演示实例：

```sql
-- 日期函数

-- 获取时间戳
select UNIX_TIMESTAMP()

-- 将一个字符串转为毫秒值 
select UNIX_TIMESTAMP('2022-01-19 18:21:00')

-- 将时间毫秒转为指定格式的日期
select from_unixtime('1642587660', '%Y-%m-%d %H-%i-%s')\

-- 获取当前的年月日
select curdate()
select current_date()

-- 获取当前时分秒
select current_time()

-- 获取年月日时分秒
select current_timestamp()

-- 从日期字符串获取年月日
select date('2021-12-11 12:12:12')

--计算时间间隔
select datediff('2021-01-11', '2022-12-12');

--计算时间差值
select timediff('2021-12-11 12:12:12', '2021-2-11 12:12:12');
select timediff('12:12:12', '11:12:12');


-- 将字符串转为日期
select STR_TO_DATE('2021-12-11 12:12:12','%Y-%m-%D %H:%i:%s');

-- 将日期进行减法，日期向前跳转
select date_sub('2021-3-01', interval 2 day);
select date_sub('2021-3-2', interval 2 month);

-- 将日期进行加法，日期向右跳
select date_add('2021-02-1' ,interval 2 month);
select date_add('2021-02-1', interval 2 day);

-- 从日期中获取时间 [ hour, month, day, hour]
select extract(hour from '2021-01-22 12:01:00');
select extract(year from '2021-01-22 12:01:00');
select extract(month from '2021-01-22 12:01:00');

-- 获取给定日期的最后一天
select last_day('2021-12-01'); -- 2021-12-31


-- 获取指定年份和天数的日期
select makedate('2022', 53); -- 2022年的第53天

-- 根据日期获取年月日时分秒
select year('2021-01-22 12:01:00')
select month('2021-01-22 12:01:00')
select day('2021-01-22 12:01:00')
select minute('2021-01-22 12:01:00')
select QUARTER('2021-01-22 12:01:00') -- 季度

-- 根据日期获取信息
select DAYOFMONTH('2022-01-18 18:13:00') -- 当月的第几天
select DAYOFWEEK('2022-01-18 18:13:00')  -- 星期几
select DAYOFYEAR('2022-01-18 18:13:00')  -- 获取一年的第几天

-- 星期
select WEEK('2022-01-18') -- 本年的第几个星期
select WEEKDAY('2022-01-18') -- 获取日期是星期几，0为星期1，1为星期2
select WEEKOFYEAR('2022-01-18') -- 计算日期是本年的第几个星期，0-53
select YEARWEEK('2022-01-18') -- 返回年份及第几周 202203,2022年的第3周
select NOW() -- 返回当前日期和时间
```



## MySQL高级函数

| 函数                                                         | 描述                                                         | 实例                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| BIN(x)                                                       | 返回 x 的二进制编码                                          | 15 的 2 进制编码:`SELECT BIN(15); -- 1111`                   |
| BINARY(s)                                                    | 将字符串 s 转换为二进制字符串                                | `SELECT BINARY "RUNOOB"; -> RUNOOB`                          |
| `CASE expression    WHEN condition1 THEN result1    WHEN condition2 THEN result2   ...    WHEN conditionN THEN resultN    ELSE result END` | CASE 表示函数开始，END 表示函数结束。如果 condition1 成立，则返回 result1, 如果 condition2 成立，则返回 result2，当全部不成立则返回 result，而当有一个成立之后，后面的就不执行了。 | `SELECT CASE  　WHEN 1 > 0 　THEN '1 > 0' 　WHEN 2 > 0 　THEN '2 > 0' 　ELSE '3 > 0' 　END ->1 > 0` |
| CAST(x AS type)                                              | 转换数据类型                                                 | 字符串日期转换为日期：`SELECT CAST("2017-08-29" AS DATE); -> 2017-08-29` |
| COALESCE(expr1, expr2, ...., expr_n)                         | 返回参数中的第一个非空表达式（从左向右）                     | `SELECT COALESCE(NULL, NULL, NULL, 'runoob.com', NULL, 'google.com'); -> runoob.com` |
| CONNECTION_ID()                                              | 返回唯一的连接 ID                                            | `SELECT CONNECTION_ID(); -> 4292835`                         |
| CONV(x,f1,f2)                                                | 返回 f1 进制数变成 f2 进制数                                 | `SELECT CONV(15, 10, 2); -> 1111`                            |
| CONVERT(s USING cs)                                          | 函数将字符串 s 的字符集变成 cs                               | `SELECT CHARSET('ABC') ->utf-8     SELECT CHARSET(CONVERT('ABC' USING gbk)) ->gbk` |
| CURRENT_USER()                                               | 返回当前用户                                                 | `SELECT CURRENT_USER(); -> guest@%`                          |
| DATABASE()                                                   | 返回当前数据库名                                             | `SELECT DATABASE();    -> runoob`                            |
| LAST_INSERT_ID()                                             | 返回最近生成的 AUTO_INCREMENT 值                             | `SELECT LAST_INSERT_ID(); ->6`                               |
| NULLIF(expr1, expr2)                                         | 比较两个字符串，如果字符串 expr1 与 expr2 相等 返回 NULL，否则返回 expr1 | `SELECT NULLIF(25, 25); ->`                                  |
| SESSION_USER()                                               | 返回当前用户                                                 | `SELECT SESSION_USER(); -> guest@%`                          |
| SYSTEM_USER()                                                | 返回当前用户                                                 | `SELECT SYSTEM_USER(); -> guest@%`                           |
| USER()                                                       | 返回当前用户                                                 | `SELECT USER(); -> guest@%`                                  |
| VERSION()                                                    | 返回数据库的版本号                                           | `SELECT VERSION() -> 5.6.34`                                 |



## 控制流函数

#### IF 控制

| 函数                                                         | 描述                                                   | 示例                                            |
| ------------------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------- |
| IF(expr,v1,v2)                                               | 如果表达式 expr 成立，返回结果 v1；否则，返回结果 v2。 | `SELECT IF(1 > 0,'正确','错误')     ->正确`     |
| [IFNULL(v1,v2)](https://www.runoob.com/mysql/mysql-func-ifnull.html) | 如果 v1 的值不为 NULL，则返回 v1，否则返回 v2。        | `SELECT IFNULL(null,'Hello Word') ->Hello Word` |
| ISNULL(expression)                                           | 判断表达式是否为 NULL                                  | `SELECT ISNULL(NULL); ->1`                      |

示例代码：

```sql
-- IF语句判断
select *, if(salary >=25000, '国主', '高级将军') from emp;

```



#### case when end 函数

格式：

```sql
CASE case_value
	WHEN when_value THEN
		statement_list
	ELSE
		statement_list
END;
```

操作示例：

```sql
-- 创建订单表
create table orders(
	oid int primary key, 
	price double, 
	payType int -- 1微信支付 2支付宝 3其他
);

use mydb1;
insert into orders values(1, 1200, 1);
insert into orders values(2, 1100, 2);
insert into orders values(3, 800, 3);
insert into orders values(4, 5200, 1);
insert into orders values(5, 100, 2);

-- 输出支付方式
select 
	*, 
	CASE payType
		WHEN 1 THEN '微信支付'
		WHEN 2 THEN '支付宝'
		ELSE '其它支付'
	END as payIntf
from orders;
```



## 窗口函数

#### 序号函数

ROW_NUMBER(), RANK(), DENSE_RANK()可以实现分组排序，并添加序号。

格式：

```sql
row_number() | rank() | dense_rank() over(
	partition by ...
	order by ...
)
```

操作示例：

```sql


create table employee(
	dname varchar(20), -- 部门名称
	eid varchar(20),
	ename varchar(20),
	hiredate date, -- 入职时间
	salary double -- 薪资
);

insert into employee values('蜀国', '1001', '刘备', '2021-11-01', 15000);
insert into employee values('蜀国', '1002', '关羽', '2021-11-02', 5000);
insert into employee values('蜀国', '1003', '张飞', '2021-11-03', 5000);
insert into employee values('蜀国', '1004', '赵云', '2021-11-04', 7000);
insert into employee values('蜀国', '1005', '马超', '2021-11-05', 4000);
insert into employee values('蜀国', '1006', '黄忠', '2021-11-06', 4000);

insert into employee values('魏国', '1007', '曹操', '2021-11-01', 15000);
insert into employee values('魏国', '1008', '许禇', '2021-11-01', 3000);
insert into employee values('魏国', '1009', '典韦', '2021-11-01', 3000);
insert into employee values('魏国', '1010', '张辽', '2021-11-01', 5000);
insert into employee values('魏国', '1011', '夏候', '2021-11-01', 5000);
insert into employee values('魏国', '1012', '司马', '2021-11-01', 8000);

 -- 对每个部门的员工按照薪资排序，并输出排名
 select 
	dname, ename, salary,
	row_number() over(partition by dname order by salary desc) as rn 
from employee;


-- 三个排序函数
 select 
	dname, ename, salary,
	row_number() over(partition by dname order by salary desc) as rn,
	rank() over(partition by dname order by salary desc) as rn2,
	dense_rank() over(partition by dname order by salary desc) as rn3
from employee;

```



#### 开窗聚合函数

开窗聚合函数：SUM(), avg(),   max(), min(), count()

操作示例：

```sql
select 
	dname, ename, salary,    
	sum(salary) over (partition by dname order by hiredate) as pv1,
	count(salary) over (partition by dname order by hiredate) as pv2
from employee;

-- 从第三行开始向下统计
-- hiredate rows between 3 preceding and current row 
select 
	dname, ename, salary,    
	sum(salary) over (partition by dname order by hiredate rows between 3 preceding and current row ) as pv1
from employee;
```



### 分布函数

分布函数：CUME_DIST() 和 PERCENT_RANK()

CUME_DIST()

用途：分组内小于、等于当前rank值的行数/分组内总行数

示例：

```sql
select 
	dname, ename, salary,
	cume_dist() over( order by salary) as rn1,
	cume_dist() over(partition by dname order by salary) as rn2
from employee;

```



PERCENT_RANK()

用途：每行按照公式(rank-1) / row(rows-1) 进行计算，其中，rank为RNAK()函数产生的序号，rows为当前窗口的记录总行数。

```sql
select 
	dname, ename, salary,
	rank() over( partition by dname order by salary) as rn1,
	percent_rank() over(partition by dname order by salary) as rn2
from employee;
/*
	第一行： (1-1) / （6-1） = 0
	row2: (1-1) / (6-1) = 0
	row3: (3-1) / (6-1) = 0.4
*/
```



### 前后函数LAG和LEAD

返回位于当前行的前n行(lag(expr, n )) 或者后n行 （LEAD(EXPR, N) ）的expr值

```sql
-- 前后函数LAG和LEAD
select 
	dname, ename, salary, hiredate,
	lag(hiredate, 1, '2000-01-01') over( partition by dname order by hiredate ) as time1,
	lag(hiredate, 2) over(partition by dname order by hiredate) as time2
from employee;
```



### 头尾函数 FIRST_VALUE() 和 lAST_VALUE

介绍：

用途： 返回第一个（first_value(expr） 或者最后一个( last_value(expr) ) expr的值

应用场景 ：截止到当前，按按日期排序查询第1个入职和最后一个入职员工的薪资

操作示例：

```sql
-- 头尾函数 FIRST_VALUE() 和 lAST_VALUE
select 
	dname, ename, salary, hiredate,
	first_value(salary) over( partition by dname order by hiredate ) as first,
	last_value(salary) over(partition by dname order by hiredate) as last
from employee;
```

### 其他函数

NTH_VALUE(expr, n)

用途： 返回窗口中第N个Expr的值，EXPR可以是表达式，也可以是列名

应用场景 ：截止到当前薪资，显示每个员工的薪资中排名第2或者第3的薪资

操作示例：

```sql
select 
	dname, ename, salary, hiredate,
	nth_value(salary, 2) over( partition by dname order by salary ) as two,
	nth_value(salary, 3) over(partition by dname order by salary) as three
from employee;

-- 取出每个部门的第一组员工
select * from (
	select 
		dname, ename, hiredate, salary,
	ntile(3) over(partition by dname order by hiredate ) as rn
	from employee
) t
	where t.rn  = 1;

```
