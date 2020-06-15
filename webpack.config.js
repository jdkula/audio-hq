const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv !== 'development';

module.exports = {
  entry: "./server/index.ts",
  mode: "development",
  devtool: "inline-source-map",
  name: "server",
  target: "node",
  externals: [
    nodeExternals()
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          context: path.resolve(__dirname, "server"),
          configFile: path.resolve(__dirname, "server", "tsconfig.json")
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "~": path.resolve(__dirname, "server")
    }
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist")
  }
}
