# MySQL日志

在任何一种数据库，都会有各种各样的日志，记录着数据库工作的方方面面，以帮助数据库管理员追踪数据曾经发生过的各种事件。

## 日志分类

- 错误日志

- 二进制日志

- 查询日志

- 慢查询日志

  

### 错误日志

最重要的日志之一，它记录了当mysqld启动和停止时，以及服务器在运行过程中发生任何严重错误的相关信息。当数据库出现任何故障导致无法正常使用时，可以首先查看此日志。

该日志是默认开启的，默认存入目录为mysql的数据目录，默认的日志文件名为hostname.err(hostname是主机名)

查看日志位置指令：

```sql
show variables like 'log_error%';
```

/var/log/mysql/error.log 

#### 二进制日志binlog

binlog记录了所有的DDL（数据定义语言）语句和DML（数据操作语言）语句，但是不包括数据查询语句。此日志对于灾难时的数据恢复有重要作用，主从复制，就是通过binlog实现的。

有了binlog理论上可以对历史记录中任何一个时间的数据进行恢复。

MySQL8.0默认是开启的，低版本的MySQL需要通过配置文件开启，并配置MySQL日志的格式。

```sql
# 配置开 启binlog日志,日志的文件前缀为mysqlbin,生成的文件名如：mysqlbin.00001, mysqlbin.00002
log_bin=mysqlbin

# 配置二进制日志的格式
binlog_format=STATEMENT
```

##### 日志格式
 - STATEMENT 
 这种日志格式记录的是SQL语句，每一条对数据进行修改的SQL都会记录在日志中，通过mysql提供的mysqlbinlog工具，可以查看到每条语句的广西，主从复制的时候，从库会将日志解析为原文本，并在从库重新执行一次。
 - ROW
 这种日志格式在日志文件中记录的是每一行数据变更，而不是记录SQL语句。比如，执行SQL语句，update table set status = 1 where id =1,如果是STATEMENT日志格式会记录一行SQL文件，如果是ROW，由于是对表进行更新，也就是每一行记录都会发生变更，ROW格式的日志中会记录每一行的数据变更
 - MIXED
 混合了STATEMENT和ROW两种格式

```sql
    -- 查看MySQL是否开启了binlog日志
    show variables like 'log_bin%'

    -- 查看binlog日志格式
    show variables like 'binlog_format'

    -- 查看所有binlog日志
    show binlog events;

    -- 查看最新的日志
    show master status;

    -- 查询指定的binlog日志
    show binlog events in 'binlog.000048';

    -- 从指定的位置开始，查看指定的binlog日志
    show binlog evnets in 'binlog.000048' from 157;
    -- limit 限制查询条数
    show binlog evnets in 'binlog.000048' from 157 limit 2;
    -- litmit 偏移
    show binlog evnets in 'binlog.000048' from 157 limit 1, 3;

    -- 清空所有的binlog日志
    reset master;

```

### 查询日志
 - 查询日志中记录了客户端所有操作语句，而binlog不包括查询数据的SQL语句
 - 默认情况是不开启查询日志

 ```sql
    -- 临时开启查询日志
    set global general_log = 1;

 ```
 开启了会在MySQL中的数据目录下，生成一个以主机名.log的文件，记录了执行的查询，更新等语句。


### 慢查询日志
慢查询日志记录了所有执行时间超过参数long_query_time设置值并且扫描记录数不小于min_examined_row_limit的所有的SQL语句的日志。
long_query_time默认值为10秒，最小为0,精度可以到微秒。

```sql
    -- 查询慢查询日志是否开启
    show variables like 'slow_query_log%';

    -- 开启慢查询日志1开启0关闭
    slow_query_log = 1

    -- 该参数用来指定慢查询日志的文件名
    slow_query_log_file=slow_query.log

    -- 配置慢查询时间限制，超过这个值将认为是慢查询进行日志记录，默认值是10s
    long_query_time=10

```
配置文件里面修改需要重启才生效
```sql
    slow_query_log		= 1
    slow_query_log_file	= /var/log/mysql/mysql-slow.log
    long_query_time = 2
```