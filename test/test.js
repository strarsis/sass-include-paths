'use strict';

var test     = require('tape'),
    sassImp  = require('../');


var path      = require('path'),
    pathIsAbs = require('path-is-absolute');
var makePathAbsolute = function(pathStr) {
  if(pathIsAbs(pathStr)) {
    return pathStr;
  }
  var dirnameIndex = path.resolve(__dirname, '..');
  return path.join(dirnameIndex, pathStr);
};


var testPathsAsync = function(t, fnAsync, paths, opts) {
  fnAsync(opts).then(function(actualPaths){ t.deepEqual(actualPaths, paths); });
};
var testPathsSync = function(t, fnSync, paths, opts) {
  t.deepEqual(fnSync(opts), paths);
}
var testPaths = function(t, fnAsync, fnSync, paths, opts) {
  testPathsAsync(t, fnAsync, paths, opts);
  testPathsSync(t, fnSync, paths, opts);
}

var testRel = function(t, fnAsync, fnSync, pathsExpectedRel) {
  testPaths(t, fnAsync, fnSync, pathsExpectedRel, {absolute: false});
};
var testAbs = function(t, fnAsync, fnSync, pathsExpectedRel) {
  var pathsExpectAbs = pathsExpectedRel.map(makePathAbsolute);
  testPaths(t, fnAsync, fnSync, pathsExpectAbs, {absolute: true});
};

var testFull = function(t, fnAsync, fnSync, pathsExpectedRel) {
  testRel(t, fnAsync, fnSync, pathsExpectedRel);
  testAbs(t, fnAsync, fnSync, pathsExpectedRel);
};


test('works with node_modules', function (t) {

  // (in this package dev dependencies)
  // $ npm install eyeglass-math@1.0.1
  // $ npm install modularscale-sass@2.1.1

  t.plan(4);
  testFull(t, sassImp.nodeModules, sassImp.nodeModulesSync, [
    'node_modules/bootstrap-sass/assets/stylesheets',
    'node_modules/eyeglass-math/sass',
    'node_modules/font-awesome/scss',
    'node_modules/modularscale-sass/stylesheets',
    'node_modules/normalize-scss/sass',
    'node_modules/sassline/assets/sass',
    'node_modules/scut/dist',
    'node_modules/support-for/sass'
  ]);
});


test('works with local ruby bundle', function (t) {

  // $ rvm ruby-2.2.3@sass-include-paths --create
  // (in this package Gemfile)
  // modular-scale  2.1.1
  // toolkit        2.9.0

  // $ gem install bundler # important for bundler+rake
  // $ bundle install --path vendor/bundle

  t.plan(4);
  testFull(t, sassImp.rubyGemsBundle, sassImp.rubyGemsBundleSync, [
    'vendor/bundle/ruby/2.2.0/gems/compass-core-1.0.3/stylesheets',
    'vendor/bundle/ruby/2.2.0/gems/modular-scale-2.1.1/stylesheets',
    'vendor/bundle/ruby/2.2.0/gems/toolkit-2.9.0/stylesheets'
  ]);
});


test('works with bower components folder', function (t) {

  // (in this package bower.json
  // modular-scale  2.1.1

  // $ npm install -g bower
  // $ bower install

  t.plan(4);
  testFull(t, sassImp.bowerComponents, sassImp.bowerComponentsSync, [
    'bower_components/modular-scale/stylesheets',
    'bower_components/sass-toolkit/stylesheets'
  ]);
});

/*
test('works with global ruby gems', function (t) {

  // $ rvm ruby-2.2.3@sass-include-paths --create
  // $ gem install modular-scale -v 2.1.1
  // $ gem install toolkit       -v 2.9.0

  // Always uses absolute paths.

  t.plan(2);
  testAbs(t, sassImp.rubyGems, sassImp.rubyGemsSync, [
    '/home/build/.rvm/gems/ruby-2.2.3@sass-include-paths/gems/compass-core-1.0.3/stylesheets',
    '/home/build/.rvm/gems/ruby-2.2.3@sass-include-paths/gems/modular-scale-2.1.1/stylesheets',
    '/home/build/.rvm/gems/ruby-2.2.3@sass-include-paths/gems/toolkit-2.9.0/stylesheets'
  ]);
});
*/
