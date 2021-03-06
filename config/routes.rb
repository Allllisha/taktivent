Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  get '/dashboard', to: 'pages#dashboard'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :events, only: %i[new create show edit update] do
    resources :event_reviews, only: %i[create]
    resources :songs, only: %i[new show create edit update destroy] do
      resources :song_reviews, only: %i[create]
    end
    member do
      get 'preview'
      get 'analytics'
    end
  end

  get '/events/:id/dashboard', to: 'events#dashboard', as: 'manage_event'
end
