Rails.application.routes.draw do
  mount Blazer::Engine, at: 'blazer' unless Rails.env.production?
  apipie
end
