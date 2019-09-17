const config = [
  {
    mode: "development",
    target: 'electron-main',
    entry: ["@babel/polyfill", "./src/app.js"],
    output: {
      path: __dirname + '/dist/',
      filename: "app.js",
      libraryTarget: "commonjs2"
    },
    node: {
      __dirname: false,
      __filename: false
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-env"]
            }
          }
        }
      ]
    }
  },
  {
    mode: "development",
    target: 'electron-renderer',
    entry: "./src/js/App.js",
    output: {
      path: __dirname + '/dist/js',
      filename: "bundle.js",
      libraryTarget: "commonjs2"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-env"]
            }
          }
        }
      ]
    },
    externals: [
      'electron',
      'fs'
    ]
  }
];

module.exports = config;
