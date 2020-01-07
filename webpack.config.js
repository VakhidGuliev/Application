const path = require(`path`);
const webpack = require("webpack");
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: "./src/main.js",
        app:  "./src/app.js",
    },
    output: {
        filename: `[name].bundle.js`,
        path: path.join(__dirname, `public`),
    },
    // module: {
    //   rules: [
    //     {
    //       test: /\.m?js$/,
    //       exclude: /(node_modules|bower_components)/,
    //       use: {
    //         loader: 'babel-loader',
    //         options: {
    //           presets: ['@babel/preset-env'],
    //           plugins : ['@babel/plugin-proposal-class-properties']
    //         }
    //       }
    //     }
    //   ]
    // },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [`style-loader`, `css-loader`],
            }
        ],
    },
    devtool: `source-map`,
    devServer: {
        historyApiFallback: {
            index: 'auth.html'
        },
        contentBase: path.join(__dirname, `public`),
        compress: true,
        port: 8080,
        watchContentBase: true,
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'windows.jQuery': 'jquery',
        }),
        // new HtmlWebpackPlugin({
        //     title: 'auth',
        //     template: 'public/auth.html'
        // })
    ]
};
