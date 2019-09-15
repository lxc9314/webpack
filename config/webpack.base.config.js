const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const Fiber = require("fibers")
const dartSass = require("sass")

const fileLoaderOpt = options =>
  Object.assign(
    {
      publicPath: "static",
      outputPath: "static",
      limit: 1000
    },
    options
  )

const isDev = () => process.env.NODE_ENV === "development"

module.exports = {
  entry: {
    index: [
      ...[
        isDev() ? "react-hot-loader/patch" : "",
        "@babel/polyfill",
        "./src/index"
      ].filter(item => !!item),
    ]
  },
  stats: {
    entrypoints: false,
    children: false
  },
  output: {
    pathinfo: true,
    path: path.join(__dirname, "dist"),
    filename: "build.js",
    publicPath: "/"
  },
  plugins: [
    // css 提取
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      allChunks: true
    })
  ],
  resolve: {
    extensions: [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".mjs",
      ".json",
      ".gql",
      ".graphql"
    ],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      types: path.resolve(__dirname, "../types"),
      src: path.resolve(__dirname, "../src"),
      "@mock": path.resolve(__dirname, "../mock")
    }
  },
  module: {
    rules: [
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          isDev()
            ? { loader: "style-loader", options: { sourceMap: true } }
            : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: isDev(),
              localIdentName: "[local]-[hash:base64:10]"
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('autoprefixer')({
                  browsers: [
                    'last 10 Chrome versions',
                    'last 5 Firefox versions',
                    'Safari >= 6',
                    'ie > 8'
                  ]
                })
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              implementation: dartSass,
              fiber: Fiber
            }
          }
        ]
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      browsers: ["last 2 version", "ie >= 11"],
                      node: "10.15.0"
                    }
                  }
                ],
                "@babel/preset-react",
                "@babel/preset-typescript"
              ],
              plugins: [
                ["graphql-tag"],
                ["react-hot-loader/babel"],
                ["babel-plugin-styled-components"],
                [
                  "react-css-modules",
                  {
                    generateScopedName: "[local]-[hash:base64:10]",
                    webpackHotModuleReloading: true,
                    handleMissingStyleName: "ignore",
                    filetypes: {
                      ".scss": {
                        syntax: "postcss-scss",
                        plugins: ["postcss-nested"]
                      }
                    }
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader"
        }
      },
      {
        test: /\.svg$/,
        issuer: {
          test: /\.tsx?$/
        },
        use: ["babel-loader", "@svgr/webpack", "url-loader"]
      },
      {
        test: /\.svg$/,
        issuer: {
          test: /\.s?css$/
        },
        loader: "url-loader"
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: "url-loader",
        options: fileLoaderOpt({
          name: "img/[name].[hash:7].[ext]"
        })
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: fileLoaderOpt({
          name: "media/[name].[hash:7].[ext]"
        })
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: fileLoaderOpt({
          name: "fonts/[name].[hash:7].[ext]"
        })
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }
    ]
  },
  watchOptions: {
    ignored: /dist/
  }
}
