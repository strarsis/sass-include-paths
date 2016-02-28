#!/usr/bin/env sh
bower install --config.interactive=false

gem install bundler --no-ri --no-rdoc
bundle install --path vendor/bundle
