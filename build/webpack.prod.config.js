'use strict'
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.config');
const copyWebpackPlugin = require('copy-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const optimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');

const env = require('../config/prod.env');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: utils.styleLoaders(
            {
                sourceMap: config.build.productionSourceMap,
                extract: true,
                userPostCSS: true
            }
        )
    },
    devtool: config.build.productionSourceMap
        ? config.build.devtool
        : false,
    output: {
        path: config.build.assetsRoot,
        filename:utils.assetsPath('../[name].js'),
        chunkFilename: utils.assetsPath('js/[id].js')
    },
    optimization: {
        minimizer: [new uglifyJsPlugin({
        })],
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              }
            }
          }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new extractTextPlugin({
            filename: utils.assetsPath('css/[name].[md5:contenthash:hex:20].css'),            
            allChunks: true    
        }),
        new optimizeCssPlugin({
            cssProcessorOptions: config.build.productionSourceMap
                ? { safe: true, map: { inline: false }}
                : { safe: true }
        }),
        new htmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),
        // keep vendor module.id the same
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new copyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../src/assets/css/*'),
                to: 'static/css/[name].css',
                ignore: ['.*']
            }

        ])
    ]
})

if(config.build.productionGzip) {
    const compressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(
        new compressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
               `\\.(${config.build.productionGzipExtentions.join('|')}$)`
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if(config.build.bundleAnalyzerReport) {
    const bundleAnalyzerReport = require('webpack-bundle-analyzer')
        .BundleAnalyzerPlugin;
    
    webpackConfig.plugins.push(new bundleAnalyzerReport());
}

module.exports = webpackConfig;