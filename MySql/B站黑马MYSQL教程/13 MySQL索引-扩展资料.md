# MySQL索引-扩展资料

## 索引原理概述

索引以文件的形式存储在磁盘上，索引查找过程中会产生磁盘I/O消耗，相对于内存查找，I/O消耗要高好几个量级，判断一个数据结构作为索引的优劣最重要的指标就是在查找过程中磁盘I/O操作次数的渐进复杂度。

索引的结构组织要尽量减少查找过程中的磁盘I/O消耗。

![在这里插入图片描述](https://img-blog.csdnimg.cn/8b8b5fc5f6f440e295bd11c6d7fefda0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)



## 相关算法

### Hash算法

优点：通过字段的value值通过特定的函数算出hash值，根据hash值获取数据定位数据信息，定位数据非常快。

缺点：不能进行范围查找，因为hash是无序的，无法进行大小比较。

| 索引 | hash函数             | Hash值 | 数据           |
| ---- | -------------------- | ------ | -------------- |
| 20   | 20 -> fn(20) -> 0x11 | 0x11   | (20, 荔枝, 18) |
| 40   | 40 -> fn(40) -> 0x12 | 0x12   | (40, 西瓜, 28) |

适合定位查找单行数据，不适合范围查找。



### BTREE树

B-Tree，B+Tree

![在这里插入图片描述](https://img-blog.csdnimg.cn/462c315ac7574eb1be201a71aaca9de7.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)

在线Btree树数据结构可视化网站，在这里可以看到数据结构可以自己实现查看Btree树结构的建模过程

https://www.cs.usfca.edu/~galles/visualization/Algorithms.html

https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html



#### MyISAM引擎使用B+Tree

叶子节点的data域存放的是数据记录的地址，（指针）。

#### InnoDB引擎使用B+Tree

叶子节点的data域存放的是真实的数据，所以innoDb的索引会占用大量的硬盘存储空间。



## 索引的特点

### 索引的优点

- 加快数据查询的速度

- 使用分组或者排序进行数据查询时，可以明显的减少查询时间

- 创建唯一索引，可以保证数据库表中每一行数据的唯一性

  

### 索引的缺点

- 创建索引和维护索引需要消耗时间，并且随机数据量的增加，时间也会增加
- 索引需要占用磁盘空间，数据越大，占用的磁盘越大
- 对数据表中的数据进行增加，修改，删除的时候 ，索引也会需要动态维护，增加了服务器的性能消耗



### 索引的创建原则

- 更新频繁的列不应该设置索引
- 数据量小的表不要使用索引
- 重复数据多的字段不应该设置索引 （比如性别：只有男和女，一般来说，重复的数据超过百分之15就不应该建立索引）
- 首先应访考虑对where和order by涉及的列上建立索引