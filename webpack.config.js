const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: './js/app',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: './template.html'
    }),
    new CleanPlugin(['dist'])
  ]
};

module.exports = (env, options) => {
  const production = options.mode === 'production';
  const styleLoaders = [
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true
      }
    },
    'resolve-url-loader',
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }
  ];

  config.devtool = production ? 'source-map' : 'eval-sourcemap';

  config.module.rules.push({
    test: /\.(scss|sass)$/,
    use: production ? ExtractTextPlugin.extract({fallback: 'style-loader', use: styleLoaders}) : [].concat('style-loader', styleLoaders)
  });

  if (!production) {
    config.devServer = {
      hot: true,
      contentBase: './dist'
    };

    config.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
  } else {
    config.plugins.push(
      new ExtractTextPlugin({
        filename: 'styles.css'
      })
    );
  }

  return config;
};
