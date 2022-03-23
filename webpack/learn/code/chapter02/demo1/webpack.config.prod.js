const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]_[chunkhash].js'
    },
    module: {
        rules: [
            {test: /\.js$/, use: ['babel-loader']},
            {
                test: /.s?css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader" ],
            },
            {test: /\.less$/, use: [
                MiniCssExtractPlugin.loader,
                'css-loader', 
                'less-loader'
            ]},
            {test: /.(png|svg|jpg|gif)$/, use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[emoji]_[hash:8].[ext]'
                    }
                }
            ]},
            {test: /.(woff|woff2|eot|ttf|otf)$/, use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            ]},
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
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ 
            template: path.join(__dirname, 'public/index.html'),
            filename: 'index.html',
            chunks: ['index'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        })
    ],
    mode: 'production',
}
