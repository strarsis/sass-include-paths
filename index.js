var path        = require('path'),
    uniq        = require('uniq'),
    glob        = require('glob'),

    syncExec    = require('sync-exec'),
    Promise     = require('bluebird'),
    globAsync   = Promise.promisify(glob),
    execAsync   = Promise.promisify(require('child_process').exec);


var _runCmdSync = function(cmd) {
  var child = syncExec(cmd);
  if(child.status != 0) {
    throw Error('`' + cmd + '` failed with status ' + child.status + ': ', child.stderr);
  }
  return child;
};
var _rubyGemInfo = {
  getGempath: function(cb) {
    var child = execAsync('gem env gempath')
    .then(function (stdout, stderr) {
      cb(undefined, stdout);
      return;
    })
    .catch(function(err){
      cb(error, undefined);
      return;
    })
    return;
  },
  getGempathSync: function() {
    return _runCmdSync('gem env gempath').stdout;
  }
};

var _trim = function(s){return s.trim();}
var _gemPaths = function(cb) {
  return Promise.promisify(_rubyGemInfo.getGempath)()
  .then(function(gemPath) {
    var gemPaths = gemPath.split(':').map(_trim);
    cb(undefined, gemPaths);
    return;
  });
};
var _gemPathsSync = function() {
  return _rubyGemInfo.getGempathSync()
         .split(':').map(_trim);
};


var sassFoldersGlobStr    = '{stylesheets,sass}';
var sassLibFoldersGlobStr = '{stylesheets,sass,lib}';
var sassFilesGlobStr      = '*.{sass,scss}';
var sassGemsGlobStr       = path.join('gems/*', sassFoldersGlobStr);

var nodeModules = function(nodeModulesDir) {
  if(!nodeModulesDir) { nodeModulesDir = './node_modules'; }
  return Promise.join(
    globAsync(path.join(nodeModulesDir, '*')), // in some rare cases the styles may be directly in module folder
    globAsync(path.join(nodeModulesDir, '*', sassLibFoldersGlobStr, sassFilesGlobStr))
  )
  .then(function(args) {
    var scssNodePaths1Glob = args[0],
        scssNodePaths2Glob = args[1],
        scssNodePaths      = scssNodePaths1Glob.concat(scssNodePaths2Glob),
        scssNodePathsDirs  = uniq(scssNodePaths.map(path.dirname));
    return scssNodePathsDirs;
  });
};
var nodeModulesSync = function(nodeModulesDir) {
  if(!nodeModulesDir) { nodeModulesDir = './node_modules'; }
  var scssNodePaths1Glob = glob.sync(path.join(nodeModulesDir, '*')), // in some rare cases the styles may be directly in module folder
      scssNodePaths2Glob = glob.sync(path.join(nodeModulesDir, '*', sassLibFoldersGlobStr, sassFilesGlobStr)),
      scssNodePaths      = scssNodePaths1Glob.concat(scssNodePaths2Glob),
      scssNodePathsDirs  = uniq(scssNodePaths.map(path.dirname));
  return scssNodePathsDirs;
};

var rubyGemsBundle  = function(basePath) {
  if(!basePath) { basePath = './vendor/bundle'; }
  return globAsync(path.join(basePath, 'ruby/**', sassGemsGlobStr), {});
};
var rubyGemsBundleSync = function(basePath) {
  if(!basePath) { basePath = './vendor/bundle'; }
  return glob.sync(path.join(basePath, 'ruby/**', sassGemsGlobStr), {});
};

var rubyGems = function(cb) {
  return Promise.promisify(_gemPaths)()
  .then(function(gemPaths) {
    var gemPathsGlob = '{' +
    gemPaths.map(function(gemPath){
      return path.join(gemPath, sassGemsGlobStr);
    })
    .join(',') +
    '}';

    return globAsync(gemPathsGlob, {});
  });
};
var rubyGemsSync = function() {
  var gemPaths = _gemPathsSync();
  var gemPathsGlob = '{' +
  gemPaths.map(function(gemPath){
    return path.join(gemPath, sassGemsGlobStr);
  })
  .join(',') +
  '}';

  return glob.sync(gemPathsGlob, {});
};

var bowerComponents = function(basePath) {
  if(!basePath) { basePath = './bower_components'; }
  return globAsync(path.join(basePath, '*', sassFoldersGlobStr), {});
};
var bowerComponentsSync = function(basePath) {
  if(!basePath) { basePath = './bower_components'; }
  return glob.sync(path.join(basePath, '*', sassFoldersGlobStr), {});
};


module.exports.nodeModules         = nodeModules;
module.exports.nodeModulesSync     = nodeModulesSync;

module.exports.rubyGems            = rubyGems;
module.exports.rubyGemsSync        = rubyGemsSync;

module.exports.rubyGemsBundle      = rubyGemsBundle;
module.exports.rubyGemsBundleSync  = rubyGemsBundleSync;

module.exports.bowerComponents     = bowerComponents;
module.exports.bowerComponentsSync = bowerComponentsSync;
