const path = require('path');
const nodeExternals = require('webpack-node-externals');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/app.ts',
    node: {
        fs: 'empty',
        net: 'empty'
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new copyWebpackPlugin([
            {
                from: path.resolve('./public/sass/*'),
                to: path.resolve(__dirname, 'dist/sass/[name].[ext]'),
                ignore: ['.*']
            },
            
        ])
    ]

}