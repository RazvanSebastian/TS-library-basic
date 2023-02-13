const path = require('path');
const productionConfig = require('./webpack.prod');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    ...productionConfig,
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, '/dist'),
        },
        compress: true,
        port: 9000,
    },
    plugins: [...productionConfig.plugins,
        new HtmlWebpackPlugin({
                project: 'common-utility-web-starter',
                filename: 'index.html',
                template: 'index_template.html',
            }
        ),
    ]
}
