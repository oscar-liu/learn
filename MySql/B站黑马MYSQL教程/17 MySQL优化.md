# MySQL优化

应用开发初始，功能优先，随着数据的急剧增长，SQL会有一些性能上的问题，因为我们会需要对SQL进行一些优化。

优化的方式非常多，大致可以分为以下几点：

- 从设计上优化
- 从查询上优化
- 从索引上优化
- 从存储上优化



## 查看SQL执行频率

客户端连接成功后，通过show [session|global] s命令可以查看服务器状态信息。通过查看状态信息可以查看对当前数据库的主要操作类型。

```sql
-- 显示当前session中所有统计参数的值
show session status like 'Com_______';  -- 查看当前会话统计结果
show global status like 'Com_______'; -- 查看自数据库上次启动至今统计结果

show status like 'Innodb_rows%'; -- 查看针对Innodb引擎的统计结果
```



| 参数                 | 含义                                                       |
| -------------------- | ---------------------------------------------------------- |
| Com_select           | 执行select操作的次数，一次查询只累加1                      |
| Com_insert           | 执行insert操作的次数，对于批量插入的insert操作，只累加一次 |
| Com_update           | 执行update操作的次数                                       |
| Com_deleted          | 执行deleted操作的次数                                      |
| Innodb_rows_read     | select查询返回的行数                                       |
| Innodb_rows_inserted | 执行insert操作插入的行数                                   |
| Innodb_rows_updated  | 执行update操作更新的行数                                   |
| Innodb_rows_deleted  | 执行delete操作删除的行数                                   |
| Connections          | 试图连接MySQL服务器的次数                                  |
| Uptime               | 服务器工作时间                                             |
| Slow_queries         | 慢查询次数                                                 |



## 定位低效率的SQL

可以通过以下两种方式定位执行效率低的SQL语句

- 慢查询日志
- show processlist 该命令查看当前MySQL在进行的线程，包括线程的状态、是否锁表等，可以实时的查看SQL的执行情况，同时对一个锁表操 作进行优化。

### 查看慢日志信息

```sql
-- 查看慢日志配置信息
show variables like '%slow_query_log%';

-- 开启慢日志查询
set global slow_query_log =1;

-- 查看慢日志SQL的最低时间
show variables like 'long_query_time%';

-- 修改慢日志SQL的最低时间值
set global long_query_time = 5;
```



### show processlist

```sql
show processlist
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1ffeff376c774891bf338e8231b42ff5.png)

字段描述：

- id: 用户登录MySQL时，系统分配的connection_id，可以使用函数select connection_id()查看
- user: 当前用户名，如果不是root，显示的就是用户权限范围的SQL语句
- host：显示这个语句是从哪个IP的端口上发送过来的，可以用来跟踪出现问题语句的用户
- db：显示这个进程目前连接的是哪个数据库
- command列：显示当前连接的执行的命令，一般取值为休眠（sleep），查询（query），连接(connect)，等待（Daemon）等
- time：显示这个状态持续的时间，单位秒
- state：显示使用当前连接的sql语句的状态，很重要的列，state描述的是语句执行中的某一个状态。一个SQL语句，以查询为例，可能需要经过copyright to tmp table、sorting restult、sending data、 Waiting on empty queue等状态才可以完成
- info：显示这个sql语句，是判断问题语句的一个重要依据



## explain分析执行计划

通过以上的两种方法查询到效率低的SQL语句后，可以通过explain命令获取MySQL如何执行SELECT语句的信息，包括SELECT语句执行过程中表如何连接和连接的顺序

语法示例：

```sql
-- 分析查询语句在内部执行的状态信息
explain select * from user where id = 1; 
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/120f2972e1744a78a87873050a4fb908.png)

字段解释：

| 字段          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| id            | select查询的序列号，是一组数字，表示的是查询中执行Select子句或者是操作表的顺序 |
| select_type   | 表示select的类型，常见的取值有SIMPLE(简单表，即不使用表连接或者子查询)，PRIMARY（主查询，即外层查询），UNION（UNION中的第2个或者后面的查询语句），SUBQUERY（子查询中的第一个select）等 |
| table         | 输出结果集的表，显示这一行的数据是关于哪张表的，有时不是真实的表名字,看到的是derivedx(x是个数字,理解是第几步执行的结果) |
| type          | 表示表的连接类型，性能由好到差的连接类型为（system -> const -> eq ref -> ref -> ref_or_null -> index_merge -> index_subquery -> range -> index -> all） |
| possible_keys | 表示查询时，可能使用的索引。指出MySQL能使用哪个索引在表中找到记录，查询涉及到的字段上若存在索引，则该索引将被列出，但不一定被查询使用 |
| key           | 表示实际使用的索引                                           |
| key_len       | 索引字段的长度                                               |
| rows          | 扫描行的长度                                                 |
| extra         | 执行情况的说明和描述                                         |

### id字段

1、id相同表示加载表的顺序是从上到下（书写查询语句的顺序）

2、id不同id值越大，优先级越高越先被执行

3、id有相同也有不相同的，同时存在。id相同的可以认为是一组，从上往下顺序执行，在所有的组中，id的值越大，优先级越高，越先执行。



### select_type字段

| select_type          | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| SIMPLE               | 简单的select查询，不使用UNION或者子查询                      |
| PRIMARY              | 查询中若包含任何复杂的子查询，最外层查询标记为该标识         |
| UNION                | 若第二个SELECT出现在UNION之后，则标记为UNION；               |
| SUBQUERY             | 在select或者where列表中包含了子查询                          |
| DERIVED              | 在FROM列表中包含的子查询，被标记为DERIVED（衍生）MYSQL会递归这些子查询，把结果放在临时表中（explain select * from (select * from stu limit 2) s） |
| UNION RESULT         | 从UNION表获取结果的SELECT                                    |
| DEPENDENT SUBQUERY   | 子查询中的第一个SELECT，取决于外面的查询                     |
| UNCACHEABLE SUBQUERY | 一个子查询的结果不能被缓存，必须重新评估外链接的第一行       |
| DEPENDENT UNION      | UNION中的第二个或后面的SELECT语句，取决于外面的查询          |

### type 字段

| type   | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| NULL   | MySQL不访问任何表、索引，直接返回结果                        |
| system | 系统表，少量数据，往往不需要进行磁盘IO，5.7版本后不再显示system,将显示all |
| const  | 命中主键(primary key)或者唯一索引（unique），被连接的部分是一个常量值 |
| eq_ref | 类似ref，区别就在使用的索引是唯一索引/，对于每个索引键值，表中只有一条记录匹配，简单来说，就是多表连接中使用primary key或者 unique key作为关联条件（1）join查询；（2）命中主键(primary key)或者非空唯一(unique not null)索引，（3）等值连接 |
| ref    | 非唯一性索引扫描，返回匹配某个单独值的所有行，对于前表的每一行（row)，后表可能 有多于一行的数据被扫描 |
| range  | 只检索给定返回的行，使用一个索引来选择行。where之后出现between, <,>,in 等操作 |
| index  | 需要扫描索引上的全部数据                                     |
| ALL    | Full Table Scan， 遍历全表以找到匹配的行，无索引             |

结果值从最好到最坏的排序是：system > const > eq_ref > ref > range > index > All

### possible_keys字段

**可能使用的索引键，指出MySQL能使用哪个索引在表中找到记录，查询涉及到的字段上若存在索引，则该索引将被列出，但不一定被查询使用**

如果是null则没有相关的索引，可以通过检测where子句来看是否可以引用某些索引列来提高查询性能。

![在这里插入图片描述](https://img-blog.csdnimg.cn/1c5732b01cfc425695acf69ab7735cfe.png)

### key

**实际使用的索引键**

### key_len

***\*表示索引中使用的字节数，可通过该列计算查询中使用的索引的长度（key_len显示的值为索引字段的最大可能长度，并非实际使用长度，即key_len是根据表定义计算而得，不是通过表内检索出的）\****

不损失精确性的情况下，长度越短越好。

命中索引字段的长度

### extra

**该列包含MySQL解决查询的详细信息,有以下几种情况：**

| extra                        | 描述                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| Using index                  | MySQL所需要返回的所有列数据均在索引树上，避免访问所有的数据行，效率高。 |
| Using filesort               | MySQL会对数据做一个外部的索引排序，而不是按照表内的索引顺序进行读取，称为“文件排序”，效率低。 |
| Using temporary              | 需要建立临时表(temporay table)来暂存中间数据结果，常见于order by，效率低。 |
| Using join buffer            | 强调了在获取连接条件时没有使用索引，并且需要连接缓冲区来存储中间结果。如果出现了这个值，那应该注意，根据查询的具体情况可能需要添加索引来改进能。 |
| Impossible where             | 这个值强调了where语句会导致没有符合条件的行                  |
| Select tables optimized away | 这个值意味着仅通过使用索引，优化器可能仅从聚合函数结果中返回一行 |

![在这里插入图片描述](https://img-blog.csdnimg.cn/448790e0b747464c8543fdf622cf4ef1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)



### explain总结

- explain不会反馈关于触发器、存储过程的信息或者用户自定义函数对查询的影响
- explain不考虑各种cache
- explain不能显示MySQL在执行查询时所作的优化工作
- 部分统计信息是估算的，并非精确值
- explain只能解释select操作，其他操作要重写select后查看执行计划



## show profile分析SQL

show profiles能够在做SQL优化时帮助我们了解到时间都消耗在哪里去了。

### 查看开启profile

通过have_profiling参数，能够看到当前的MySQL是否支持profile

```sql
-- 查看是否开启了profile
select @@have_profiling;
-- 设置启用1启用0关闭
set profiling=1;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/90398509b4f24d0684e0dcfcfaaa1376.png)

### for query

查询单个sql语句执行过过程中的情况

```sql
show profile for query 2; -- 2是ID
```


![查询单个sql语句执行过过程中的情况](https://img-blog.csdnimg.cn/44201b38b24942cea35a58074e66de87.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_15,color_FFFFFF,t_70,g_se,x_16)

在获取到最消耗时间的线程状态后，MySQL支持进一步选择**all、cpu、block io、context switch、page faults**等明细类型类查看MySQL在使用什么资源上消费了过高的时间。

**关键字：all、cpu、block io、context switch、page faults**

示例：

```sql
-- 查看cpu消耗的时间
show profile cpu for query 2;  
```

- Status: sql语句的执行状态
- Duration: sql执行过程中每一个步骤的时间
- CPU_user: 当前用户占有的CPU
- CPU_system: 系统占用的CPU

<img src="https://img-blog.csdnimg.cn/fc5e962d32b544c1ace8e2f37e6a5ba6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16" alt="查看cpu消耗的时间"  />



## trace分析优化器执行计划

打开trace，设置为JSON，并设置trace最大能够使用的内存大小，避免解析过程中因为默认内存过小而不能够完整展示。

```sql
set optimizer_trace = "enabled=on", end_markers_in_json=on;
set optimizer_trace_max_men_size=1000000;
```

执行sql语句

```sql
select * from stu where id < 3;
```

最后，检查information_schema.optimizer_trace就可以知道MySQL是如何执行的。

```sql
select * from information_schema.optimizer_trace \G;
```

