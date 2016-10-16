const includeKeyShort = '-I';
module.exports = function(includePaths) {
  if(!Array.isArray(includePaths)) {
    throw Error('Argument is not an Array.');
  }
  return includePaths.map(function(includePath) {
    return includeKeyShort + ' ' + includePath;
  }).join(' ');
};

//console.log(sasscIncludeArgs(['test1', 'test2']));
