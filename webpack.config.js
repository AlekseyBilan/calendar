'use strict';
const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'development';
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),

    entry: {
        index: './main.js'
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },

    devServer: {
        overlay: true
    },

    watch: NODE_ENV == 'development',

    watchOptions: {
        aggregateTimeout: 300
    },

    devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,

    module: {
        rules:
            [{
                test: /\.html$/,
                use: ['html-loader']
                },
                {
                    test: /\.js$/,
                    use: ['babel-loader']
                },
                {
                    test: /\.scss$/,
                    use: ["style-loader","css-loader","sass-loader"]
            }]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),

        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
};