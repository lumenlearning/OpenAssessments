var webpack           = require('webpack');
var release           = true;
var settings          = require('./config/settings.js');
var webpackConfig     = require('./config/webpack.config.js')(release);

//webpack(webpackConfig);


webpack(webpackConfig, function (err, stats){
  if(err){
    console.log(err);
  }
});