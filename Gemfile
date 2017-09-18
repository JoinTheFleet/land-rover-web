source "https://rubygems.org"

ruby "2.3.0"

source 'https://PMqN82xjoLy95YstYaCp@repo.fury.io/showoffie/' do
  gem 'showoff_api'
  gem 'showoff_sns'
  gem 'showoff_serializable'
  gem 'showoff_response_codes'
  gem 'showoff_current_api_user'
  gem 'concerning_services'
end

gem "devise"

gem "flutie"
gem "bourbon", "5.0.0.beta.5"
gem "high_voltage"
gem "honeybadger"
gem "jquery-rails"
gem "neat", "~> 1.7.0"
gem "newrelic_rpm", ">= 3.9.8"
gem "normalize-rails", "~> 3.0.0"
gem "pg"
gem "puma"
gem "foreman"
gem "rack-canonical-host"
gem "rails", "~> 4.2.6"
gem "recipient_interceptor"
gem "bootstrap-sass"
gem "slim-rails"
gem "sass-rails", "~> 5.0"
gem "simple_form"
gem "sprockets", ">= 3.0.0"
gem "sprockets-es6"
gem "title"
gem "uglifier"
gem "figaro"

gem "sidekiq"
gem "sidekiq-status"
gem "sidekiq-statistic"

gem "filterrific"
gem "select2-rails"
gem "morrisjs-rails"
gem "raphaeljs-rails"
gem "cookies_eu"
gem "rack-attack"
gem "groupdate"

gem "apipie-rails"
gem "active_model_serializers"

gem "aws-sdk"
gem "aws-sdk-core"
gem "paperclip"

gem "will_paginate"
gem "will_paginate-bootstrap"

gem "attr_encrypted"

gem "cancancan"
gem "omniauth"
gem "omniauth-facebook"
gem "doorkeeper"

gem "stripe"
gem "nested_form"
gem "blazer"
gem "geocoder"
gem "activerecord-postgis-adapter"

group :development do
  gem "quiet_assets"
  gem "spring"
  gem "spring-commands-rspec"
  gem "web-console"
  gem "letter_opener"
end

group :development, :test do
  gem "awesome_print"
  gem "bullet"
  gem "bundler-audit", ">= 0.5.0", require: false
  gem "factory_girl_rails"
  gem "pry-byebug"
  gem "pry-rails"
  gem "rspec-rails", "~> 3.4.0"
end

group :development, :staging do
  gem "rack-mini-profiler", require: false
end

group :test do
  gem "ffaker"
  gem "database_cleaner"
  gem "formulaic"
  gem "launchy"
  gem "shoulda-matchers"
  gem "simplecov", require: false
  gem "timecop"
  gem "webmock"
end

group :staging, :production do
  gem "rails_stdout_logging"
  gem "rails_12factor"
  gem "rack-timeout"
end
