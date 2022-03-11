# MySql索引优化

整理收集一些常用的索引优化

```mysql
-- 索引示例
create index idx_mobile_rename_openid on users(realname,mobile,openid);
```



## 避免索引失效

虽然我们添加了索引，但在实际使用中，查询条件等因素会导致索引失效（就是查询语句没有命中索引的情况，而是遍历了整表）

### 全值匹配

这种情况下，索引生效，执行效率高。

查询字段和索引字段一致，即为全值匹配。

和字段匹配成功即可，和字段顺序无关。

```mysql
explain select * from users where realname = '李' and mobile = 'xxx' and openid = 'xxxx';
-- 全值匹配，key_len = 277
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/bbaa509a0210411082d11b5ff65f7dbb.png)

### 最左前缀法则

查询从索引的最左前列开始，并且不跳过索引中的列。

比如示例中三个字段索引：realname,mobile,openid，只要查询条件中有第1个realname字段，无论这个字段是在前还是在后没有影响。

```mysql
-- 第一个索引字段realname, key_len = 62
explain select * from users where realname = '李'; 
-- 第一个索引字段和第2个索引字段， key_len = 124 (62*2=124)
explain select * from users where realname = '李' and mobile = '18888888';
-- 第一个索引和第3个索字段
explain select * from users where realname = '李' and openid = 'xxxx';
```

**索引失效**

如果字段中不包含第一个最左字段realname，哪怕是包括后面的2个字段mobile或者是openid，都不会命中索引。

```mysql
-- 这两种情况都不会命中索引
explain select * from users where openid = 'xxxxx';
explain select * from users where mobile = '' and openid = 'xxxxx';
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/73871d68c51c4079837bf57bcf87a356.png)

### 其它匹配原则

#### 范围查询的右侧不能使用索引

示例

假设有name,age,city三个索引字段

```mysql
-- 前面的两个字段name, age命中索引，但最后一个条件city没有用到索引
select * from users where name = 'xxx' and age > 18 and city = '深圳';
```


![在这里插入图片描述](https://img-blog.csdnimg.cn/25516b2e23604db89008a8cca19ac825.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)



#### 不要在索引列上进行运算操作

```mysql
explain select * from stu where substring(name,2,1) = 'al';
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/72df7e699bb2462ab4bb5b1f92951085.png)

#### 字符串不加单引号

如果查询字符串不加单号，将会造成索引失效

```mysql
-- 这里status类型是varchar，如果不加单引号，status索引将不会命中，只会匹配前面的name索引
explain select * from stu where name = 'oscar' and status = 1;
```

#### 尽量使用覆盖索引，避免select *

尽量避免使用select *,而使用具体的字段名称

```mysql
-- 推荐select 索引字段名称，这就能直接访问B+树索引，不用访问所有源本及磁盘数据，效率高
select name from stu where name = 'oscar'
-- 不推荐select * 这样虽然会访问索引，但还是会访问所有列数据会访问到磁盘数据，效率低
select * from stu where name = 'oscar' and status = '1';
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/50a48d01797e4a6bb44d135e54cfb42b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)

**Extra 描述**

- using index:使用覆盖索引的时候就会出现
- using where:　在查找使用索引的情况下，需要回表去查询所需要的数据
- using index condition: 查找使用了索引，但是需要回表去查询数据
- using index ; using where:　查找使用了索引，但是需要的数据都在索引列中能找到，不需要回表查询数据

#### OR关键词

使用了or关键字，那么涉及的索引都不会被用到。

```mysql
explain select * from stu where name = 'oscar' or status = 3;
```

Extra： Using where有条件，key和key_len为NULL，没有命中索引。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9226b8380daf4b01ad3a124a1a457eaf.png)

#### %开头的Like模糊查询

以%号**开头**的like模糊查询，select *的情况下索引将失效。

```mysql
explain select * from stu where name like 'oscar%'; -- 命中索引
explain select * from stu where name like '%oscar'; -- 索引失效
explain select * from stu where name like '%oscar%'; -- 索引失效
```

以%号的like模糊查询，select 索引字段列

```mysql
explain select name from stu where name like '%oscar'; -- 索引命中
```

#### 全表扫描VS索引

如果MySQL评估使用索引比全表扫描慢，则自动不使用索引，而使用全表扫描

这种情况是由数据本身的特点来决定的

#### is NULL, is NOT NULL关键字

视数据情况而定：

- 当数据列中的数据值没有null值或者null值比较少的时候，is null刚会使用索引，is not null则不会使用索引
- 当数据列中的数据值null值较多，is null刚不会使用索引，is not null则会使用索引



```mysql
-- 给头像字段创建一个单列索引
create index idx_headerimg on users(headerimg);
-- 查询null值数量
select count(*) from users where headerimg is null; -- 14
-- 查询is not null值数量
select count(*) from users where headerimg is not null; -- 552373
-- is null 没有命名索引
explain select * from users where headerimg is null;
-- is not null 命中索引
explain select * from users where headerimg is not null;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ea2c449fb17348e6ace95a9f28720cb3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)



#### in 、 not in关键字

在查询条件是select *号的情况下：

- in走索引
- not in不走索引

如果是select 索引字段或者是主键索引，则无论是in还是not in都会走索引。

![在这里插入图片描述](https://img-blog.csdnimg.cn/b7f02a7f60e148a382502ca3cf760412.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)



#### 单列索引和复合索引

如果有多个单列索引和复合索引，在查询的时候尽量使用复合索引。

 
