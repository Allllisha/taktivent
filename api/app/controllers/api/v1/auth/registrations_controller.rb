# frozen_string_literal: true

module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        def create
          build_resource(sign_up_params)
          resource.save

          if resource.persisted?
            # Generate JWT token manually instead of using sign_in which requires sessions
            token = Warden::JWTAuth::UserEncoder.new.call(resource, :api_v1_user, nil).first
            response.headers['Authorization'] = "Bearer #{token}"
            respond_with(resource)
          else
            respond_with(resource)
          end
        end

        private

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              data: {
                user: UserBlueprint.render_as_hash(resource),
                message: "Signed up successfully"
              }
            }, status: :created
          else
            render json: {
              error: {
                code: "validation_error",
                message: "Sign up failed",
                details: resource.errors.to_hash
              }
            }, status: :unprocessable_entity
          end
        end

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name)
        end
      end
    end
  end
end
