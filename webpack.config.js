const webpack = require("webpack");
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let config = {
    entry: [
        "./app/app.jsx",
        "./app/styles/index.scss"
    ],
    plugins: [
        new ExtractTextPlugin({
            filename:'style.css',
            allChunks: true
        })
    ],
    output: {path: __dirname + '/public', filename: 'bundle.js'},
    resolve: {

        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    plugins: [ 'transform-decorators-legacy', "transform-class-properties" ],
                    presets: ['react', 'es2015', 'stage-0'],
                }
            },
            {
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
            }

        ],
    },
    devtool: "cheap-module-eval-source-map"
};

module.exports = config;