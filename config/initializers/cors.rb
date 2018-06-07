Rails.application.config.middleware.insert_before 0, Rack::Cors do
  # Allows cross origin requests from anywhere for `/assets/` path to our Rails application.
  # We can lock this down further to just the CDN if we like. It'd be worth testing if there's
  # other implications.
  allow do
    origins '*'

    resource '/assets/*',
             headers: :any,
             methods: [:get]
  end
end
