'use strict'
const path = require('path');

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},

        // Dev Server Settings
        host: '127.0.0.1',
        port: 3005,
        autoOpenBrowser: false,
        errorOverlay: true,
        noptifyOnErrors: false,
        poll: true,

        // Source Map
        devtool: 'inline-source-map',
        cacheBusting: true,
        cssSourceMap: true,
    },
    build: {
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',

        // Source Map
        productionSourceMap: true,
        devtool: '#source-map',
        productionGzip: false,
        productionGzipExtentions: ['js', 'css',],
        bundleAnalyzerReport: process.env.npm_config_report
    }
}