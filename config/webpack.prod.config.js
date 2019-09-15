const path = require('path');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const DIST_PATH = path.resolve(__dirname, '../dist');
const PUBLIC_PATH = path.resolve(__dirname, '../public');
const CI_PATH = path.resolve(__dirname, '../ci');

module.exports = merge(baseWebpackConfig, {
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js',
    publicPath: ""
  },
  mode: "production",
  plugins: [
    // 定义常量
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // 清理dist目录
    new CleanWebpackPlugin(),
    // js压缩
    new TerserPlugin({
      terserOptions: {
        compress: {
          warnings: false
        }
      },
      parallel: true
    }),
    // 动态生成html
    new HtmlWebpackPlugin({
      filename: path.join(process.cwd(), 'dist/index.html'),
      template: './public/index.html',
      inject: true,
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    // 将静态资源copy到dist目录
    new CopyWebpackPlugin([
      {
        from: `${CI_PATH}/health.html`,
        to: DIST_PATH
      },
      {
        from: `${PUBLIC_PATH}`,
        to: DIST_PATH,
        ignore: ['index.ts.tsx.html']
      }
    ]),
    new webpack.HashedModuleIdsPlugin()
  ]
});

