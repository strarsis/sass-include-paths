var Promise   = require('bluebird'),
    syncExec  = require('sync-exec'),
    execAsync = Promise.promisify(require('child_process').exec);

var _runCmdSync = function(cmd) {
  var child = syncExec(cmd);
  if(child.status != 0) {
    throw Error('`' + cmd + '` failed with status ' + child.status + ': ', child.stderr);
  }
  return child;
};

var rubyInfo = {
  getGempath: function(cb) {
    var child = execAsync('gem env gempath')
    .then(function (stdout, stderr) {
      cb(undefined, stdout);
      return;
    })
    .catch(function(err){
      cb(error, undefined);
      return;
    });
    return;
  },
  getGempathSync: function() {
    return _runCmdSync('gem env gempath').stdout;
  }
};
rubyInfo.getGempathAsync = Promise.promisify(rubyInfo.getGempath);

var _trim = function(s){return s.trim();}
var _gemPaths = function(cb) {
  return rubyInfo.getGempathAsync()
  .then(function(gemPath) {
    var gemPaths = gemPath.split(':').map(_trim);
    cb(undefined, gemPaths);
    return;
  });
};
rubyInfo.gemPathsAsync = Promise.promisify(_gemPaths);
rubyInfo.gemPathsSync  = function() {
  return rubyInfo.getGempathSync()
         .split(':').map(_trim);
};

module.exports = rubyInfo;
