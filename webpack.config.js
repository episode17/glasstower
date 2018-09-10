const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    target: 'web',
    devtool: false,
    context: __dirname,
    entry: [
        './client',
    ],
    output: {
        path: path.resolve(__dirname, '/public'),
        filename: '[name].js',
        // publicPath: '/static/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                // options: {
                //     cacheDirectory: false,
                //     babelrc: true,
                // },
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
        new MiniCssExtractPlugin(),
    ],
    stats: 'verbose',
    serve: {},
};
