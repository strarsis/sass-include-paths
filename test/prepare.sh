#!/usr/bin/env sh
./node_modules/.bin/bower install --config.interactive=false && \

gem install bundler --no-ri --no-rdoc && \
bundle install --path vendor/bundle
