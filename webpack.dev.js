const base = require("./webpack.config");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

base.mode = "development";
base.devtool = "inline-source-map";
base.devServer = { contentBase: './dist' };
base.entry.index = path.resolve(__dirname, "src", "main.ts");
base.plugins.push(new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "src", "main.html")
}));

module.exports = base;
