'use strict'
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const nodeExternals = require('webpack-node-externals');
const cleanWebpackPlugin = require('clean-webpack-plugin');


function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    // entry: './src/index.ts',
    // node: {
    //     fs: 'empty',
    //     net: 'empty'
    // },
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/index.ts'
    },
    externals: [nodeExternals()],
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                exclude: /node_modules/,
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    plugins: [
        // new cleanWebpackPlugin(),
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}

// module.exports = {
//     context: path.resolve(__dirname, '../'),
//     entry: {
//         app: './src/index.ts'
//     },
//     externals: [nodeExternals()],
//     output: {
//         path: config.build.assetsRoot,
//         filename: '[name].js',
//         publicPath: process.env.NODE_ENV === 'production'
//             ? config.build.assetsPublicPath
//             : config.dev.assetsPublicPath
//     },
//     resolve: {
//         extensions: ['.tsx', '.ts', '.js', '.json'],
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.tsx?$/,
//                 loader: 'ts-loader',
//                 exclude: /node_modules/,
//             },
//             {
//                 test: /\.js$/,
//                 loader: 'babel-loader',
//                 include: [
//                     resolve('src'),
//                     resolve('test'),
//                     resolve('node_modules/webpack-dev-server/client')
//                 ],
//                 exclude: /node_modules/,
//             },
//             {
//                 test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
//                 loader: 'url-loader',
//                 exclude: /node_modules/,
//                 options: {
//                     limit: 10000,
//                     name: utils.assetsPath('img/[name].[hash:7].[ext]')
//                 }
//             },
//             {
//                 test: /\.(mp4|webm|logg|mp3|wav|flac|aac)(\?.*)?$/,
//                 loader: 'url-loader',
//                 options: {
//                     limit: 10000,
//                     name: utils.assetsPath('media/[name].[hash:7].[ext]')
//                 }
//             },
//             {
//                 test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
//                 loader: 'url-loader',
//                 options: {
//                     limit: 10000,
//                     name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
//                 }
//             },
//             {
//                 test: /\.pug$/,
//                 oneOf: [
//                     {
//                         exclude: /\.vue$/,
//                         use: ['pug-plain-loader']
//                     },
//                     {
//                         use: ['pug-plain-loader']
//                     }
//                 ]
//             },
            
//         ]
//     },
//     node: {
//         // prevent webpack from injecting useless setImmediate polyfill because Vue
//         // source contains it (although only uses it if it's native).
//         setImmediate: false,
//         // prevent webpack from injecting mocks to Node native modules
//         // that does not make sense for the client
//         dgram: 'empty',
//         fs: 'empty',
//         net: 'empty',
//         tls: 'empty',
//         child_process: 'empty'
//     }

// }