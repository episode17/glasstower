const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackServeWaitpage = require('webpack-serve-waitpage');

const outputPath = path.join(__dirname, '/dist');

module.exports = {
    name: 'client',
    target: 'web',
    mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
    devtool: false,
    // context: path.join(__dirname, '/client'),
    context: __dirname,
    entry: [
        '.',
    ],
    output: {
        path: outputPath,
        filename: '[name].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin([outputPath]),
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
    ],
    stats: 'normal',
    serve: {
        add: (app, middleware, options) => {
            app.use(webpackServeWaitpage(options));
        },
    },
};
