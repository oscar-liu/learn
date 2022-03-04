# JavaScript类型细节

此文章为笔记，来自极客时间，重学前端课程



**问题：**

- 为什么有的编辑规范要求用void 0代替undefined ? 

- 字符串有最大长度吗？

- 0.1+0.2为什么不等于0.3？

- 为什么给对象添加的方法能用在基本类型上？

  

## 类型

JavaScript语言的七种类型。

- Undefined
- Null
- Boolean
- String
- Number
- Object
- Symbol



### Undefined

第一个问题，为什么有的编辑规范要求用void 0 代替undefined?

> Undefined类型表示未定义，它的类型只有一个值，就是undefined。任何变量在赋值前是undefined类型值也为undefined。一般我们可以用全局变量undefined来表达这个值，或者void运算来把任意一个表达式变成undefined值。

在过去JQ时代，我们经常有a标记上href="javascript:void(0)"，各种框架源码里面，经常会有一句window.undefined = undefined。因为undefined值是可以变篡改的，为了避免被篡改，建议使用void 0 来获取undefined值。

### Null

也只有一个值，就是null，它的语义表示空值，与undefined不同，null是JS关键字不能被重置，所以在任何时间可以放心使用null关键字来获取null值。

### Boolean

Boolean就两个值，true和false

### String

String有最大长度，长度是2^53-1，但这里的最大长度并不是字符数。

因为String的意义并非是“字符串”，而是字符串的UTF16编码，我们字符串的操作，charAt，charCodeAt，length等方法针对的都是UTF16编码。所以，字符串的最大长度实际上是受字符串的编码长度影响的。

String的字符串是无法变更的，值类型特征。

### Number

通常意义为数字，大致对应数学中的有理数，所有编程语言中，都会有精度的限制。

JavaScript中的Number类型有18437736874454810627(即 2^64-2^53+3) 个值。

JavaScript 中的 Number 类型基本符合 IEEE 754-2008 规定的双精度浮点数规则，但是 JavaScript 为了表达几个额外的语言场景（比如不让除以 0 出错，而引入了无穷大的概念），规定了几个例外情况：

- NaN，占用了9007199254740990，这原本是符合 IEEE 规则的数字；
- Infinity, 无穷大
- -Infinity,负无穷大

JavaScript中有+0和-0,在加法运算中它们没有区别，但在除法场合需要区分。

> “忘记检测除以 -0，而得到负无穷大”的情况经常会导致错误，而区分 +0 和 -0 的方式，正是检测 1/x 是 Infinity 还是 -Infinity。

```javascript
1 / -0 = -Infinity
1 / 0 = Infinity
```

根据双精度浮点数的定义，Number类型中有效整数范围是-0x1fffffffffffff 至 0x1fffffffffffff，所以 Number 无法精确表示此范围外的整数。

同样根据浮点数的定义，非整数的Number类型无法用==（===也不行）来比较。

```javascript
0.1 + 0.2 == 0.3 // false
```

这里比较的结果是false，这是浮点数运算的特点，浮点数精度问题导致等式左右结果并不严格相等。

严格来说这里是比较的方法不正确，正确的比较方法是使用JavaScript提供的最小精度值：

```javascript
Math.abs(0.1+0.2 - 0.3) <= Number.EPSILON // true
```

检查等式两边差的绝对值是否小于最小精度。

### Symbol

ES6 引入了一种新的原始数据类型 Symbol ，表示独一无二的值，最大的用法是用来定义对象的唯一属性名。

Symbol可以具有字符串类型的描述，即使是描述相同，Symbol也不相等。

```javascript
// 创建
var mySymbol = Symbol("my symbol")
```

示例：

使用Symbol.iterator自定义for ... of 在对象上行为

```javascript

    var o = new Object

    o[Symbol.iterator] = function() {
        var v = 0
        return {
            next: function() {
                return { value: v++, done: v > 10 }
            }
        }        
    };

    for(var v of o) 
        console.log(v); // 0 1 2 3 ... 9
```

扩展资料：

MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol

### Object

Object对象是JavaScript中最复杂的类型，也是核心机制之一。

在JavaScript中，对象的定义是“属性的集合”。属性分为数据属性和访问属性，二者都是key-value结构，key可以是字符串或者Symbol类型。

JavaScript中的几个基本类型：

- Number
- String
- Boolean

这三个构造器是两种用法，当与new搭配使用的时候（new Number(3)）产生对象，当直接调用的时候它们表示强制类型转换(var a = Number("3"))。

```js
typeof Number("3") // number
typeof new Number("3") // object
```

对象的方法可以在基本类型上使用，比如：

```javascript
"abc".charAt(0) // a
new String("abc").charAt(0) // a
```

我们在原型上添加方法，都可以就用于基本类型，示例，在Symbol原型上添加了hello方法，在任何Symbol类型变量都可以调用

```javascript
Symbol.prototype.hello = () => console.log("hello")

var a = Symbol("a")
console.log(typeof a) // 这是一个symbol，并非一个object对象
a.hello() // 输出hello
```

为什么给对象添加的方法能用在基本类型上？

运算符提供了装箱操作，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法。

是不是答了等于没答，简单理解就是，在全局对象原型上定义了的方法及属性，在new对象的时候会被调用生效。



## 类型转换

因为JS是弱类型语言，在定义的时候非强制类型声明，所以在进行类型转换的使用场景比较多。

### String转Number

字符串到数字的类型转换，存在一个语法结构，类型转换支持十进制（30）、二进制（0b111）、八进制(0o13)、十六进制(0xFF)。

JavaScript支持的字符串语法还包括正负号科学计数法，可以使用大写或者小写的e来表示：1e3,-1e-2。

在使用parseInt的时候，建议传入第2个参数也就是进制单位，而ParseFloat则直接把原字符串作为十进制来解析，它不会引入任何的其他进制（P话其它进制也没有浮点数吧）。

```javascript
parseInt("888", 10)
```

多数情况下，Number是比parseInt和parseFloat更好的选择。还得看使用场景，转整数另当别论首先Number。

### Number转String

在较小的范围内，数字到字符串的转换没啥好讲的，直接是10进制表示。

当Number绝对值较大或者较小的时候，字符串表示则是使用科学计数法表示。

```javascript
String((0.1+0.2)*(0.1+0.2)*9999999999999999999999999999999999) // '9.000000000000002e+32'
```

### 装箱转换

每一种基本类型Number、String、Boolean、Symbol在对象中都有对应的类，所谓装箱转换，是把基本类型转换为对应的对象，它是类型转换中的一种相当重要的种类。

不明白为啥要叫这个名字？装箱转换，

每一类装箱对象都有私有的class属性，这些属性可以使用Object.prototype.toString获取

```javascript
var s1 = Object(Symbol('str'))
console.log(Object.prototype.toString.call(s1)) // '[object Symbol]'
```

在JavaScript中，没有任何方法可以更改私的Class属性，因为Object.prototype.toString是可以准确识别对象对应的基本类型的方法，它比instanceof更加准确。

### 拆箱转换

在JavaScript标准中，规定了ToPrimitive函数，它是对象类型到基本类型的转换。

对象到String和Number的转换都遵循“先拆箱再转换”的规则。通过拆箱转换，把对象变成基本类型，再从基本类型转换为对应的String或者Number。

拆箱转换会尝试调用valueOf和toString来获得拆箱后的基本类型，如果valueOf和toString都不存在，或者没有返回基本类型，则会产生类型错误TypeError。

