# MySql 安装

下载地址：

https://downloads.mysql.com/archives/community/

解压到安装目录，配置环境变量

### MySql目录介绍



###### bin目录

一些可执行文件，如mysql.exe, mysqld.exe, mysqlshow.exe

###### docs目录

mysql文档资源目录

###### Data目录

数据库的文件目录，存放数据库及日志文件

登录后可以使用SHOW GLOBAL VARIABLES LIKE "%Datadir%"；查看Data目录位置。

###### include目录

存放一些头文件，如mysql.h , mysql_ername.h

###### lib目录

核心库文件

###### share目录

用于存放字符集，语言等信息

###### my.ini文件

my.ini是MySql默认使用的配置文件，一般情况下，只要修改my.ini配置文件中的内容就可以对MySql进行配置。

### MySql的初始化信息

- 1、初始化临时密码

​	mysqld --initialize -user=mysql --console

![image-20220107164723542](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220107164723542.png)

- 2、安装mysql服务

  mysqld --install

- 3、启动mysql服务

  net start mysql

- 4、登录mysql, 需要密码

  mysql -uroot -p

- 5、修改root用户密码

  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456'

- 6、修改root用户权限

  create user 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456' 



### MySql配置文件my.ini

```
[mysqld]
# 设置端口
port = 3306
# 字符集
character-set-server = utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine = INNODB

[mysql]
# 设置客户端 默认字符集
default-character-set = utf8

[client]
# 设置msql客户端连接服务端时默认使用的端口
port=3306
default-character-set = utf8
```

