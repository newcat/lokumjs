const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: "production",
    entry: {
        lib: path.resolve(__dirname, "src", "lib.ts")
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src")
        },
        extensions: ['.ts', '.js', '.vue']
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: `(typeof self !== 'undefined' ? self : this)`,
        path: path.resolve(__dirname, 'dist'),
        library: 'LokumJS'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
        })
    ]
};
