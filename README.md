# sass-include-paths
Generates include paths for node-sass for packages from popular package managers like npm, bower, ruby gem, ruby bundler.

[![david](https://david-dm.org/strarsis/sass-include-paths.svg)](https://david-dm.org/strarsis/sass-include-paths)

[![NPM](https://nodei.co/npm/sass-include-paths.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/sass-include-paths/)

The generated array with the include paths can be passed to node-sass.

Allows interoperability between sass variants, ruby sass, libsass and sass-eyeglass (libsass + eyeglass)


Async/Sync
----------
This module offers an async and a sync version of each function.
The async version returns a thenable (Promise based) for easier chaining.
The sync version is intended for being used in tools like Gulp where this doesn't matter in a task.


Methods
-------

### node modules
For node modules that contain SCSS/SASS files.

#### nodeModulesSync()
Sync version, returns the array directly.

#### nodeModules()
Async version, returns a theneable.



### bower components
For bower components that contain SCSS/SASS files.

#### bowerComponentsSync()
Sync version, returns the array directly.

#### bowerComponents()
Async version, returns a theneable.



### bundled ruby gems
For bundled ruby gems installed in folder by bundler (default is ./vendor/bundle) that contain SCSS/SASS files.

#### rubyGemsBundleSync()
Sync version, returns the array directly.

#### rubyGemsBundle()
Async version, returns a theneable.



### system/global ruby gems
For ruby gems installed on current (activated/available) ruby environment (system/globally installed gems) that contain SCSS/SASS files.

#### rubyGemsSync()
Sync version, returns the array directly.

#### rubyGems()
Async version, returns a theneable.



Usage
-----

Require this module and optionally define an array of include paths, 
either empty or already with some paths to include:
```javascript
var sassIncl = require('sass-include-paths'),
    scssIncludePaths = [];
````

When the module functions are invoked outside the task scope,
the scan is run only once when gulp is started, notably when using gulp-watch.
This spares extra scans each time workspace files are changed.
When packages, gems or bower components are changed, gulp watch has to be restarted for a rescan.


For importing sass/scss files from sass/eyeglass npm packages...
#### using gulp-ruby-sass (ruby sass)
```javascript
[...]
scssIncludePaths = [] // additional include paths
  .concat(sassIncl.nodeModulesSync());
[...]
  rubySass(srcAssets.scss + '/*.scss', {
    loadPath: scssIncludePaths
  })
[...]
````
As gulp-ruby-sass (ruby-sass) already imports sass/scss files from ruby gems 
(autorequired by Gemfile or explicitly required in compass config.rb or elsewhere), 
there is no need to pass paths to these, too.


For importing sass/scss files from plain or eyeglass npm packges and from ruby gems and local bundle...
#### using gulp-sass (plain libsass)
```javascript
[...]
scssIncludePaths = [] // additional include paths
  .concat(sassIncl.nodeModulesSync())
  .concat(sassIncl.rubyGemsSync())
  .concat(sassIncl.rubyGemsBundleSync());
[...]
  .pipe(plugins.sass({
    includePaths: scssIncludePaths
  }))
[...]
````
One could argue using a custom importer for node-sass instead, but currently there are no custom importers 
that scan node_modules/ because in most opinions this should be handled by eyeglass (libsass + eyeglass) instead, 
however, even using eyeglass, there is still an use case (see further below).


For importing sass/scss files from plain npm packages and from ruby gems and local bundle...
#### using eyeglass (libsass + eyeglass) 
```javascript
[...]
// Outside the gulp task
scssIncludePaths = [] // additional include paths
  .concat(sassIncl.nodeModulesSync())
  .concat(sassIncl.rubyGemsSync())
  .concat(sassIncl.rubyGemsBundleSync()):
[...]
var eyeglass = new Eyeglass({
  includePaths: scssIncludePaths
});
[...]
````
One use case to also add node_module paths when using eyeglass 
is to be able to import npm packages that haven't been made eyeglass-ready yet.
Though it may work fine using this module, please still consider creating an issue 
to inform the package creator that eyeglass metadata is still missing for the package.


### CLI/sassc usage
A cli wrapper comes with this module which can generate the list of include paths to be used on cli.
For sassc-compatible options output, pass the --sassc switch.
Example:
````
$ npm install -g sass-include-paths
$ sassc $(sassIncludePaths --sassc --node_modules --bower_components) [...]
````
Note: `$(...)` executes the command and re-uses its stdout.




Development
-----------
In order to run the tests, npm, bower and ruby gem/bundler have to be available.
bower will be installed as development dependency of this package.
For consistent tests, the ruby and node versions have been locked using rvm/nvm config files, 
so both or similar tools have to be installed to ensure the right versions and isolation.

./test/prepare.sh can be run after `npm install` for quickly installing the bower dependencies and ruby bundle.
