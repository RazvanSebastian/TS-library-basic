const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  target: ["web"],
  entry: {
    utils: "./src/utils/index.ts",
    test: "./src/test/index.ts",
    models: "./src/models/index.ts",
  },
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                target: "es2015",
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    usedExports: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          sourceMap: true,
          format: {
            comments: /@license/i,
          },
        },
        extractComments: false,
      }),
    ],
  },
  output: {
    filename: "[name].js",
    library: {
      type: "module",
    },
    path: path.resolve(__dirname, "./dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        mode: "write-dts",
      },
    }),
    new ESLintPlugin({
      extensions: ["ts", "js"],
      emitWarning: false,
      context: path.resolve("src"),
    }),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // include specific files based on a RegExp
      include: /\.ts$/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
  ],
  ignoreWarnings: [/Failed to parse source map from/],
};
