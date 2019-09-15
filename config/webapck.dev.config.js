const baseWebpackConfig = require("./webpack.base.config");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: "127.0.0.1",
    port: "8001",
    proxy: {
      '/templates': {
        target: 'http://127.0.0.1:3000',
        pathRewrite: { '^/templates': '' },
        secure: false,
      },
      '/browser-sync': {
        target: 'http://127.0.0.1:3000/browser-sync',
        pathRewrite: { '^/browser-sync': '' },
        secure: false,
      }
    },
    contentBase: path.join(__dirname, "../hot")
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "index.ts.tsx",
      template: path.resolve(__dirname, "../public/index.html"),
      filename: path.resolve(__dirname, "../hot/index.html")
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../public"),
        to: "public"
      }
    ])
  ],
  output: {
    path: path.join(__dirname, "../hot"),
    filename: "build.js"
  },
  performance: {
    hints: "warning",
    maxEntrypointSize: 50000000,
    maxAssetSize: 50000000
  }
});
