# JavaScript对象：我们真的需要模拟类吗？

## 背景

在上一篇文章我们已经讲到，JavaScript 本身就是面向对象的，它并不需要模拟，只是它实现面向对象的方式和主流的流派不太一样，所以才让很多人产生了误会。

JavaScript 创始人 Brendan Eich 在“原型运行时”的基础上引入了 new、this 等语言特性，使之“看起来语法更像 Java”，而 Java 正是基于类的面向对象的代表语言之一。

但是 JavaScript 这样的半吊子模拟，缺少了继承等关键特性，导致大家试图对它进行修补，进而产生了种种互不相容的解决方案。

庆幸的是，从 ES6 开始，JavaScript 提供了 class 关键字来定义类，尽管，这样的方案仍然是基于原型运行时系统的模拟，但是它修正了之前的一些常见的“坑”，统一了社区的方案，这对语言的发展有着非常大的好处。

实际上，我认为“基于类”并非面向对象的唯一形态，如果我们把视线从“类”移开，Brendan 当年选择的原型系统，就是一个非常优秀的抽象对象的形式。



## 什么是原型？

字面理解，有过临摹的经验就知道，你参照的那个对象就是原型了，天下产品一大抄你们家产品经理抄的那个就是原型了啥，开发同学都是对着原型写代码的。

原型是顺应人类自然思维的产物。中文中有个成语叫做“照猫画虎”，这里的猫看起来就是虎的原型，所以，由此我们可以看出，用原型来描述对象的方法可以说是古已有之。

我们在上一节讲解面向对象的时候提到了：在不同的编程语言中，设计者也利用各种不同的语言特性来抽象描述对象。最为成功的流派是使用“类”的方式来描述对象，这诞生了诸如 C++、Java 等流行的编程语言。这个流派叫做基于类的编程语言。

还有一种就是基于原型的编程语言，它们利用原型来描述对象。 JavaScript 就是其中代表。

“基于类”的编程提倡使用一个关注分类和类之间关系开发模型。在这类语言中，总是先有类，再从类去实例化一个对象。类与类之间又可能会形成继承、组合等关系。类又往往与语言的类型系统整合，形成一定编译时的能力。

与此相对，“基于原型”的编程看起来更为提倡程序员去关注一系列对象实例的行为，而后才去关心如何将这些对象，划分到最近的使用方式相似的原型对象，而不是将它们分成类。

原型系统的“复制操作”有两种实现思路：

- 一个是并不真的去复制一个原型对象，而是使得新对象持有一个原型的引用 
- 另一个是切实地复制对象，从此两个对象再无关联

历史上的基于原型语言因此产生了两个流派，显然，JavaScript 显然选择了前一种方式。



## JavaScript原型

如果我们抛开 JavaScript 用于模拟 Java 类的复杂语法设施（如 new、Function Object、函数的 prototype 属性等），原型系统可以说相当简单，我可以用两条概括：

- 如果所有对象都有私有字段[ [prototype] ]，就是对象的原型
- 读一个属性，如果对象本身没有，则会继续访问对象的原型，直到原型为空或者找到为止

这个模型在 ES 的各个历史版本中并没有很大改变，但从 ES6 以来，JavaScript 提供了一系列内置函数，以便更为直接地访问操纵原型。三个方法分别为：

- Object.create 根据指定的原型创建新对象，原型可以是null

- Object.getPrototypeOf 获得一个对象的原型
- Object.setPrototypeOf 设置一个对象的原型

利用这三个方法，我们可以完全抛开类的思维，利用原型来实现抽象和复用。

```js
// 抽象猫和虎
var cat = {
    say() {
        console.log('say')
    },
    jump() {
        console.log('jump')
    }
}
var tiger = Object.create(cat, {
    say: {
        writable: true,
        configurable: true,
        enumerable: true,
        value: function() {
            console.log('roar!')
        }
    }
})
var cat1 = Object.create(cat)
cat1.say()
var tiger1 = Object.create(tiger)
tiger1.say()
```

这段代码创建一个"猫"对象，又根据猫做一些修改创建了虎，之后可以用Object.create来创建另外的猫和虎对象，可以通过“原始猫对象”和“原始虎对象”来控制所有猫和虎的行为。

```js
// 接上案例，直接修改cat原始对象，新创建的cat1对象也将就用到新的修改
cat.say = () => { console.log('update cat say')}
cat1.say() // 'update cat say'
```

### 旧的prototype

时代淘汰了，迎接ES6吧



## ES6中的类

除非一些老旧的系统，在最新WEB时间基本上都是ES6来实现了。

es6中引入了class关键字，并且在标准中删除了所有[[class]]相关的私有属性描述，类的概念正式从属性升级成语言的基础设施，从些，基于类的编辑方式成为了JavaScript的官方编辑范式。

类的基本写法：

```js

class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  // Getter
  get area() {
    return this.calcArea();
  }
  // Method
  calcArea() {
    return this.height * this.width;
  }
}
```

在现有的类语法中，getter/setter 和 method 是兼容性最好的。

我们通过 get/set 关键字来创建 getter，通过括号和大括号来创建方法，数据型成员最好写在构造器里面。

类的写法实际上也是由原型运行时来承载的，逻辑上 JavaScript 认为每个类是有共同原型的一组对象，类中定义的方法和属性则会被写在原型对象之上。

### 继承

最重的是类提供了继承能力。

```js
class Animal {
  constructor(name) {
		this.name = name
  }
  say() {
    console.log(this.name + ',say')
  }
}

class Dog extends Animal {
  constructor (name) {
    super(name)
  }
  say() {
    console.log(this.name + ', dog say')
  }
}

let d = new Dog('tom')
d.say()
```

上面这段代码，创建一个Animal类，Dog通过关键字extends继承了它，

比起早期的原型模拟方式，使用 extends 关键字自动设置了 constructor，并且会自动调用父类的构造函数，这是一种更少坑的设计。



## 总结

最近几年来很少用到非ES6的场景了，基本上都是ES6环境，用不了那上结模拟类。

