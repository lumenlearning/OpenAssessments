var webpack           = require('webpack');
var webpackDevServer  = require('webpack-dev-server');
var release           = false;
var settings          = require('./config/settings.js');
var webpackConfig     = require('./config/webpack.config.js')(release);

new webpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  watch: true,
  noInfo: true,
  colors: true,
  inline: true,
  progress: true,
  headers: { "Access-Control-Allow-Origin": "*" },
  filename: "app_wp_bundle.js",
  noInfo: false,
  quiet: false,
}).listen(settings.ports.hotPort, 'localhost', function(err, result){
  if(err){
    console.log('webpack-dev-server', err);
  }
  console.log(webpackConfig.output.filename);
  console.log('Webpack hot load server listening on: ' + webpackConfig.output.publicPath);
});