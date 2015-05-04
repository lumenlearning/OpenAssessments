class CustomDomain
  def matches?(request)
    return false if request.subdomain.length <= 0 || request.subdomain == 'www'
    true
  end
end

Rails.application.routes.draw do

  root :to => "default#index"

  resources :lti_launches do
  collection do
      post :index
      get :index
    end
  end
  resources :lti_installs
  
  devise_for :users, controllers: {
    sessions: "sessions",
    registrations: "registrations",
    omniauth_callbacks: "omniauth_callbacks"
  }
  
  resources :users do
    resources :assessments, except: [:update, :edit], :controller => "assessments"
  end
  resources :canvas_authentications
  resources :admin, only: [:index]
  
  namespace :admin do
    resources :accounts
  end

  resources :assessments
  resources :assessment_loaders
  resources :assessment_results
  resources :item_results

  get 'saml', to: 'saml#index'
  get 'saml/metadata', to: 'saml#metadata'
  post 'saml/consume', to: 'saml#consume'

  # oembed
  match 'oembed' => 'oembed#endpoint', :via => [:get, :post]

  namespace :api do
    resources :assessments
    resources :assessment_results
    resources :item_results
  end

  match '/proxy' => 'default#proxy', via: [:get, :post]
  match '/contact' => 'default#contact', via: [:get, :post]
  match '/about' => 'default#about', via: [:get]
  match '/take' => 'default#take', via: [:get]
  
  mount MailPreview => 'mail_view' if Rails.env.development?

end
