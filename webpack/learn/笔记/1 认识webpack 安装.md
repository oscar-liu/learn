# webpack是什么？
webpack是一个JS程序的静态模块打包工具。
一切皆模块。

## 为什么选择webpack?
 - 更新稳定，有专业团队维护
 - 社区生态好，官方提供的的插件和生态强大
 - 主流使用的人多

## 认识一下webpack.config.js文件
```js
    module.exports = {
        entry: './src/index.js',                        // 打包的入口文件
        output: './dist/main.js',　                     // 打包的输出
        mode: 'production',                             // 环境
        module: { 
            rules: [
                {test: /\.txt$/, usse: 'raw-loader' }   // Loader 配置
            ]
        },
        plugins: [                                      // 插件配置
            new HtmlwebpackPlugin({
                template: './src/index.html'
            })
        ]
    }
```
从4.0开始，webpack可以不用再引入一个配置文件来打包项目，有一些默认配置。
```js
    module.exports = {
        entry: './src/index.js',   // 默认的entry
        output: './dist/main.js'   // 默认的output
    }
```

## 安装webpack和webpack-cli
创建空目录和package.json
```sh
    mkdir my-project
    cd my-project
    npm init -y
```

安装webpack和webpack-cli
```sh
    npm install webpack webpack-cli --save-dev
    # 检查是否安装成功
    ./node_modules/.bin/webpack -v
```

## 使用webpack
```sh
    # 使用当前项目下的node_modules/.bin目录下的webpack
    ./node_modules/.bin/webpack
    # 编写npm指令,模块局部安装会在 node_modules/.bin ⽬目录创建软链接
    "scripts": {
        "build": "webpack" # 会自动到当前项目下的node_modules/.bin目录下寻找
    }
```