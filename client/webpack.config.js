const webpack = require('webpack');

module.exports = {
  entry: "./app.js",
  output: {
    filename: "../app/assets/javascripts/bundle.js"
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  module: {
    rules: [
      {
        test: /(\.jsx$|\.js$)/,
        exclude: /(node_modules|bower_components|_tests_)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    })
  ]
};
