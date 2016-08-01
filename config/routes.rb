class CustomDomain
  def matches?(request)
    return false if request.subdomain.length <= 0 || request.subdomain == 'www'
    true
  end
end

Rails.application.routes.draw do

  root to: "default#index"

  resources :lti_installs
  
  devise_for :users, controllers: {
    sessions: "sessions",
    registrations: "registrations",
    omniauth_callbacks: "omniauth_callbacks"
  }
  
  resources :users do
    resources :assessments, except: [:update, :edit, :show], controller: "assessments"
  end

  as :user do
    get    '/auth/failure'         => 'sessions#new'
    get     'users/auth/:provider'  => 'users/omniauth_callbacks#passthru'
    get     'sign_in'               => 'sessions#new'
    post    'sign_in'               => 'sessions#create'
    get     'sign_up'               => 'devise/registrations#new'
    delete  'sign_out'              => 'sessions#destroy'
  end

  resources :canvas_authentications
  
  resources :admin, only: [:index]

  namespace :api do
    resources :accounts do
      resources :users
    end
  end

  post 'assessments/lti', to: 'assessments#lti', as: 'lti'
  resources :assessments do
    member do
      post :show
      post :edit
    end
  end

  resources :assessment_loaders
  resources :assessment_results
  resources :item_results

  get 'saml', to: 'saml#index'
  get 'saml/metadata', to: 'saml#metadata'
  post 'saml/consume', to: 'saml#consume'

  # oembed
  match 'oembed' => 'oembed#endpoint', :via => [:get, :post]

  namespace :api do
    resources :user_assessments do
      put '/update_attempts', to: "user_assessments#update_attempts"
    end
    resources :assessments do
      get 'results/:result_id', to: 'assessment_results#show'
      put '/edit', to: 'assessments#json_update'
    end
    resources :assessment_results do
      post 'send', to: 'assessment_results#send_result_to_analytics'
      post 'lti_outcome', to: 'assessment_results#send_lti_outcome'
    end
    post 'progress', to: 'assessment_results#log_progress'
    resources :item_results
    resources :grades
    resources :assessment_settings
  end

  match '/proxy' => 'default#proxy', via: [:get, :post]
  match '/contact' => 'default#contact', via: [:get, :post]
  match '/about' => 'default#about', via: [:get]
  match '/take' => 'default#take', via: [:get]
  
  mount MailPreview => 'mail_view' if Rails.env.development?

end
