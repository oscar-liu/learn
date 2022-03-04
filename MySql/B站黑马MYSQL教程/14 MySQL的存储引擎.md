# MySQL的存储引擎

## 概念

数据库存储引擎是数据库底层，数据库管理系统使用数据引擎进行创建、查询、更新和删除数据

不同的存储引擎提供不同的存储机制、索引机制，锁机制。MySQL的核心就是存储引擎。

用户可以根据不同的需求为数据表选择不同的存储引擎。

```sql
-- 查看MySQL所有执行引擎，默认引擎是innoDB，行级锁定和外键
-- 方式1
show engines
-- 方式2
show variables like 'have%';
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1c966d8d4b4c4cebb11290a22312bba9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)

MySQL共支持9种存储引擎，默认的引擎是InnoDB

### 字段参数解释：

Engine参数表示存储引擎名称

Support参数表示MySQL数据库管理系统是否支持该存储引擎

Comment参数表示关于存储引擎的评论

Transactions参数表示存储引擎是否支持事务

XA参数表示存储引擎支持的分布式是否符XA规范

Savepoints参数表示存储引擎是否支持事务处理中的保存点

### 操作默认引擎



```sql
 -- 查询当前数据库支持的存储引擎
 show engines;
 
 -- 查看当前的默认存储引擎
 -- 方式一：
 通过`show engines`，Support字段为default的就是默认引擎
 -- 方式二：
 show variables like '%storage_engine%';
 
 -- 查看表引擎(ENGINE=后面的值即为当前使用的存储引擎)
 show create table table_name;
 

 -- 创建新表的时候指定存储引擎
 create table (...) engine = MyISAM;
```



#### 修改存储引擎

**修改MySQL数据库系统默认存储引擎：**

打开my.ini配置文件，找到default-storage-engine = INNODB

修改为你想修改的引擎名称，需要重启mysql服务才会生效。

**修改数据库表存储引擎**

```
alter table table_name engine = INNODB;
alter table table_name engine = MyISAM;
```



## 选择存储引擎

每种存储引擎都有自己的特性、优势和应用场景。

常用存储引擎特性表

| 特性         | MyISAM | InnoDB | MEMORY |
| ------------ | ------ | ------ | ------ |
| 存储限制     | 有     | 64TB   | 有     |
| 事务安全     | 不支持 | 支持   | 不支持 |
| 锁机制       | 表锁   | 行锁   | 表锁   |
| B树索引      | 支持   | 支持   | 支持   |
| 哈希索引     | 不支持 | 不支持 | 支持   |
| 全文索引     | 支持   | 不支持 | 不支持 |
| 集群索引     | 不支持 | 支持   | 不支持 |
| 数据缓存     |        | 支持   | 支持   |
| 索引缓存     | 支持   | 支持   | 支持   |
| 数据可压缩   | 支持   | 不支持 | 不支持 |
| 空间使用     | 低     | 高     | N/A    |
| 内存使用     | 低     | 高     | 中等   |
| 批量插入速度 | 高     | 低     | 高     |
| 支持外键     | 不支持 | 支持   | 不支持 |

- MyISAM，由于该引擎不支持事务，也不支持外键，所以访问速度比较快，适用于对事务完整性没有要求的场景使用。
- InnoDB，支持事务，具有提交，回滚和崩溃恢复，比MyISAM占用更多的磁盘空间
- MEMORY，该存储引擎使用内存来存储数据，所以此引擎速度快，但没有安全保障，【其本上会采用redis等其它内存型NOSQL型数据库替代】