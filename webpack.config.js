var path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/static/index.html',
            inject: 'head',
            }
        )
    ],

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },

        {
          test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        },

      ]
    },
};
