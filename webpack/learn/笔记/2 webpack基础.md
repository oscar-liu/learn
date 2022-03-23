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
        new HtmlWebpackPlugin({ template: './public/index.html'})
    ]
}

```

## mode模式
Mode用来指定当前的构建环境是： production、 development、还是none
设置mode可以使用webpack内置的函数，默认值是production
 - production 生产环境，会开启一些代码压缩等
 - development 开发环境，会利于调于BUG，定位问题

 示例webpack.config.js配置：

```js
module.exports = {
    mode: 'development'
}
```

或者通过webpack命令参数中传递：

```sh
webpack --mode=development
```

三种模式的一些描述：

| 选项          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| `development` | 会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `development`. 为模块和 chunk 启用有效的名。 |
| `production`  | 会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `production`。为模块和 chunk 启用确定性的混淆名称，`FlagDependencyUsagePlugin`，`FlagIncludedChunksPlugin`，`ModuleConcatenationPlugin`，`NoEmitOnErrorsPlugin` 和 `TerserPlugin` 。 |
| `none`        | 不使用任何默认优化选项                                       |



## 一些常用的解析

### ES6 和react JSX

安装babel工具

```sh
npm i @babel/core @babel/preset-env babel-loader -D
```

配置.babelrc文件

```js
{
    //presets是一组Plugins的集合
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react" // react
    ]
}
```

### 解析css,less,scss

css-loader用于加载.css文件，并且转换成commonjs对象

style-loader将样式通过<style>标签插入到head中

```sh
# 安装
npm i css-loader style-loader -D
npm i less less-loader -D
```

配置webpack.config.js

```js
module: {
        rules: [
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']} // less
        ]
    },
```

### 解析文件，图片、字体

file-loader用于处理文件

```sh
# 安装
npm -i file-loader
```

配置webpack.config.js

```
module: {
        rules: [
            {test: /\.{png|svg|jpg|gif}$/, use: ['file-loader']},
            {test: /.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader']},
        ]
    },
```



## 文件监听

文件监听是在发现源码发生变化时，自动重新构建新的输出文件。

webpack开启监听模式，有两种方式：

- 启动 webpack 命令时，带个 --watch 参数
- 在配置 webpack.config.js 中设置 watch: true

这里有一个缺陷，每次都需要手动刷新浏览器，决定了我们不太可能采用这种监听方式。

#### 文件监听的原理分析

轮循判断文件的最后编辑时间是否变化 

某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 aggergateTimeout

```js
module.export = {
	// 默认 false不开启
	watch: true,
	// 只有监听模式时，watchOptions才有意义
	watchOptions: {
		// 默认为空，不监听的文件或者文件夹，支持正则匹配
		ignored: /node_modules/,
		// 监听到变化发生后，需要等待这个时间到了再去执行，默认是300ms
		aggregateTimeout: 300,
		// 判断文件是否发生变化是通过不停的询问系统指定文件有没有变化实现的，默认每秒询问1000次
		poll: 1000
	}
}
```

## 热更新

### webpack-dev-server

wds 不刷新浏览器，不输出文件，而是放在内存中

使用 HotModuleReplacementPlugin 插件

```js
module.export = {
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    mode: 'development',
    devServer: {
        static: path.join(__dirname, 'dist'),
        hot: true,
        compress: true,
        port: 9000,
    }
}
```

启动命令：

```js
"start": "webpack serve --open"
```

注意：

webpack-dev-server版本在4以上的时候，需要nodejs版本大于12



### webpack-dev-middleware

WDM 将 webpack 输出的⽂文件传输给服务器器，适用于灵活的定制场景。

比如启动一个nodejs的exporess服务，使用wdm将文件传输给nodejs的express服务



### 热更新的原理分析

Webpack Compile: 将JS编译成 Bundle

HMR Server: 将热更新的文件输出给 HMR Runtime

Bundle Server: 提供文件在浏览器的访问

HMR Runtime: 会注入到浏览器，更新文件的变化

bundle.js : 构建输出的文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/eca73a15fe7441d882c46ac7c9b8633b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeml5aTgxMw==,size_20,color_FFFFFF,t_70,g_se,x_16)



## 文件指纹

打包后输出的文件名的后缀

版本管理，版本一致浏览器会缓存。

主要有三种：

- Hash: 和整个项目的构建相关，只要项目文件有修改，整个项目构建的hash值都会改变
- Chunkhash：和 webpack 打包的chunk有关，不同的 entry 会生成不同的 chunkhash 值
- Contenthash： 根据文件内容来定义 hash， 文件内容不变，则 contenthas不变

一般JS资源采用chunkhash来生成，css资源采用contenthash，只要css文件内容没有变化就不用和JS一起变化以避免影响客户端的缓存。

### JS文件指纹设置

设置 output 的filename，使用 [chunkhash]，每次打包都会生成新的chunkhash

```js
module.export = {
	output: {
		path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
	}
}
```

### CSS文件的指纹设置

需要使用一个mini-css-extract-plugin的插件

```sh
# 安装
npm i mini-css-extract-plugin -D
```

设置 MiniCssExtractPlugin 的filename，使用 [contenthash]

这是一个的条件，需要加入MiniCssExtractPlugin.loader和配置plugins

```js
module.export = {
	module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ] 
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        })
    ]
}
```

### 图片的文件指纹设置

设置 file-loader 的 name， 使用[hash]

```js
module.export = {
	module: {
        rules: [
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },
        ]
    }
}
```

| 占位符名称    | 含义                          |
| ------------- | ----------------------------- |
| [ext]         | 资源后缀名                    |
| [name]        | 文件名称                      |
| [path]        | 文件的相对路径                |
| [folder]      | 文件所在的文件夹              |
| [contenthash] | 文件的内容hash，默认是md5生成 |
| [hash]        | 文件内容的hash，默认是md5生成 |
| [emoji]       | 一个随机的指代文件内容的emoji |



## 代码压缩

压缩后字节更小，访问更快。

### JS文件的压缩

内置了 uglifyjs-webpack-plugin ，打包的时候会压缩



### Css文件的压缩

使⽤ CssMinimizerWebpackPlugin

```sh
#安装
npm install css-minimizer-webpack-plugin --save-dev
npm install mini-css-extract-plugin --save-dev
```

配置到插件 https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.export = {
    module: {
        rules: [
            {
                test: /.s?css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader" ],
            }
         ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        })
    ],
}
```



### 文件的压缩

修改 html-webpack-plugin，设置压缩参数，可以处理掉空行，空格。

