const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
    // entry: {
    //     app: './src/app.js',
    //     manage: './src/manage.js'
    // },
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {test: /\.js$/, use: ['babel-loader']},
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
            {test: /.(png|svg|jpg|gif)$/, use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            ]},
            {test: /.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader']},
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ template: './public/index.html'})
    ],
    mode: 'development',
    devServer: {
        static: path.join(__dirname, 'dist'),
        hot: true,
        compress: true,
        port: 9000,
    }
}
