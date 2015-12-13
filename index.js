'use strict';

require('es6-shim'); // Object.assign (node 0.12.0)

var path      = require('path'),
    uniq      = require('uniq'),
    glob      = require('glob'),
    globSync  = glob.sync,
    Promise   = require('bluebird'),
    globAsync = Promise.promisify(glob),
    rubyInfo  = require('./rubyInfo');


var _opts = function(opts, defaults) {
  var args = Object.assign(defaults, opts);
  if( args.absolute == undefined) { args.absolute = defaults.absolute; }
  if(!args.basePath) { args.basePath = defaults.basePath; }
  if( args.absolute) { args.basePath = path.join(__dirname, args.basePath); }
  return args;
};


var sassFoldersGlobStr    = '{stylesheets,sass}';
var sassLibFoldersGlobStr = '{stylesheets,sass,lib,dist,assets/sass}';
var sassFilesGlobStr      = '*.{sass,scss}';
var sassGemsGlobStr       = path.join('gems/*', sassFoldersGlobStr);

var _nodeModulesGlobStr = function(opts) {
  var args = _opts(opts, {basePath: './node_modules', absolute: false});
  // in some rare cases the styles are directly inside the module folder
  var globStr1 = path.join(args.basePath, '*',                        sassFilesGlobStr);
  var globStr2 = path.join(args.basePath, '*', sassLibFoldersGlobStr, sassFilesGlobStr);
  var globStr  = '{' + [ globStr1, globStr2 ].join(',') + '}';
  return globStr;
};
var nodeModules = function(opts) {
  return globAsync(_nodeModulesGlobStr(opts))
  .then(function(scssNodePaths) {
    var scssNodePathsDirs = uniq(scssNodePaths.map(path.dirname));
    return scssNodePathsDirs;
  });
};
var nodeModulesSync     = function(opts) {
  var scssNodePaths     = globSync(_nodeModulesGlobStr(opts));
  var scssNodePathsDirs = uniq(scssNodePaths.map(path.dirname));
  return scssNodePathsDirs;
};


var _rubyGemsBundleGlobStr = function(opts) {
  var args    = _opts(opts, {basePath: './vendor/bundle', absolute: false});
  var globStr = path.join(args.basePath, 'ruby/*', sassGemsGlobStr)
  return globStr;
};
var rubyGemsBundle  = function(opts) {
  return globAsync(_rubyGemsBundleGlobStr(opts), {});
};
var rubyGemsBundleSync = function(opts) {
  return globSync(_rubyGemsBundleGlobStr(opts), {});
};


var _bowerComponentsGlobStr = function(opts) {
  var args    = _opts(opts, {basePath: './bower_components', absolute: false});
  var globStr = path.join(args.basePath, '*', sassFoldersGlobStr)
  return globStr;
};
var bowerComponents = function(opts) {
  return globAsync(_bowerComponentsGlobStr(opts), {});
};
var bowerComponentsSync = function(opts) {
  return globSync(_bowerComponentsGlobStr(opts), {});
};


// always uses absolute paths and determined base path (system installed)
var _rubyGemsGlobStr = function(gemPaths) {
  var globStr   =
  '{' +
    gemPaths.map(function(gemPath){
      return path.join(gemPath, sassGemsGlobStr);
    }).join(',') +
  '}';
  return globStr;
};
var rubyGems = function(cb) {
  return rubyInfo.gemPathsAsync()
  .then(function(gemPaths) {
    return globAsync(_rubyGemsGlobStr(gemPaths), {});
  });
};
var rubyGemsSync = function() {
  var gemPaths   = rubyInfo.gemPathsSync();
  return globSync(_rubyGemsGlobStr(gemPaths), {});
};


module.exports.nodeModules         = nodeModules;
module.exports.nodeModulesSync     = nodeModulesSync;

module.exports.rubyGems            = rubyGems;
module.exports.rubyGemsSync        = rubyGemsSync;

module.exports.rubyGemsBundle      = rubyGemsBundle;
module.exports.rubyGemsBundleSync  = rubyGemsBundleSync;

module.exports.bowerComponents     = bowerComponents;
module.exports.bowerComponentsSync = bowerComponentsSync;
