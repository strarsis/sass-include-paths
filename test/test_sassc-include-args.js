'use strict';

var test             = require('tape'),
    sasscIncludeArgs = require('../lib/sassc-include-args');

test('properly generates sassc include paths', function (t) {
  t.plan(4);

  // empty array
  t.equal(sasscIncludeArgs([]), '');

  // one path
  t.equal(sasscIncludeArgs(['test']), '-I test');

  // multiple paths
  t.equal(sasscIncludeArgs(['test1', 'test2', 'test3']), '-I test1 -I test2 -I test3');

  // not an array
  t.throws(function() { return sasscIncludeArgs('incorrect'); }, /Argument is not an Array./, 'Argument is not an array.');
});
