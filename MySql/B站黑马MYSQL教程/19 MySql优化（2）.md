# MySql优化
一些常用的MySql使用中的常见优化细节。
## 大批量数据加载优化
### load数据加载
格式：

```sql
load data local infile '文件路径' into table 表名 fields terminated by '[分隔符]' line terminated by '[换行符]'
```
1、 首先，检测全局变量‘local_infile'的状态，如果是off状态则是不可用

```sql
show global variables like 'local_infile';
```
2、 修改local_infile值为on，开启local_infile

```sql
set global local_infile=1;
```

3、 加载数据
当通过load向表数据加载时，尽量保证文件中的主键是有序的。

### 关闭唯一性校验
如果表中有唯一索引，如果有唯一索引在导入的时候 每一行都会做校验，会影响加载数据。
插入完成后再打开创建唯一索引。

```sql
set UNIQUE_CHECKS=0; -- 0 or 1
```

## insert插入数据优化
如果需要同时对一张表插入多行数据，尽量使用多个值表的insert语句，这种方式将缩减用户端与服务器之间的连接、关闭消耗，比单个insert into语句执行效率高。
单个insert into每次插入都会执行一次连接关闭操作。

```sql
-- 原始方式
insert into tb_name value(1,'value1');
insert into tb_name value(2,'value1');
insert into tb_name value(3,'value1');
-- 优化方式
insert into tb_name values(1, 'valu1'), (2, 'value2'),(3,'value3');
```
**在事务中进行数据优化**
在事务中数据插入，需要手动提交，不然每一次插入都会触发自动提交事务，频繁开启提交事务

```sql
begin
insert into tb_name value(1, 'value1');
insert into tb_name value(2,'value2');
commit;
```
**数据有序插入**
在插入数据的时候，如果有主键ID，数据的顺序尽量是有序的，这样表在构建索引的时候 将大大减少构建时间。

## Order by 优化
#### 两种排序方式
 - 第一种是通过对返回数据进行排序，也就是通常说的filesort排序，所有不是通过索引直接返回排序结果的排序都叫filesort排序
 - 第二种是通过有序索引顺序扫描直接返回有序数据，这种情况即为using index，不需要额外排序，操作效率高

```sql
 -- 创建索引
 alter table emp add index idx_depid(department);
 
 -- 效率低 排序字段虽然有索引，但使用的select *所有，所以排序的时候并没有使用到索引字段
 explain select * from emp order by department; -- Using filesort
 
 -- 效率高 查询字段即索引字段
 explain select department from emp order by department; -- Using index
 
 -- 效率低 查询字段排序方式中有非索引字段
 explain select department,emp_name from emp order by department; -- Using filesort
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/838f43e57187435480a9564863163462.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)
- **order by 后边的多个排序字段尽量排序方式相同**
- **order by 后边的多个排序字段尽量和索引字段顺序相同**

#### Filesort的优化
通过创建合适的索引，能够减少filesort的出现，但在某些情况下不可避免的会使用到filesort。
对filesort，MySql有两种排序算法：
 - 两次扫描算法：
   MySql4.1之前，使用该方式排序。首先根据条件取出排序字段和行指针信息，然后在排序区sort buffer中排序，如果sort buff不够，则在临时表中temporary table中存储排序结果。完成排序之后，再根据行指针回表读取记录，该操作可能会导致大量随机i/o操作。
 - 一次扫描算法
   一次性取出满足条件的所有字段，然后在排序区sort buffer中排序后直接输出结果集。排序时内存开销较大，但是排序效率比两次扫描算法更高。

MySql通过比较系统变量max_length_for_sort_data的大小和Query语句取出的字段总大小，来判定是否采用哪种算法，如果max_length_for_sort_data更大，那么使用第二种优化之后的算法，否则使用第一种。
可以适当的提高sort_buffer_size和max_length_for_sort_data系统变量，来增大排序区的大小，提高排序的效率。

```sql
show variables like 'max_length_for_sort_data'; -- 默认4096
show variables like 'sort_buffer_size'; -- 默认262144
```

## 子查询优化
多表连接查询优于子查询，因为MySql不需要在内存中创建临时表来完成这个逻辑（子查询会创建临时表，再从临时表中读取数据）。
非特殊情况尽量使用多表连接查询。
system > const > eq_ref > ref > range > index > all

## limit 查询优化
一般分页查询时，通过创建覆盖索引能够很好的提高性能。
一个常见非常头疼的问题就是limit 900000, 10， 此时需要MySql排序前900000 - 900010的记录，其它记录丢弃，查询排序的代价非常大。
 - 优化思路一：
   在索引上完成排序分页操作，最后根据主键关联回原表查询所需要的其它列内容
   

```sql
-- 先主键ID排序再使用limit
select * from table_name a, (select id from table_name order by id limit 900000, 10) b where a.id = b.id;
```

 - 优化思路二：
   该文案适用于主键自增的表，可以把limit查询转换成某个位置的查询
   先使用主键索引快速排序筛选出数据 
   

```sql
select * from table_name where id > 90000 limit 10;
```