const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackServeWaitpage = require('webpack-serve-waitpage');

const outputPath = path.join(__dirname, '/dist');

module.exports = {
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
        publicPath: '/static/',
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
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin([outputPath]),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
    ],
    stats: 'verbose',
    serve: {
        add: (app, middleware, options) => {
            // Be sure to pass the options argument from the arguments
            app.use(webpackServeWaitpage(options));

            // Make sure the usage of webpack-serve-waitpage will be before the following commands if exists
            // middleware.webpack();
            // middleware.content();
        },
    },
};
