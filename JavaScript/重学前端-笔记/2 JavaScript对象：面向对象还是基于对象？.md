# JavaScript对象：面向对象还是基于对象？

JavaScript标准对于基于对象的定义：

> 语言和宿主的基础设施由对象来提供，并且JavaScript程序即是一系列互相通讯的对象集合。

## 什么是面象对象？

这个十年前就讲烂了这个词，记得当前看简历上都有写有OOP思想，熟悉面象对象设计。

Object(对象)在英文中，是一切事务的总称，这和面象对象编辑的抽象思维有互通之处。

对象并不是计算机领域凭空造出来的概念，它是顺着人类思维模式产生的一种抽象，于是面象对象编辑也被认为是：更接近人类思维模式的一种编辑范式。

在人类思维模式下，对象是什么？

> 对象这一概念在人类的幼儿期形成，这远远早于我们编程逻辑中常用的值、过程等概念。在幼年期，我们总是先认识到某一个苹果能吃（这里的某一个苹果就是一个对象），继而认识到所有的苹果都可以吃（这里的所有苹果，就是一个类），再到后来我们才能意识到三个苹果和三个梨之间的联系，进而产生数字“3”（值）的概念。

在《面向对象分析与设计》这本书中，Grady Booch 替我们做了总结，他认为，从人类的认知角度来说，对象应该是下列事物之一：

- 一个可以触摸或者可以看见的东西；
- 人的智力可以理解的东西；
- 可以指导思考或行动（进行想象或施加动作）的东西。

而 JavaScript 早年却选择了一个更为冷门的方式：原型

在 ES6 出现之前，大量的 JavaScript 程序员试图在原型体系的基础上，把 JavaScript 变得更像是基于类的编程，进而产生了很多所谓的“框架”，比如 PrototypeJS、Dojo。

## JavaScript对象的特征

### 对象的本质特征

- 对象具有唯一标识性：即使完全两个相同的两个对象，也并非同一个对象。
- 对象有状态：对象具有状态，同一对象可能处于不同状态之下。
- 对象具有行为：即对象的状态，可能 因为它的行为产生变迁。

唯一标识性：

各语言的对象唯一标识性都是用内存地址来体现的，对象具有唯一的的标识。

所以在JS中，任何不同的js对象其实是互不相等的。一模一样的两个对象。

```js
var o1 = { age: 18 };
var o2 = { age: 18 };
console.log( o1 == o2 )
```

在JavaScript中，将状态和行为统一抽象为“属性”。

```js
// o是对象，d是一个属性，函数f也是一个属性，尽管写法不同，但对于JavaScript来说，d和f就是两个普通属性
    var o = { 
        d: 1,
        f() {
            console.log(this.d);
        }    
    };
```

总结一句话就是，在JavaScript中，对象的状态和行为其实都被抽象为了属性。

JavaScript允许对象在运行时添加属性。

```js
var o  = { age: 18 }
o.name = 'litchi'
console.log(o.age, o.name)
```

在实现了对象的基本特征的基础上，作者认为

**JavaScript中对象独有的特色是：对象具有高度的动态性，这是因为JavaScript赋予了使用者在运行时为对象添加状态和行为的能力。**



## JavaScript对象的两类属性

对JavaScript来说，属性并非只是简单的名称和值，JavaScript用一组特征(attribute)来描述属性（property）。

### 数据属性

先说第一类属性，数据属性，它有四个特征：

- value： 就是属性的值
- writable: 决定属性能否被赋值
- enumerable: 决定for in 能否枚举该属性
- configurable: 决定该属性能否被删除或者改变特征值

### 访问器属性

第二类属性是访问器（getter/setter)属性，它也有四个特征

- getter: 函数或undefined，在取属性值时被调用
- setter: 函数或者undefined，在设置属性时被调用
- enumerable: 决定for in 能否枚举该属性
- configurable: 决定该属性能否被删除或者改变特征值

访问器属性使得属笥在读和写时执行代码（Vue2的v-model)，它允许使用者在写和读属性时，得到完全不同的值，它可以视为一种函数的语法糖。

我们通常用于定义属性的代码会产生数据属性，其中的 writable、enumerable、configurable 都默认为 true。我们可以使用内置函数 getOwnPropertyDescriptor 来查看，如以下代码所示：

```js
var o = {
  a: 1
}
o.b = 2
// a和b都是数据属性
Object.getOwnPropertyDescriptor(o, "a") // Object { value: 1, writable: true, enumerable: true, configurable: true }
Object.getOwnPropertyDescriptor(o, "b") // Object { value: 2, writable: true, enumerable: true, configurable: true }
```

这里使用了2种语法来定义属性，用API来查看这个属性，发现定义出来的属性都是数据属性，writeable、enumerable、configurable 都是默认值为 true。

如果我们想改变属性的特征，或者定义访问器属性，我们可以使用Object.defineProperty，示例：

```js
var obj = { a: 1}
Object.defineProperty(o, "b", { value: 2, writable: false, enumerable: false, configurable: true} )
//a和b都是数据属性，但特征值变化了
Object.getOwnPropertyDescriptor(o, "a") // Object { value: 1, writable: true, enumerable: true, configurable: true }
Object.getOwnPropertyDescriptor(o, "b") // Object { value: 2, writable: false, enumerable: false, configurable: true }
o.b = 3 // 这个赋值不生效，因为 writable: false
console.log(o.b) // 2
```

这里我们使用了 Object.defineProperty 来定义属性，这样定义属性可以改变属性的 writable 和 enumerable。

我们同样用 Object.getOwnPropertyDescriptor 来查看，发现确实改变了 writable 和 enumerable 特征。因为 writable 特征为 false，所以我们重新对 b 赋值，b 的值不会发生变化。

在创建对象时，也可以使用 get 和 set 关键字来创建访问器属性，代码如下所示：

```js
var o = { get a() { return 1}}
o.a = 2 // 赋值了，但获取的时候还是被代理返回成了1
console.log(o.a)
```

访问器属性跟数据属性不同，每次访问属性都会执行 getter 或者 setter 函数。这里我们的 getter 函数返回了 1，所以 o.a 每次都得到 1。

这样，我们就理解了，实际上 JavaScript 对象的运行时是一个“属性的集合”，属性以字符串或者 Symbol 为 key，以数据属性特征值或者访问器属性特征值为 value。

对象是一个属性的索引结构，可以快速的使用key来定位查找vlue



可事实上，这样的对象系统设计虽然特别，但是 JavaScript 提供了完全运行时的对象系统，这使得它可以模仿多数面向对象编程范式（下一节课我们会给你介绍 JavaScript 中两种面向对象编程的范式：基于类和基于原型），所以它也是正统的面向对象语言。JavaScript 语言标准也已经明确说明，JavaScript 是一门面向对象的语言，我想标准中能这样说，正是因为 JavaScript 的高度动态性的对象系统。

所以，我们应该在理解其设计思想的基础上充分挖掘它的能力，而不是机械地模仿其它语言。



