# frozen_string_literal: true

module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        def create
          user = User.find_by(email: sign_in_params[:email])

          if user&.valid_password?(sign_in_params[:password])
            # Generate JWT token manually
            token = Warden::JWTAuth::UserEncoder.new.call(user, :api_v1_user, nil).first
            response.headers['Authorization'] = "Bearer #{token}"
            render json: {
              data: {
                user: UserBlueprint.render_as_hash(user),
                message: "Logged in successfully"
              }
            }, status: :ok
          else
            render json: {
              error: { code: "unauthorized", message: "Invalid email or password" }
            }, status: :unauthorized
          end
        end

        def sign_in_params
          params.require(:user).permit(:email, :password)
        end

        def destroy
          # JWT revocation is handled by devise-jwt middleware
          render json: { data: { message: "Logged out successfully" } }, status: :ok
        end

        private

        def respond_with(resource, _opts = {})
          render json: {
            data: {
              user: UserBlueprint.render_as_hash(resource),
              message: "Logged in successfully"
            }
          }, status: :ok
        end

        def respond_to_on_destroy
          if current_user
            render json: {
              data: { message: "Logged out successfully" }
            }, status: :ok
          else
            render json: {
              error: { code: "unauthorized", message: "Couldn't find an active session" }
            }, status: :unauthorized
          end
        end
      end
    end
  end
end
