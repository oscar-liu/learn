# JavaScript对象：你知道全部的对象分类吗？

开篇废话，略

在实际业务开发中，会用到很多内置的JS对象，如array,set，这类对象很多，接下来理解一下这些对象的特质。

## JavaScript中对象的分类

- 宿主对象（host Objects）： 由JavaScript宿主环境提供的对象，它们的行为完全由宿主环境决定
- 内置对象（Built-in Objects）: 由JavaScript语言提供的对象
  - 固有对象（Intrinsic Objects）:由标准规定，随着JavaScript运行时创建而自动创建的对象实例
  - 原生对象（Native Objects）：可以由用户通过Array、RegExp等内置构造器或者特殊语法创建的对象
  - 普通对象（Ordinary Objects）：由{}语法、Object构造器或者class关键字定义类创建的对象，它能够被原型继承

这节我们主要熟悉普通对象之外的对象类型。

### 宿主对象

JavaScript 宿主对象有很多，最常用的是以下两种，

- 浏览器环境： 

  - Web API https://developer.mozilla.org/zh-CN/docs/Web/API
  - DOM https://developer.mozilla.org/zh-CN/docs/Glossary/DOM

- nodejs环境

   本次不涉及到node相关知识

  

### 内置对象

#### 固有对象

固有对象是由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例。

固有对象在任何 JavaScript 代码执行前就已经被创建出来了，它们通常扮演者类似基础库的角色。我们前面提到的“类”其实就是固有对象的一种。

https://262.ecma-international.org/9.0/#sec-promise-constructor

#### JavaScript标准内置对象分类

在JavaScript中，能够通过语言本身的构造器创建的对象称作原生对象。

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects

按照MDN的分类是这样：

| 分类             | 描述                                                         | 对象关键字                                                   |
| ---------------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| 值属性           | 这些全局属性返回一个简单值，这些值没有自己的属性和方法。     | Infinity<br/>    NaN<br/>    undefined<br/>    globalThis    |
| 函数属性         | 全局函数可以直接调用，不需要在调用时指定所属对象，执行结束后会将结果直接返回给调用者。 | eval()<br/>    uneval()<br/>    isFinite()<br/>    isNaN()<br/>    parseFloat()<br/>    parseInt()<br/>    decodeURI()<br/>   decodeURIComponent()<br/>    encodeURI()<br/>  encodeURIComponent() |
| 基本对象         | 顾名思义，基本对象是定义或使用其他对象的基础。基本对象包括一般对象、函数对象和错误对象。 | Object<br/>    Function<br/>    Boolean<br/>    Symbol       |
| 错误对象         | 错误对象是一种特殊的基本对象。它们拥有基本的 [`Error`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error) 类型，同时也有多种具体的错误类型。 | Error<br/>    AggregateError<br/>    EvalError<br/>    InternalError<br/>    RangeError<br/>    ReferenceError<br/>    SyntaxError<br/>    TypeError<br/>    URIError |
| 数字和日期对象   | 用来表示数字、日期和执行数学计算的对象。                     | Number<br/>    BigInt<br/>    Math<br/>    Date              |
| 字符串           | 用来表示和操作字符串的对象。                                 | String<br/>    RegExp                                        |
| 可索引的集合对象 | 这些对象表示按照索引值来排序的数据集合，包括数组和类型数组，以及类数组结构的对象。 | Array<br/>    Int8Array<br/>    Uint8Array<br/>    Uint8ClampedArray<br/>    Int16Array<br/>    Uint16Array<br/>    Int32Array<br/>    Uint32Array<br/>    Float32Array<br/>    Float64Array<br/>    BigInt64Array<br/>    BigUint64Array |
| 使用键的集合对象 | 这些集合对象在存储数据时会使用到键，包括可迭代的[`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map) 和 [`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)，支持按照插入顺序来迭代元素。 | Map<br/>    Set<br/>    WeakMap<br/>    WeakSet              |
| 结构化数据       | 这些对象用来表示和操作结构化的缓冲区数据，或使用 JSON （JavaScript Object Notation）编码的数据。 | ArrayBuffer<br/>    SharedArrayBuffer<br/>    Atomics<br/>    DataView<br/>    JSON |
| 控制抽象对象     | 控件抽象可以帮助构造代码，尤其是异步代码（例如，不使用深度嵌套的回调）。 | Promise<br/>    Generator<br/>    GeneratorFunction<br/>    AsyncFunction |
| 反射             |                                                              | Reflect<br/>    Proxy                                        |
| 国际化           | ECMAScript核心的附加功能，用于支持多语言处理。               | Intl<br/>    Intl.Collator<br/>    Intl.DateTimeFormat<br/>    Intl.ListFormat<br/>    Intl.NumberFormat<br/>    Intl.PluralRules<br/>    Intl.RelativeTimeFormat<br/>    Intl.Locale |
| WebAssembly      |                                                              | WebAssembly<br/>    WebAssembly.Module<br/>    WebAssembly.Instance<br/>    WebAssembly.Memory<br/>    WebAssembly.Table<br/>    WebAssembly.CompileError<br/>    WebAssembly.LinkError (en-US)<br/>    WebAssembly.RuntimeError |
| 其他             |                                                              | arguments                                                    |

#### 用对象来模拟函数与构造器：函数对象与构造器对象

- 函数对象的定义是：具有[[call]]私有字段的对象

- 构造器对象的定义是：具有私有字段[[construct]]的对象。

JavaScript 用对象模拟函数的设计代替了一般编程语言中的函数，它们可以像其它语言的函数一样被调用、传参。任何宿主只要提供了“具有[[call]]私有字段的对象”，就可以被 JavaScript 函数调用语法支持。

> [[call]]私有字段必须是一个引擎中定义的函数，需要接受 this 值和调用参数，并且会产生域的切换

我们可以这样说，任何对象只需要实现[[call]]，它就是一个函数对象，可以去作为函数被调用。而如果它能实现[[construct]]，它就是一个构造器对象，可以作为构造器被调用。

当然了，用户用 function 关键字创建的函数必定同时是函数和构造器。不过，它们表现出来的行为效果却并不相同。

对于宿主和内置对象来说，它们实现[[call]]（作为函数被调用）和[[construct]]（作为构造器被调用）不总是一致的。比如内置对象 Date 在作为构造器调用时产生新的对象，作为函数时，则产生字符串：

```js
console.log(new Date); // Date对象
console.log(Date()) // 字符串
```

而浏览器宿主环境中，提供的 Image 构造器，则根本不允许被作为函数调用。

```js
console.log(new Image); 
console.log(Image());//抛出错误
```

ES6 之后通过箭头 => 语法创建的函数仅仅是函数，它们无法被当作构造器使用
