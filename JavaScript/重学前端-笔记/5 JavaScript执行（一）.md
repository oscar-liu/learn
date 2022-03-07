# JavaScript执行（一）

采纳 JSC 引擎的术语，我们把宿主发起的任务称为宏观任务，把 JavaScript 引擎发起的任务称为微观任务。

### Promise里的代码为什么比setTimeout先执行？

先留着，看完资料就得到答案了

## 宏观和微观任务

JavaScript 引擎等待宿主环境分配宏观任务，在操作系统中，通常等待的行为都是一个事件循环，所以在 Node 术语中，也会把这个部分称为事件循环。循环做的事情基本上就是反复“等待 - 执行”。

这里每次的执行过程，其实都是一个宏观任务。我们可以大概理解：宏观任务的队列就相当于事件循环。

在宏观任务中，JavaScript 的 Promise 还会产生异步代码，JavaScript 必须保证这些异步代码在一个宏观任务中完成，因此，每个宏观任务中又包含了一个微观任务队列：

有了宏观任务和微观任务机制，我们就可以实现 JavaScript 引擎级和宿主级的任务了，例如：Promise 永远在队列尾部添加微观任务。setTimeout 等宿主 API，则会添加宏观任务。

### Promise

Promise 是 JavaScript 语言提供的一种标准化的异步管理方式，它的总体思想是，需要进行 io、等待或者其它异步操作的函数，不返回真实结果，而返回一个“承诺”，函数的调用方可以在合适的时机，选择等待这个承诺兑现（通过 Promise 的 then 方法的回调）。

```js
	// 基本用法示例
    function sleep(duration) {
        return new Promise(function(resolve, reject) {
            setTimeout(resolve,duration);
        })
    }
    sleep(1000).then( ()=> console.log("finished"));
```

以下代码，开启一个宏观任务，按顺序执行，遇到promise这个插队的，允许他插到队尾。

输出结果：132

```js
var r = new Promise(function(resolve, reject) {
  console.log('1')
  resolve()
})

r.then( () => console.log('2'))
console.log(3)
// 输出结果 1 3 2
```

再加一个settimeout来测试一下

```js
var r = new Promise(function(resolve, reject) {
  console.log('1')
  resolve()
})
setTimeout( ()=> console.log('settime'), 0) 
r.then( () => console.log('2'))
console.log(3)
// 输出结果： 1 3 2 settime
```

settime这一行会把任务加到宏观队列中，所以还是会优先执行宏观队列1的内容。

因为 Promise 产生的是 JavaScript 引擎内部的微任务，而 setTimeout 是浏览器 API，它产生宏任务。

为了理解微任务始终先于宏任务，再来一个试验，：执行一个耗时 1 秒的 Promise。

```js
	setTimeout(()=>console.log("d"), 0)
    var r = new Promise(function(resolve, reject){
        resolve()
    });
    r.then(() => { 
        var begin = Date.now();
        while(Date.now() - begin < 1000);
        console.log("c1") 
        new Promise(function(resolve, reject){
            resolve()
        }).then(() => console.log("c2"))
    });
```

这里我们强制了 1 秒的执行耗时，这样，我们可以确保任务 c2 是在 d 之后被添加到任务队列。

可以看到，即使耗时一秒的 c1 执行完毕，再 enque 的 c2，仍然先于 d 执行了，这很好地解释了微任务优先的原理。

通过一系列的实验，我们可以总结一下如何分析异步执行的顺序：

- 首先我们分析这段代码中有多少个宏任务
- 在每个宏任务中，有多少个微任务
- 根据调用执行顺序，确定宏任务中的微任务执行顺序
- 根据宏任务的触发规则和调用顺序，确定宏任务的执行顺序
- 确定整个顺序



```js

    function sleep(duration) {
        return new Promise(function(resolve, reject) {
            console.log("b");
            setTimeout(resolve,duration);
        })
    }
    console.log("a");
    sleep(5000).then(()=>console.log("c"));
// 输出结果  a b c 
```

setTimeout 把整个代码分割成了 2 个宏观任务，这里不论是 5 秒还是 0 秒，都是一样的。

第一个宏观任务中，包含了先后同步执行的 console.log(“a”); 和 console.log(“b”);。

setTimeout 后，第二个宏观任务执行调用了 resolve，然后 then 中的代码异步得到执行，所以调用了 console.log(“c”)，最终输出的顺序才是： a b c。

### async/await

async/await 是 ES2016 新加入的特性，它提供了用 for、if 等代码结构来编写异步的方式。它的运行时基础是 Promise，面对这种比较新的特性，我们先来看一下基本用法。

async 函数必定返回 Promise，我们把所有返回 Promise 的函数都可以认为是异步函数。

async 函数是一种特殊语法，特征是在 function 关键字之前加上 async 关键字，这样，就定义了一个 async 函数，我们可以在其中使用 await 来等待一个 Promise。

```js
function sleep(duration) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve,duration);
    })
}
async function foo(){
    console.log("a")
    await sleep(2000).then( ()=> console.log("c"))
    console.log("b")
}

foo()
// 输出结果： a c b
```

虽然sleep是一个异步的Promise，但使用了async和await关键字，强制等待这个promise返回之后再往下执行。

## 结束语

回答上面的问题，

关键词：宏任务，微任务

JS在执行代码的时候，会分成一个一个的宏任务，再分成一个个的微任务，再整理成执行顺序。