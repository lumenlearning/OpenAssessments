class CustomDomain
  def matches?(request)
    return false if request.subdomain.length <= 0 || request.subdomain == 'www'
    true
  end
end

Rails.application.routes.draw do

  root :to => "home#index"

  devise_for :users, :controllers => {
    :registrations => "registrations",
    :omniauth_callbacks => "omniauth_callbacks"
  }
  resources :users

  match '/evaluations', to: 'evaluations#index', via: [:get, :post]

  mount MailPreview => 'mail_view' if Rails.env.development?

end
