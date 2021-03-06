
const isMinify = process.argv.indexOf('-p') !== -1
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
require('es6-promise').polyfill();

var npm = require("../package.json");

module.exports = {

  entry: __dirname + '/../src/index.js',

  output: {
    path: __dirname + '/../dist/',
    publicPath: '../dist/',
    filename: 'redux-runner' + (isMinify ? '.min' : '') + '.js',
    libraryTarget: "umd",
    library: "Redux Runner"
  },

  module: {

    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
      },
    ]
  },

  plugins: [

    new webpack.BannerPlugin((
      [
        "Copyright (c) Naufal Rabbani (http://github.com/BosNaufal)",
        "\n",
        "Licensed Under MIT (http://opensource.org/licenses/MIT)",
        "\n",
        "\n",
        "Redux Runner @ Version "+ npm.version,
        "\n"
      ])
      .join("")),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),

  ]

};
