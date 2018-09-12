const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackServeWaitpage = require('webpack-serve-waitpage');

const outputPath = path.join(__dirname, '/public');

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
        new CleanWebpackPlugin([outputPath], {
            exclude: [
                'favicon.ico',
            ],
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
    ],
    stats: 'normal',
    serve: {
        content: path.join(__dirname, '/public'),
        add: (app, middleware, options) => {
            app.use(webpackServeWaitpage(options, {
                disableWhenValid: false,
            }));
        },
    },
};
