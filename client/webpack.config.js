const webpack = require('webpack');

module.exports = {
  entry: "./app.js",
  output: {
    filename: "../../app/assets/javascripts/bundle.js"
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css']
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
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
        ]
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
