# sass-include-paths
Generates include paths for node-sass for packages from popular package managers like npm, bower, ruby gem, ruby bundler.

The generated array with the include paths can be passed to node-sass.
This allows interoperability between sass variants, ruby sass, libsass and sass-eyeglass (libsass + eyeglass)


Async/Sync
----------
This module offers an async and a sync version of each function.
The async version is a thenable (Promise based) for easier chaining.
The sync version is intended for being used in tools like Gulp where this doesn't matter in a task.


Usage
-----

Require this module and optionally define an array of include paths, 
either empty or already with some paths to include:
````
var sassIncl = require('sass-include-paths'),
    scssIncludePaths = [];
````

Now one can either invoke the module functions outside the task scope 
or inside the task scope for a scan on demand (as in these examples) 
(e.g. in case you add/move files during gulp watch for example).


For importing sass/scss files from sass/eyeglass npm packages...
#### using gulp-ruby-sass (ruby sass)
````
[...]
  rubySass(srcAssets.scss + '/*.scss', {
    loadPath: scssIncludePaths.concat(sassIncl.nodeModulesSync());
  })
[...]
````
As gulp-ruby-sass (ruby-sass) already imports sass/scss files from ruby gems 
(autorequired by Gemfile or explicitly required in compass config.rb or elsewhere), 
there is no need to pass paths to these, too.


For importing sass/scss files from plain or eyeglass npm packges and from ruby gems and local bundle...
#### using gulp-sass (plain libsass)
````
[...]
  .pipe(plugins.sass({
    includePaths: scssIncludePaths
      .concat(sassIncl.nodeModulesSync())
      .concat(sassIncl.rubyGemsSync())
      .concat(sassIncl.rubyGemsBundleSync())
  }))
[...]
````
One could argue using a custom importer for node-sass instead, but currently there are no custom importers 
that scan node_modules/ because in most opinions this should be handled by eyeglass (libsass + eyeglass) instead, 
however, even using eyeglass, there is still an use case (see further below).


For importing sass/scss files from plain npm packages and from ruby gems and local bundle...
#### using eyeglass (libsass + eyeglass) 
````
[...]
var eyeglass = new Eyeglass({
  includePaths: scssIncludePaths
    .concat(sassIncl.nodeModulesSync())
    .concat(sassIncl.rubyGemsSync())
    .concat(sassIncl.rubyGemsBundleSync()),
});
[...]
````
One use case to also add node_module paths when using eyeglass 
is to be able to import npm packages that haven't been made eyeglass-ready yet.
Though it may work fine using this module, please still consider creating an issue 
to inform the package creator that eyeglass metadata is still missing for the package.
