# frozen_string_literal: true

module Api
  module V1
    module Auth
      class PasswordsController < Devise::PasswordsController
        respond_to :json

        # POST /api/v1/auth/password - Request password reset
        def create
          self.resource = resource_class.send_reset_password_instructions(resource_params)

          if successfully_sent?(resource)
            render json: {
              data: { message: "Password reset instructions sent to email" }
            }, status: :ok
          else
            render json: {
              error: {
                code: "not_found",
                message: "Email not found",
                details: resource.errors.to_hash
              }
            }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/auth/password - Reset password with token
        def update
          self.resource = resource_class.reset_password_by_token(resource_params)

          if resource.errors.empty?
            render json: {
              data: { message: "Password has been reset successfully" }
            }, status: :ok
          else
            render json: {
              error: {
                code: "validation_error",
                message: "Password reset failed",
                details: resource.errors.to_hash
              }
            }, status: :unprocessable_entity
          end
        end

        private

        def resource_params
          params.require(:user).permit(:email, :password, :password_confirmation, :reset_password_token)
        end
      end
    end
  end
end
