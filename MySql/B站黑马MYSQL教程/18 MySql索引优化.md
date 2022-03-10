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

