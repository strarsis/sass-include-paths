#!/usr/bin/env node
'use strict';

var Promise          = require('bluebird'),
    flatten          = require('array-flatten'),
    yargs            = require('yargs'),
    sassIncludePaths = require('./'),
    sasscIncludeArgs = require('./lib/sassc-include-args');

var argv = yargs

    .alias('v', 'version')
    .version(function() { return require('./package').version; })

    .boolean('node_modules')
    .boolean('bower_components')
    .boolean('ruby-gems-bundle')
    .boolean('ruby-gems-system')
    .boolean('sassc')

    .argv;

if(!argv['node_modules']     && 
   !argv['bower_components'] && 
   !argv['ruby-gems-bundle'] && 
   !argv['ruby-gems-system']) {
  console.error('Warning: No include path sources selected by user.');
  console.error('--sassc, --node_modules, --bower_components, --ruby-gems-bundle, --ruby-gems-system');
}


var getIncludePaths  = [];
if(argv['node_modules']) {
  getIncludePaths.push(sassIncludePaths.nodeModules());
}
if(argv['bower_components']) {
  getIncludePaths.push(sassIncludePaths.bowerComponents());
}
if(argv['ruby-gems-bundle']) {
  getIncludePaths.push(sassIncludePaths.rubyGemsBundle());
}
if(argv['ruby-gems-system']) {
  getIncludePaths.push(sassIncludePaths.rubyGemsSystem());
}


Promise.all(getIncludePaths)
.then(function(gotIncludePaths) {
  return flatten(gotIncludePaths);
})
.then(function(includePaths) {
  if(includePaths.length == 0) {
    console.error('Warning: No include paths were found/passed!');
  }

  if(argv.sassc) {
    console.log(sasscIncludeArgs(includePaths));
    return;
  }
  console.log(includePaths);
});
