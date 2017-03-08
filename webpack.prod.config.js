const path              = require('path');
const webpack           = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin      = require('assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './app/index.jsx',
  output: {
    path: __dirname + '/public/assets/',
    publicPath: '/',
    filename: 'js/[name].[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader?importLoaders=1!postcss-loader!sass-loader'
        })
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader!postcss-loader'
        })
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
    new ExtractTextPlugin({
      filename: 'css/[name].[hash].css',
      disable: false,
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin([
      { from: './app/assets/images/', to: './images' }
    ]),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [ // <---- postcss configs go here under LoadOptionsPlugin({ options: { ??? } })
          require('autoprefixer'),
          // require('postcss-modules'),
        ],
        // ...other configs that used to directly on `modules.exports`
      }
    }),
    new AssetsPlugin({
      filename: 'assets-manifest.json',
      path: path.join(__dirname, 'public', 'assets')
    })
  ]
};
