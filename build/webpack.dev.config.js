'use strict'
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.config');
const copyWebpackPlugin = require('copy-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const friendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    module: {
        rules: utils.styleLoaders(
            {
                sourceMap: config.dev.cssSourceMap, usePostCss: true
            }
        )
    },
    devtool: config.dev.devtool,
    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                {
                    from: /.*/,
                    to: path.posix.join(config.dev.assetsPublicPath, 'index.html'),
                }
            ]
        },
        hot: config.dev.hot,
        contentBase: false, // unnecessary because we are using copy webpack plugin
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? { warnings: false, error: true }
            : false,
        publicPath: config.dev.assetsPublicPath,
        quiet: true, // necessary for friendlyErrorsPlug
        watchOptions: {
            poll: config.dev.poll,
        },
        
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env': require('../config/dev.env')
        // }),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin(), // show correct file names
        // new webpack.NoEmitOnErrorsPlugin(),
        // new htmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: 'index.html',
        //     inject: true
        // }),
        new copyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            },
        ])
    ]
})


// module.exports = merge(baseWebpackConfig, {
//     // mode: 'development',
//     // devtool: 'inline-source-map',
//     output: {
//         filename: 'tyler.mailer.bundle.js',
//         path: path.resolve(__dirname, 'dist-dev')
//     },
//     plugins: [
//         new copyWebpackPlugin([
//             {
//                 // from: path.resolve('./emails/assets/css/*.css'),
//                 // to: path.resolve(__dirname, 'dist-dev/css/[name].[ext]'),
//                 // ignore: ['.*']
//                 from: path.resolve(__dirname, '../static'),
//                 to: config.dev.assetsSubDirectory,
//                 ignore: ['.*']
//             },
//             // {
//             //     from: path.resolve('./emails/assets/img/*.jpg'),
//             //     to: path.resolve(__dirname, 'dist-dev/img/[name].[ext]'),
//             //     ignore: ['.*']
//             // }
//         ])
//     ]
    
// });


module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || Number(config.dev.port);
    portfinder.getPort((err, port) => {
        if(err) {
            reject(err);
        } else {
            process.env.PORT = port;
            
            devWebpackConfig.devServer.port = port;
            
            devWebpackConfig.plugins.push(new friendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is runing here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createMotififierCallback()
                    : undefined
            }))

            resolve(devWebpackConfig);
        }
    })
})