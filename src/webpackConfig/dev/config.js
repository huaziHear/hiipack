/**
 * @file production环境配置文件
 * @author zdying
 */
"use strict";

var fs = require('fs');
var path = require('path');
var color = require('colors');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var RemoveCssDuplicate = require('../../plugin/webpack/RemoveCssDuplicate');

var utils = require('../../helpers/utils');
var getBabelLoader = require('../utils/getBabelLoader');
var mergeConfig = require('../utils/mergeConfig');
var fixAlias = require('../utils/fixAlias');

module.exports = function(root, userConfig){
    var config = {
        env: 'dev',
        entry: {},
        output: {
            path: root + '/dev',
            filename: '[name]@dev.js',
            hashDigestLength: 32
        },
        module: {
            loaders: [
                getBabelLoader(userConfig, 'dev'),
                { test: /\.css$/, loader: ExtractTextPlugin.extract("css") },
                { test: /\.less$/, loader: ExtractTextPlugin.extract("css!less") },
                { test: /\.scss$/, loader: ExtractTextPlugin.extract("css!sass") }
            ],
            postLoaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['es3ify-loader']
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            /**
             * 提取公共的css
             */
            new ExtractTextPlugin('[name]@dev.css'),

            /**
             * 去除重复的css
             * sass编译出来的代码包含重复的内容(多次import同一个文件,导致同一个文件多次打包)
             */
            new RemoveCssDuplicate()
        ],
        node: {
            fs: "empty"
        },
        resolve: {
            root: root,
            fallback: [path.resolve(__hiipack__.tmpdir, "node_modules")],
            extensions: ['', '.js', '.jsx', '.scss', '.json'],
            alias: fixAlias(userConfig.alias)
        },
        resolveLoader: {
            modulesDirectories: [path.resolve(__hiipack__.root, "node_modules")],
            fallback: [path.resolve(__hiipack__.tmpdir, "node_modules")],
            // extensions: ["", ".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
            // packageMains: ["webpackLoader", "webLoader", "loader", "main"]
        }
    };

    config = mergeConfig(config, userConfig, 'dev', root);

    return config;
};