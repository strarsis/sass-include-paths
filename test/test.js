var test      = require('tape'),
    sassImp   = require('../');

test('works with node_modules', function (t) {
  t.plan(1);

  // (in this package dev dependencies)
  // $ npm install eyeglass-math@1.0.1
  // $ npm install modularscale-sass@2.1.1

  sassImp.nodeModules()
  .then(function(paths) {
    t.deepEqual(paths, [
      'node_modules',
      'node_modules/eyeglass-math/sass',
      'node_modules/modularscale-sass/stylesheets',
    ]);
  });
});

test('works with local ruby bundle', function (t) {
  t.plan(1);

  // $ rvm use ruby-2.2.3
  // (in this package Gemfile)
  // modular-scale  2.1.1
  // toolkit        2.9.0

  // $ gem install bundler
  // $ bundle install --path vendor/bundle

  sassImp.rubyGemsBundle()
  .then(function(paths) {
    t.deepEqual(paths, [
      'vendor/bundle/ruby/2.2.0/gems/compass-core-1.0.3/stylesheets',
      'vendor/bundle/ruby/2.2.0/gems/modular-scale-2.1.1/stylesheets',
      'vendor/bundle/ruby/2.2.0/gems/toolkit-2.9.0/stylesheets'
    ]);
  });
});

test('works with global ruby gems', function (t) {
  t.plan(1);

  // $ rvm use ruby-2.2.3
  // $ gem install modular-scale -v 2.1.1
  // $ gem install toolkit       -v 2.9.0

  sassImp.rubyGems()
  .then(function(paths) {
    t.deepEqual(paths, [
      '/home/build/.rvm/gems/ruby-2.2.3/gems/compass-core-1.0.3/stylesheets',
      '/home/build/.rvm/gems/ruby-2.2.3/gems/modular-scale-2.1.1/stylesheets',
      '/home/build/.rvm/gems/ruby-2.2.3/gems/toolkit-2.9.0/stylesheets'
    ]);
  });
});

test('works with bower components folder', function (t) {
  t.plan(1);

  // (in this package bower.json
  // modular-scale  2.1.1

  // $ npm install -g bower
  // $ bower install

  sassImp.bowerComponents()
  .then(function(paths) {
    t.deepEqual(paths, [
      'bower_components/modular-scale/stylesheets',
      'bower_components/sass-toolkit/stylesheets'
    ]);
  });
});
