# webpack基础知识

## 概念
本质上，webpack 是一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 bundles，它们均为静态资源，用于展示你的内容。
核心概念：
 - 入口 Entry
 - 输出 output
 - loader
 - 插件 plugin
 - 模式 mode
 - 浏览器兼容性
 - 环境

依赖图
![依赖图](https://img-blog.csdnimg.cn/f1507395595b4220b365d69125d4f00f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)

## 入口 Entry
Entry用来指定webpack的打包入口。
入口起点用来指示webpack应用应该使用哪个模块，来作为构建内部依赖图的开始。指定了这个入口，webpack从这里开始寻找构建依赖关系，默认值是./src/index.js
可以通过webpack.config.js配置entry属性来指定1个或者多个不同的入口起点。
webpack.config.js 示例：

```js
    // 单入口：enter是一个字符串
    module.exports = {
        entry: './src/index.js'
    }

    // 多入口：enter是一个对象
    module.exports = {
        entry: {
            app: './src/index.js',
            admin: './src/admin.js'
        }
    }
```

## 输出 output
output用来告诉webpack如何将编译后的文件输出到磁盘

**output** 属性告诉 webpack 在哪里输出它所创建的 *bundle*，以及如何命名这些文件。主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中。

示例：webpack.config.js

```js
const path = require('path') //　引入nodejs的path模块用来获取路径
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出的路径
        filename: 'build.js' // 输出的文件名
    }
}
```

## Loaders

webpack只能理解js和json文件，这是webpack自带的能力。

其它静态资源如：less,scss,css,图片等这些类型的文件，必须依赖于loader将它们转换为有效的模块，以供整个应用使用，loaders将这些资源添加到整个依赖图中。

本身是一个函数，接受源文件作为参数，返回转换的结果。

loaders有两个属性：

- test属性，识别出哪些文件会被转换，指定匹配规则，正则表达式。
- use属性，定义出在进行转换时，应该使用哪个loader

示例：

```js
const path = require('path')

mocule.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出的路径
        filename: 'build.js' // 输出的文件名
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader']}
        ]
    }
}
```

这里对一个单独的module对象定义了 rules 属性，里面包含两个必须属性：test 和 use。

这告诉了webpack编译器，碰到 import 或者 require 语句中，.css文件的路径，在对他打包之前，先use（使用） style-loader或者css-loader转换一下。

> 请记住，使用正则表达式匹配文件时，你不要为它添加引号。也就是说，`/\.txt$/` 与 `'/\.txt$/'` 或 `"/\.txt$/"` 不一样。前者指示 webpack 匹配任何以 .txt 结尾的文件，后者指示 webpack 匹配具有绝对路径 '.txt' 的单个文件; 这可能不符合你的意图。

常用的loads

| 名称          | 描述                             |
| ------------- | -------------------------------- |
| babel-loader  | 转换ES6、ES7等JS新特性           |
| css-loader    | 支持.css文件的加载和解析         |
| less-loader   | 支持.less文件的加载解析转换成css |
| ts-loader     | 将ts转换成js                     |
| file-loader   | 进行图片、字体等打包             |
| raw-loader    | 将文件以字符串的形式导入         |
| thread-loader | 多进程打包js和css                |

## Plugins插件

插件用于打包文件的优化，资源管理和环境变量注入

作用于整个构建过程。

使用一个插件，只需要require()它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。

也可以在同一个配置文件中因为不同的目的而多次使用同一个插件，只需要使用 new 操作符来创建一个插件实例。

示例：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack') // 内置属性

module.exports = {
    module: {
        reles: [ { test: /\.txt$/, use: 'raw-loader'} ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html'})
    ]
}

```

