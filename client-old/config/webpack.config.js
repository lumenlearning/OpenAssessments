'use strict';

var webpack             = require('webpack');
var path                = require('path');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var settings            = require('./settings.js');

module.exports = function(release){

  var excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/
  ];

  var autoprefix = '{browsers:["Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", "Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';
  var jsLoaders = ["babel-loader?stage=0&optional=runtime"];

  var cssLoaders = ['style-loader', 'css-loader', 'autoprefixer-loader?' + autoprefix];

  var scssLoaders = cssLoaders.slice(0);
    scssLoaders.push('sass-loader?outputStyle=expanded&includePaths[]=' + (path.resolve(__dirname, './node_modules/bootstrap-sass')));

  var lessLoaders = cssLoaders.slice(0);
      lessLoaders.push("less-loader");
 
  var entries;

  if(release){
    entries = settings.scripts.paths.entries;
  } else {
    jsLoaders.unshift("react-hot-loader");

    // Configure entries with hotloader
    var originalEntries = settings.scripts.paths.entries;
    entries = {};
    for(var name in originalEntries){
      entries[name] = ['webpack-dev-server/client?' + settings.devAssetsUrl, 'webpack/hot/only-dev-server', originalEntries[name]];
    }
  }

  var cssEntries = settings.styles.paths.entries;
  for(var name in cssEntries){
    entries[name] = cssEntries[name];
  }

  return {
    context: __dirname,
    entry: entries,
    output: {
      path: release ? settings.prodOutput : settings.devOutput,
      filename: '[name]_web_pack_bundle.js',
      //filename: release ? '[name]-[chunkhash]_web_pack_bundle.js' : '[name]_web_pack_bundle.js',
      //chunkFilename: release ? '[id]-[chunkhash]_web_pack_bundle.js' : "[id].js",
      publicPath: release ? settings.scripts.paths.relativeOutput.prod : settings.devAssetsUrl + settings.devRelativeOutput,
      sourceMapFilename: "debugging/[file].map",
      pathinfo: !release // http://webpack.github.io/docs/configuration.html#output-pathinfo
    },
    resolve: {
      extensions: ['', '.js', '.json', '.jsx'],
      modulesDirectories: ["node_modules", "vendor"]
    },
    cache: true,
    quiet: false,
    noInfo: false,
    debug: false,
    outputPathinfo: !release,
    devtool: release ? false : "eval",  // http://webpack.github.io/docs/configuration.html#devtool
    stats: {
      colors: true
    },
    plugins: release ? [
      new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
      new webpack.optimize.DedupePlugin(),
      //new webpack.optimize.UglifyJsPlugin({sourceMap: false}),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new ChunkManifestPlugin({
        filename: 'webpack-common-manifest.json',
        manfiestVariable: 'webpackBundleManifest'
      })
      //new ExtractTextPlugin("[name]_web_pack_bundle.css"),
      //new webpack.optimize.CommonsChunkPlugin('init.js') // Use to extract common code from multiple entry points into a single init.js
    ] : [
      //new ExtractTextPlugin("[name]_web_pack_bundle.css"),
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"', '__DEV__': true }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
    module: {
      loaders: [
        { test: /\.js$/,              loaders: jsLoaders, exclude: /node_modules/ },
        { test: /\.jsx?$/,            loaders: jsLoaders, exclude: /node_modules/ },
        { test: /\.scss$/,            loader: scssLoaders.join('!') },
        { test: /\.css$/ ,            loader: cssLoaders.join('!') },
        { test: /\.less$/ ,           loader: lessLoaders.join('!') },
        //{ test: /\.html$/,            loader: 'webpack-compile-templates' }, // Add if you need to compile underscore.js - https://www.npmjs.com/package/webpack-compile-templates
        //{ test: /.*\.(gif|png|jpg|jpeg|svg)$/, loaders: ['file?hash=sha512&digest=hex&size=16&name=[hash].[ext]', 'image-webpack-loader?optimizationLevel=7&interlaced=false']},
        //{ test: /.*\.(eot|woff2|woff|ttf)/,    loader: 'file?hash=sha512&digest=hex&size=16&name=cd [hash].[ext]'}
        { test: /\.(png|woff|woff2|eot|ttf|svg)($|\?)/, loader: 'url-loader' }
      ]
    },
    devServer: {
      stats: {
        cached: false,
        exclude: excludeFromStats
      }
    }
  };
};
