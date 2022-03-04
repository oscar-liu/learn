# MySQL事务

当多个用户访问同一份数据时，一个用户在更改的过程中有可能 还会有其它用户同时发起更改请示，为保证数据的更新从一个一致性变更为另外一个一致性的状态，MySQL采用了事务来保证数据的一致性。

支持事务的引擎有innoDB和BDB。

InnoDB存储引擎事务主要是通过UNDO日志和REDO日志实现，MyISAM和MEMORY存储引擎则不支持事务。

## 事务的概述

事务具有以下四个特性（ACID）

- 原子性（Atomicity）：事务中所有的操作都视为一个原子单元，即对事务所进行的数据修改等操作只能是完全提交或者完全回滚。
- 一致性（Consistency）：事务在完成时，必须 使所有数据从一种一致性状态变更为另一种一致性状态，所有的变更都必须应用于事务的修改，以确保数据的完整性。
- 隔离性（Isolation）：一个事务中的操作语句所做的修改必须与其他事务所做的修改相隔离。在进行事务查看数据时数据所处的状态，要么是被另一并发事务修改之前的状态，要么是被另一并发事务修改之后的状态，即当前事务不会查看由另一个并发事务正在修改的数据。这种特性是通过锁机制实现。
- 持久性（Durability）：事务在完成之后，所做的修改对数据的影响是永久的，即使系统重启或者出现系统故障数据仍可以恢复。

InnoDB支持ACID事务、行级锁和高并发。为支持事务，InnoDB引擎引入了与事务相处理相关的UNDO日志和REDO日志，同时事务依赖于MySQL提供的锁机制。

### REDO 日志

事务执行时需要将执行的事务日志先写入到日志文件中，对应的文件为REDO日志。当每条SQL进行数据库更新操作时，首先将REDO日志写入到日志缓冲区，当客户端执行COMMIT命令提交时，日志缓冲区的内容将被刷新到磁盘，日志缓冲区的刷新方式或者时间间隔可以通过参数innodb_flush_log_at_trx_commit控制。

```sql
show variables like '%innodb_flush%';
```

REDO日志对应磁盘上的ib_logfileN文件，该文件默认为5MB，建议设置为512MB以便容纳较大的事务。在MySQL崩溃恢复时会重新执行REDO日志中的记录。

在mysql数据库存放目录中的ib_logfile0和ib_logfile1即为redo日志。

```sql
-- 查看mysql数据库存放路径
 show variables like '%datadir%';
```



### UNDO 日志

与REDO日志相反，UNDO日志主要用于事务异常时的数据回滚，具体内容就是复制事务前的数据库内容到UNDO缓冲区，然后在合适的时间将内容刷新到磁盘。

与REDO日志不同的是，磁盘上不存在单独的UNDO日志文件，所有的UNDO日志均存放在表空间对应的.ibd数据文件中，即使MYSQL服务启用了独立的表空间，依然如此。UNDO日志又被称为回滚段。



## 事务控制语句

### 语法格式：

```sql
START TRANSACTION | BEGIN [WORK]
COMMIT [WORK] [AND [NO] CHAIN ] [ [No] RELEASE]
ROLLBACK [WORK] [AND [NO] CHAIN] [ [NO] RELEASE]
SET AUTOCOMMIT = { 0　|１}
```

1、 开启事务： start Transaction

任务一条DML语句(insert, update, delete )执行，都标志事务的开启

命令： START TRANSACTION 或者BEGIN [WORK]

2、提交事务： Commit Transaction

成功的结束，将所有的DML语句操作历史记录和度层硬盘数据来一次同步

信命令：COMMIT

3、回滚事务： Rollback Transaction

失败的结束，将所有的DML语句操作历史记录全部清空

命令：Rollback

### 示例：

```sql
-- 创建账号表
create table account(
	id int primary key, 
    name varchar(20),
    money double
);

-- 插入数据到账户表中
insert into account values(1, 'litchi', 1000);
insert into account values(2, 'mango', 2000);

-- 查询事件是否为自动提交，1为自动提交
select @@autocommit;

-- 设置MYSQL的事务为手动提交（关闭自动提交）
set autocommit = 0;

-- 模拟转账
-- 开启事务
begin;
update account set money = money - 500 where id = 1;
update account set money = money + 500 where id = 2;

-- 提交事务
commit;

-- 回滚事务
rollback;
```



## 事务隔离级别

MYSQL有四个隔离级别

- 未提交读 READ UNCOMMITTED
- 提交读,不可重复读 READ COMMITTED
- 可重复读 REPEATABLE READ
- 可串行化 SERIALIZABLE

默认隔离级别为： REPEATABLE-READ 可重复读

| 事务隔离级别                     | 脏读 | 不可重复读 | 幻读 |
| -------------------------------- | ---- | ---------- | ---- |
| 未提交读 READ UNCOMMITTED        | 是   | 是         | 是   |
| 提交读,不可重复读 READ COMMITTED | 否   | 是         | 是   |
| 可重复读 REPEATABLE READ         | 否   | 否         | 是   |
| 可串行化 SERIALIZABLE            | 否   | 否         | 否   |



```sql
-- 查看当前MYSQL的事务隔离级别
show variables like 'transaction_isolation';
```

![查看当前MYSQL的事务隔离级别](https://img-blog.csdnimg.cn/bff18c549afd48d09abc14945fb56008.png)

可以通过以下语句设置不同的隔离级别

```sql
-- 未提交读
SET GLOBAL TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
-- 提交读
SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- 可重复读
SET GLOBAL TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- 可串行化
SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```



### READ UNCOMMITTED 读取未提交内容

在该隔离级别中，所有事务都可以看到其他未提交事务的执行结果。因为其性能也不比其他级别高很多，因此此隔离级别实际应用中一般很少使用，读取未提交的数据被称为脏读（Dirty Read）。

#### 示例：

当事务B进行了update语句，但是还没有提交事务前，事务A读取到了事务B的更新后的值。当事务B进行回滚后，金额数据又恢复了修改前的值，A事务出现了脏读现象。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e17f2aafc0884cb6bfa3fbc3af46138e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)



### READ COMMITTED 读取提交内容，不可重复读

这是多数数据库系统的默认隔离级别，但并不是MYSQL的默认隔离级别。

这个隔离级别满足了隔离的简单定义：**一个事务从开始到提交前所做的任何改变都是不可见的，事务只能看到已经提交事务所做的改变。**

这个隔离级别也支持所谓的不可重复读，因为同一事务的其他实例在该实例处理期间可能 会有新的数据提交导致数据改变，所以同一查询可能 返回不同的结果 。

#### 示例：

首先开启A和B事务，A事务首次查询因为B事务还未提交，所以查询到的是更新前的值，在B事务提交后，A事务查询到了更新后的值（此时的A事务中两次查询出现了不一样的值，即不可重复读现象）

![在这里插入图片描述](https://img-blog.csdnimg.cn/f663856722114091bbcb121ef0321981.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)



### REPEATABLE READ 可重复读

这是MYSQL的默认的事务隔离级别，能确保同一事务的多个实例在并发读取数据时，会看到同样的数据行。

理论上会导致另一问题，幻读。例如第1个事务对一个表中的数据进行了修改，这种修改涉及表中的全部数据行。同时第2个事务也修改这个表中的数据，这种修改是向表中插入一行新数据。那么，以后就会发生操作第1个事务的用户发现表中还有没修改的数据行。

InnoDB和Falcon存储引擎通过多版本并发控制机制（Multi_Version Concurrency Control, MVCC）解决了此问题。

#### InnoDB存储引擎的MBCC机制：

InnoDB通过为每个数据行增加两个隐含值的方式来实现。这个隐含值记录了行的创建时间，以及过期时间。每一行存储事件发生时的系统版本号。每一次开始一个新事务时版本号会自动加1,每个事务都会保存开始时的版本号，每个查询会根据事务的版本号来查询结果。



#### 示例：

首先开启A和B两个事务，在B事务更新并提交后，A事务读取到的还是之前的数据，保证了同一事务中读取 到的数据是一致的。

在同一个事务中，不推荐使用不同存储引擎的表，COMMIT， ROLLBACK只能对相同事务类型的表进行提交和回滚。

![image-20220213222511211](/home/oscar/snap/typora/49/.config/Typora/typora-user-images/image-20220213222511211.png)



MySQL中所有的语句是不能回滚的，并且部分的DDL语句会造成隐式提交。比如：ALTER TABLE, TRUNCATE TABLE 和DROP TABLE等。



### SERIALIZABLE 可串行化（序列号）

这是最高的隔离级别，通过强制事务排序，使之不可能相互冲突，从而解决幻读问题。在每个读的数据行上加上共享锁实现。在这个级别会导致大量的超时现象和锁竞争，一般不推荐使用。



### 其他：

这4种事务隔离级别采取不同的锁类型来实现，若读取的是同一个数据的话，会容易发生以下问题。

- 脏读（Drity Read)： 某个事务已更新一份数据，另一个事务在此时读取了同一份数据，由于某些原因，前一个事务进行了RollBack回滚操作，则后一个事务所读取的数据有可能 是回滚前的更新的数据，会导致后一个事务取到不错误的数据值。

- 不可重复读（Non-repeatable read）：在一个事务的两次查询之中数据不一致，这可能 是两次查询过程中间插入了一事务的更新更新更新了原有数据。

  

幻读：

扩展资料 https://segmentfault.com/a/1190000016566788

幻读，并不是说两次读取获取的结果集不同，幻读侧重的方面是某一次的 select 操作得到的结果所表征的数据状态无法支撑后续的业务操作。更为具体一些：select 某记录是否存在，不存在，准备插入此记录，但执行 insert 时发现此记录已存在，无法插入，此时就发生了幻读。

模拟了一下场景，看图示例

![image-20220213225402765](/home/oscar/snap/typora/49/.config/Typora/typora-user-images/image-20220213225402765.png)











