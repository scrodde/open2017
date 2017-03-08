const path = require('path');
const webpack = require('webpack');

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    host: "0.0.0.0",
    contentBase: './app',
    port: 8080
  },
  entry: './app/index.jsx',
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: './assets/js/app.js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loaders: [
          'style-loader?sourceMap',
          'css-loader?importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'postcss-loader',
          'resolve-url-loader',
          'sass-loader?sourceMap'
        ]
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loaders: [
          'style-loader?sourceMap',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'env', 'react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [ // <---- postcss configs go here under LoadOptionsPlugin({ options: { ??? } })
          require('autoprefixer'),
          // require('postcss-modules'),
        ],
        // ...other configs that used to directly on `modules.exports`
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
};
