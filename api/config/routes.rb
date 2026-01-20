# frozen_string_literal: true

Rails.application.routes.draw do
  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      # Authentication
      devise_for :users,
                 path: "auth",
                 path_names: {
                   sign_in: "sign_in",
                   sign_out: "sign_out",
                   registration: "sign_up"
                 },
                 controllers: {
                   sessions: "api/v1/auth/sessions",
                   registrations: "api/v1/auth/registrations",
                   passwords: "api/v1/auth/passwords"
                 }

      namespace :auth do
        get "me", to: "current_user#show"

        # Profile management
        get "profile", to: "profile#show"
        put "profile", to: "profile#update"
        put "profile/password", to: "profile#update_password"
        get "profile/attended_events", to: "profile#attended_events"
      end

      # Event Templates
      resources :event_templates, only: [:index, :show, :create, :update, :destroy]

      # Events
      get "events/stats", to: "events#stats"
      resources :events do
        member do
          get :dashboard
          get :analytics
          get :qr_code
          post :duplicate
        end

        # Collaborators
        resources :collaborators, only: [:index, :create, :update, :destroy], controller: "event_collaborators"

        # Songs (nested)
        resources :songs do
          # Song reviews (anonymous)
          resources :reviews, only: [:create], controller: "song_reviews" do
            member do
              post :reply
            end
          end
        end

        # Event reviews (anonymous)
        resources :reviews, only: [:create], controller: "event_reviews" do
          member do
            post :reply
          end
        end
      end

      # Song search (for autocomplete)
      get "songs/search", to: "song_search#index"
      get "songs/composers", to: "song_search#composers"

      # Performers
      resources :performers

      # Venues
      resources :venues, only: [:index, :show, :create]

      # File uploads
      post "uploads", to: "uploads#create"
      post "uploads/presigned", to: "uploads#presigned"
    end
  end
end
