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
