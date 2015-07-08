# If bundler starts to act up run these commands to start over and clean up:
# rm -rf ~/.bundle/ ~/.gem/; rm -rf $GEM_HOME/bundler/ $GEM_HOME/cache/bundler/; rm -rf .bundle/; rm -rf vendor/cache/; rm -rf Gemfile.lock
# rvm gemset empty openassessments
# bundle install

source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.1'

# Database
gem "pg"

# UI
gem 'sass-rails', '~> 4.0.3'
gem 'uglifier', '>= 1.3.0'
gem 'jquery-rails'
gem 'bootstrap-sass'
gem 'font_assets', github: 'atomicjolt/font_assets' # sets headers and mimetypes for fonts in the asset pipeline
gem 'autoprefixer-rails'
gem 'non-stupid-digest-assets' # also compile assets without digest (fixes font problem)

# authentication, authorization, integrations
gem 'devise'
gem 'omniauth', '~> 1.2.2'
gem 'omniauth-canvas', '~> 0.1.0' #, :path => '~/projects/omniauth-canvas'
gem 'oauth', '~> 0.4.7'
gem 'ims-lti', '~> 1.1.8' # IMS LTI tool consumers and providers
gem 'cancancan'
gem 'attr_encrypted'
gem 'jwt', '~> 1.5.0' # json web token

# core extensions
gem 'addressable', '~> 2.3.5' #URI implementation

# Email
gem 'sendgrid'

# JSON parser
gem 'yajl-ruby', require: 'yajl'

# Acts as taggable for keywords
gem 'acts-as-taggable-on'

# html/xml parsers
gem 'nokogiri'
gem 'nokogiri-happymapper', :require => 'happymapper'

# Saml
gem 'ruby-saml-mod'

# deployment
gem 'unicorn'
gem 'unicorn-rails'

# API Related
gem 'httparty'
gem 'typhoeus'
gem 'rack-cors', :require => 'rack/cors'

# Paging
gem 'will_paginate', '~> 3.0.6'

# Charts
gem "chartkick"
gem 'groupdate' # for grouping the chart data by date

# Monitoring
gem 'newrelic_rpm'
gem 'health_check'
gem 'rack-ssl-enforcer'

group :development do
  gem 'spring'
  gem 'better_errors'
  gem 'binding_of_caller', :platforms=>[:mri_21]
  gem 'guard-bundler'
  gem 'guard-rails'
  gem 'guard-rspec'
  gem 'hub', :require=>nil
  gem 'mail_view'
  gem 'mailcatcher'
  gem 'quiet_assets'
  gem 'rails_apps_pages'
  gem 'rails_apps_testing'
  gem 'rails_layout'
  gem 'rb-fchange', :require=>false
  gem 'rb-fsevent', :require=>false
  gem 'rb-inotify', :require=>false
end

group :development, :test do
  gem 'dotenv-rails'
  gem 'byebug'
  gem 'factory_girl_rails'
  gem 'faker'
  gem 'rspec-rails'
  gem 'email_spec'
end

group :test do
  gem 'capybara'
  gem 'database_cleaner'
  gem 'launchy'
  gem 'selenium-webdriver'
  gem 'shoulda-matchers', require: false
  gem 'webmock'
end

group :production do
  gem 'rails_12factor'
end

