Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  get '/dashboard', to: 'pages#dashboard'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :events, only: %i[new create show edit update] do
    resources :event_reviews, only: %i[new create]
    resources :songs, only: %i[new create edit update]
    member do
      get 'preview'
      get 'analytics'
    end
  end

  get '/event/:id/dashboard', to: 'events#dashboard'
  get '/reviews', to: 'reviews#create'
end
