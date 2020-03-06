//Not using merge, currently setup in a way that requires config and prod to both contain entire config
//Doesn't output css... need to figure out how
//#Projects for another day

const path = require('path');
//const merge = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        Search: './frontend/SearchTools.ts',
        Permutator: './frontend/Permutator.ts',
        Contact: './frontend/Contact.ts',
    },
    plugins: [
        new HtmlWebpackPlugin({
            excludeChunks: ['Permutator'],
            filename: 'Search.html',
            title: "Bulk Search",
            template: './frontend/Search.html'
        }),
        new HtmlWebpackPlugin({
            excludeChunks: ['Search'],
            filename: 'Permutator.html',
            title: "Permutator",
            template: './frontend/Permutator.html'
        }),
        new HtmlWebpackPlugin({
            includeChunks: ['Contact'],
            filename: 'Contact.html',
            title: "Contact",
            template: './frontend/Contact.html'
        }),
        new HtmlWebpackPlugin({
            includeChunks: ['Resources'],
            filename: 'Resources.html',
            title: "Resources",
            template: './frontend/Resources.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
        ],
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.tsx', '.ts', '.js'],
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'deploy'),
    },
    devServer: {
        inline: false,
        contentBase: './deploy'
    },
}
