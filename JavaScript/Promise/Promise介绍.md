# Promise介绍

## Promise是什么？
在Promise之前，我们都是使用回调来解决异步编程的问题，回调有一个比较难以处理的是回调地狱。
Promise是js实现的一个异步构造函数，可以使用new来实现。

## Promise的状态
实例对象的一个属性 PromiseState
 - pending 未决定的，等待
 - resolved 成功
 - rejected 失败


### 状态的改变
 - pending变成resolved
 - pending变成rejected
 - throw抛出异常，状态会变更为rejected
有2种情况能改变状态，且一个promise对象只能改变一次，无论变成成功还是失败，都会有一个结果

### 回调方法
promise有两回调方法
then和catch
 - then 状态成功的时候调用
 - catch 状态为失败的时候调用

#### 改变状态和指定回调函数先后顺序
 - 都有可能，正常情况下是先指定回调再改变状态，但也可以先改状态再指定回调
 - 如何先改状态再指定回调？
  - 在执行器中直接调用resolve()或者reject()
  - 延迟更长时间才调用then()
 - 什么时候能得到数据？
  - 如果先指定的回调，那当状态发生改变时，回调函数就会调用，得到数据
  - 如果先改变状态，那当指定回调，回调函数就会调用，得到数据

## Promise 对象的值
实例对象的另一个属性 PromiseResult
异步保存着成功/失败的结果
 - resolve
 - reject
