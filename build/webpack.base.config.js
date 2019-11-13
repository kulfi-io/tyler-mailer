const path = require('path');
const nodeExternals = require('webpack-node-externals');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, '../'),
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
                from: path.resolve('./public/css/*'),
                to: path.resolve(__dirname, '../app/css/[name].[ext]'),
                ignore: ['.*']
            },
            {
                from: path.resolve('./emails/note/*'),
                to: path.resolve(__dirname, '../app/emails/note/[name].[ext]'),
                ignore: ['.*']
            },
            {
                from: path.resolve('./emails/password-reset/*'),
                to: path.resolve(__dirname, '../app/emails/password-reset/[name].[ext]'),
                ignore: ['.*']
            },
            {
                from: path.resolve('./emails/register/*'),
                to: path.resolve(__dirname, '../app/emails/register/[name].[ext]'),
                ignore: ['.*']
            },
            {
                from: path.resolve('./emails/shared/*'),
                to: path.resolve(__dirname, '../app/emails/shared/[name].[ext]'),
                ignore: ['.*']
            }

            
        ])
    ]

}