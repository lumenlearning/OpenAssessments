class CustomDomain
  def matches?(request)
    return false if request.subdomain.length <= 0 || request.subdomain == 'www'
    true
  end
end

Rails.application.routes.draw do

  root :to => "home#index"

  resources :lti_installs
  
  devise_for :users, controllers: {
    sessions: "sessions",
    registrations: "registrations",
    omniauth_callbacks: "omniauth_callbacks"
  }
  
  resources :users
  resources :canvas_authentications
  resources :admin, only: [:index]
  
  mount MailPreview => 'mail_view' if Rails.env.development?

end
