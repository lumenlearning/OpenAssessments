// require all modules ending in ".spec.js" from the
// current directory and all subdirectories
var context = require.context("./js", true, /\.spec\.js$/);
context.keys().forEach(context);