Apipie.configure do |config|
  config.app_name                = "fleet_web"
  config.api_base_url            = "/"
  config.doc_base_url            = "/api/documentation"
  config.api_controllers_matcher = "#{Rails.root}/app/controllers/**/*.rb"

  config.authenticate = proc do
    authenticate_or_request_with_http_basic do |username, password|
      username == ENV['APIPIE_USERNAME'] && password == ENV['APIPIE_PASSWORD']
    end
  end
end
