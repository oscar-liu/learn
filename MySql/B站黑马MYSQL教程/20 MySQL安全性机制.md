# MySQL安全性机制

MySql有一套完整的安全性机制，即通过 MySQL用户赋予适当的权限来提高数据安全。

MySQL中主要包含两种用户：root 用户和普通用户，root 为超级管理员，拥有 MySQL提供的所有权限；而普通用户则只能拥有创建用户时赋予的权限。

## 权限表介绍

在 MySQL系统库(mysql)中,在这个表中存储着关于权限的表。其中最重要的是：mysql.user, mysql.db, mysql.host这几张表。

### 系统表 mysql.user

通过 desc 查看表结构，发现有 N 多个字段，这些字段可以分为4类，分别为：用户字段、权限字段、安全字段、资源控制字段。

#### 用户字段

系统表中的 mysql.user 中用户字段包含3个字段，主要用来判断用户是否登录成功，当用户登录的时候 mysql 会检测这个表中的用户和密码信息，同时匹配则允许登录。

当创建新用户的时候也会同步在这个表中创建这些信息，修改用户密码的时候也会同步更新。

- Host 主机名
- User 用户名
- Password 密码

#### 权限字段

有一系列以"_priv"字符串结尾的字段，这些字段决定了用户的权限。

| 字段                  | 权限名称                | 权限的范围                   |
| --------------------- | ----------------------- | ---------------------------- |
| Create_priv           | CREATE                  | 数据库、表或索引             |
| Drop_priv             | DROP                    | 数据库或表                   |
| Grant_priv            | GRANT OPTION            | 数据库、表、存储过程或者函数 |
| References_priv       | REFERENCES              | 数据库和表                   |
| Alter_priv            | ALTER                   | 修改表                       |
| Detlete_priv          | DELETE                  | 删除表                       |
| Index_priv            | INDEX                   | 用索引查询表                 |
| Insert_priv           | INSERT                  | 插入表                       |
| Select_priv           | SELECT                  | 查询表                       |
| Update_priv           | UPDATE                  | 更新表                       |
| Create_view_priv      | CREATE VIEW             | 创建视图                     |
| Show_view_prive       | SHOW VIEW               | 查看视图                     |
| Alter_routione_priv   | ALTER ROUTINE           | 修改存储过程或者函数         |
| Create_routione_priv  | CREATE TOUTINE          | 创建存储过程或者函数         |
| Execute_priv          | EXECUTE                 | 执行存储过程或者函数         |
| File_priv             | FILE                    | 加载服务器主机上的文件       |
| Create_tmp_table_priv | CREATE TEMPORARY TABLES | 创建临时表                   |
| Lock_tables           | LOCK TABLES             | 锁定表                       |
| Create_user_priv      | CREATE USER             | 创建用户                     |
| Process_priv          | PROCESS                 | 服务器管理                   |
| Reload_priv           | RELOAD                  | 重新加载权限表               |
| Repl_client_priv      | REPLICATION CLIENT      | 服务器管理                   |
| Repl_slave_priv       | REPLICATION SLAVE       | 服务器管理                   |
| Show_db_priv          | SHOW DATABASES          | 查看数据库                   |
| Shutdown_priv         | SHUTDOWN                | 关闭服务器                   |
| Super_priv            | SUPER                   | 超级权限                     |

表中的权限大致是两大类：高级管理权限和普通权限，前者对数据库进行管理，后者用于操作数据库。

```sql
+------------------------+-----------------------------------+------+-----+-----------------------+-------+
| Field                  | Type                              | Null | Key | Default               | Extra |
+------------------------+-----------------------------------+------+-----+-----------------------+-------+
| Host                   | char(60)                          | NO   | PRI |                       |       |
| User                   | char(32)                          | NO   | PRI |                       |       |
| Select_priv            | enum('N','Y')                     | NO   |     | N                     |       |
| Insert_priv            | enum('N','Y')                     | NO   |     | N                     |       |
| Update_priv            | enum('N','Y')                     | NO   |     | N                     |       |
| Delete_priv            | enum('N','Y')                     | NO   |     | N                     |       |
| Create_priv            | enum('N','Y')                     | NO   |     | N                     |       |
| Drop_priv              | enum('N','Y')                     | NO   |     | N                     |       |
| Reload_priv            | enum('N','Y')                     | NO   |     | N                     |       |
| Shutdown_priv          | enum('N','Y')                     | NO   |     | N                     |       |
| Process_priv           | enum('N','Y')                     | NO   |     | N                     |       |
| File_priv              | enum('N','Y')                     | NO   |     | N                     |       |
| Grant_priv             | enum('N','Y')                     | NO   |     | N                     |       |
| References_priv        | enum('N','Y')                     | NO   |     | N                     |       |
| Index_priv             | enum('N','Y')                     | NO   |     | N                     |       |
| Alter_priv             | enum('N','Y')                     | NO   |     | N                     |       |
| Show_db_priv           | enum('N','Y')                     | NO   |     | N                     |       |
| Super_priv             | enum('N','Y')                     | NO   |     | N                     |       |
| Create_tmp_table_priv  | enum('N','Y')                     | NO   |     | N                     |       |
| Lock_tables_priv       | enum('N','Y')                     | NO   |     | N                     |       |
| Execute_priv           | enum('N','Y')                     | NO   |     | N                     |       |
| Repl_slave_priv        | enum('N','Y')                     | NO   |     | N                     |       |
| Repl_client_priv       | enum('N','Y')                     | NO   |     | N                     |       |
| Create_view_priv       | enum('N','Y')                     | NO   |     | N                     |       |
| Show_view_priv         | enum('N','Y')                     | NO   |     | N                     |       |
| Create_routine_priv    | enum('N','Y')                     | NO   |     | N                     |       |
| Alter_routine_priv     | enum('N','Y')                     | NO   |     | N                     |       |
| Create_user_priv       | enum('N','Y')                     | NO   |     | N                     |       |
| Event_priv             | enum('N','Y')                     | NO   |     | N                     |       |
| Trigger_priv           | enum('N','Y')                     | NO   |     | N                     |       |
| Create_tablespace_priv | enum('N','Y')                     | NO   |     | N                     |       |
| ssl_type               | enum('','ANY','X509','SPECIFIED') | NO   |     |                       |       |
| ssl_cipher             | blob                              | NO   |     | NULL                  |       |
| x509_issuer            | blob                              | NO   |     | NULL                  |       |
| x509_subject           | blob                              | NO   |     | NULL                  |       |
| max_questions          | int(11) unsigned                  | NO   |     | 0                     |       |
| max_updates            | int(11) unsigned                  | NO   |     | 0                     |       |
| max_connections        | int(11) unsigned                  | NO   |     | 0                     |       |
| max_user_connections   | int(11) unsigned                  | NO   |     | 0                     |       |
| plugin                 | char(64)                          | NO   |     | caching_sha2_password |       |
| authentication_string  | text                              | YES  |     | NULL                  |       |
| password_expired       | enum('N','Y')                     | NO   |     | N                     |       |
| password_last_changed  | timestamp                         | YES  |     | NULL                  |       |
| password_lifetime      | smallint(5) unsigned              | YES  |     | NULL                  |       |
| account_locked         | enum('N','Y')                     | NO   |     | N                     |       |
| Create_role_priv       | enum('N','Y')                     | NO   |     | N                     |       |
| Drop_role_priv         | enum('N','Y')                     | NO   |     | N                     |       |
| Password_reuse_history | smallint(5) unsigned              | YES  |     | NULL                  |       |
| Password_reuse_time    | smallint(5) unsigned              | YES  |     | NULL                  |       |
+------------------------+-----------------------------------+------+-----+-----------------------+-------+
```

#### 安全字段

系统表mysql.user中的安全字段包含4个字段，主要用来判断用户是否能够登录成功。

| 用户字段名   | 描述                      |
| ------------ | ------------------------- |
| ssl_type     | 支持ssl标准加密的安全字段 |
| ssl_cipher   | 支持ssl标准加密的安全字段 |
| x509_issuer  | 支持x509标准的字段        |
| x509_subject | 支持x509标准的字段        |

包含ssl字符串的字段主要用来实现加密，包含x509字符串的字段主要用来标识用户。

以用以下语句来查看是否支持ssl

```sql
show variables like 'have_openssl'; -- YES支持
```

#### 资源控制字段

系统表nysql.user中所有资源控制字段的默认值为0,表示没有任何限制

| 字段名               | 描述                         |
| -------------------- | ---------------------------- |
| max_questions        | 每小时允许执行多少次查询     |
| max_update           | 每小时允许执行多少次更新     |
| max_connections      | 每小时可以建立多少次连接     |
| max_user_connections | 单个用户可以同时具有的连接数 |



## MySql提供的用户机制

### 登录和退出

**登录：**

```sql
mysql -h hostname|hostIP -P port -u username -p DatabaseName -e "sql语句"
```

-P port端口

-p 密码

参数database用来指定mysql服务器后，登录到哪一个数据库，如果没有指定，默认为系统数据库mysql

参数-e，用来指定执行的sql语句

**退出：**

```sql
exit | quit
```

### MySql 8以下版本 创建普通用户账户

#### 1、 执行create user语句来创建用户账户

语法格式如下：

```sql
create user username[identified by 'password' ]
```

关键字user用来设置用户账号的名字，identified by用来设置用户账号的密码。

值username由用户名和主机构成。

示例：

```sql
create user 'litchi'@'localhost' identified by '123456';
```

#### 2、 执行INSERT语句来创建用户

系统权限表mysql.user中存储了关于用户账户的信息，可以通过向这张表插入数据来实现创建账号。向系统表中插入数据时，一般只需要插入Host, User和Password这三个字段的值即可。

```sql
-- mysql 5.7版本
INSERT INTO user(Host, User, Password) values('hostname', 'username', password('password'));
```

不推荐使用这种方式了。

#### 3、 Grant 语句创建用户

以上两种创建的创建方式不便于赋权限，推荐使用GRANT来创建账号

语法：

```sql
GRANT priv_type ON databasesname.tablename
	TO username[IDENTIFIED BY PASSWORD('password') ]
```

参数priv_type表示用户实现设置所创建用户账号的权限，（select, update, delete）*号表示所有

参数databasesname.tablename权限范围，数据库及表，可以用通配符* . * 表示所有库表

### MySql 8.0版本创建用户并赋权限

```sql
mysql> CREATE USER 'username'@'%' IDENTIFIED BY 'password'; -- 创建账号和密码
mysql> GRANT ALL PRIVILEGES ON *.* TO 'username'@'%' WITH GRANT OPTION; -- 赋权限
mysql> flush privileges; -- 刷新权限
```



### 修改用户密码

```sql
-- 利用超级用户root修改用户密码
mysqladmin -u username -p password 'new_password';
-- 回车输入旧密码，密码修改成功
```

**修改root用户密码**

```sql
-- mysql8.0
alter user 'root'@'localhost' identified by '12341234';
-- 8.0以下
update mysql.user set password='newpassword' where user='root';
update mysql.user set password=PASSWORD('newpassword') where User='root';
```

### 删除账号

#### 通过drop user语句删除普通用户

```sql
drop user user1, user2 ...
```

#### 删除系统表mysql.user

```sql
delete from user where user = 'username' and host = 'localhost';
```



## 权限管理

### 用户授权

权限管理包含授权、查看权限和收回权限。在授权之前，需要用户具有grant权限。

**GTANT语法格式**

```sql
GRANT
    priv_type [(column_list)]
      [, priv_type [(column_list)]] ...
    ON [object_type] priv_level
    TO user_or_role [, user_or_role] ...
    [WITH GRANT OPTION]
    [AS user
        [WITH ROLE
            DEFAULT
          | NONE
          | ALL
          | ALL EXCEPT role [, role ] ...
          | role [, role ] ...
        ]
    ]
}

GRANT PROXY ON user_or_role
    TO user_or_role [, user_or_role] ...
    [WITH GRANT OPTION]

GRANT role [, role] ...
    TO user_or_role [, user_or_role] ...
    [WITH ADMIN OPTION]

object_type: {
    TABLE
  | FUNCTION
  | PROCEDURE
}

priv_level: {
    *
  | *.*
  | db_name.*
  | db_name.tbl_name
  | tbl_name
  | db_name.routine_name
}

user_or_role: {
    user (see Section 6.2.4, “Specifying Account Names”)
  | role (see Section 6.2.5, “Specifying Role Names”)
}
```

参数with 

### **查看用户权限**

```sql
-- 语法
show grants for user;
-- 示例，查看用户： 'litchi'@'localhost'
show grants for 'litchi'@'localhost';
-- 输出结果： GRANT USAGE ON *.* TO `litchi`@`localhost`
```



### 收回用户权限

通过REVOKE关键字实现

```sql
REVOKE
    priv_type [(column_list)]
      [, priv_type [(column_list)]] ...
    ON [object_type] priv_level
    FROM user_or_role [, user_or_role] ...

REVOKE ALL [PRIVILEGES], GRANT OPTION
    FROM user_or_role [, user_or_role] ...

REVOKE PROXY ON user_or_role
    FROM user_or_role [, user_or_role] ...

REVOKE role [, role ] ...
    FROM user_or_role [, user_or_role ] ...

user_or_role: {
    user (see Section 6.2.4, “Specifying Account Names”)
  | role (see Section 6.2.5, “Specifying Role Names”.
}
```

回收用户所拥的全部权限

```sql
REVOKE SELECT ON *.* FROM 'litchi'@'localhost';
```

