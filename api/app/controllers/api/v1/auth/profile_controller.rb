# frozen_string_literal: true

module Api
  module V1
    module Auth
      class ProfileController < Api::V1::BaseController
        before_action :authenticate_api_v1_user!

        # GET /api/v1/auth/profile
        def show
          render json: {
            data: UserBlueprint.render_as_hash(current_api_v1_user)
          }, status: :ok
        end

        # PUT /api/v1/auth/profile
        def update
          if current_api_v1_user.update(profile_params)
            render json: {
              data: {
                user: UserBlueprint.render_as_hash(current_api_v1_user),
                message: "Profile updated successfully"
              }
            }, status: :ok
          else
            render json: {
              error: {
                code: "validation_error",
                message: "Profile update failed",
                details: current_api_v1_user.errors.to_hash
              }
            }, status: :unprocessable_entity
          end
        end

        # GET /api/v1/auth/profile/attended_events
        def attended_events
          events = current_api_v1_user.attended_events
                                      .includes(:venue)
                                      .order(start_at: :desc)

          render json: {
            data: events.map { |event| EventBlueprint.render_as_hash(event) }
          }, status: :ok
        end

        # PUT /api/v1/auth/profile/password
        def update_password
          unless current_api_v1_user.valid_password?(password_params[:current_password])
            return render json: {
              error: {
                code: "validation_error",
                message: "Current password is incorrect"
              }
            }, status: :unprocessable_entity
          end

          if current_api_v1_user.update(password: password_params[:password], password_confirmation: password_params[:password_confirmation])
            # Generate new token after password change
            token = Warden::JWTAuth::UserEncoder.new.call(current_api_v1_user, :api_v1_user, nil).first
            response.headers['Authorization'] = "Bearer #{token}"

            render json: {
              data: {
                user: UserBlueprint.render_as_hash(current_api_v1_user),
                message: "Password updated successfully"
              }
            }, status: :ok
          else
            render json: {
              error: {
                code: "validation_error",
                message: "Password update failed",
                details: current_api_v1_user.errors.to_hash
              }
            }, status: :unprocessable_entity
          end
        end

        private

        def profile_params
          params.require(:user).permit(:first_name, :last_name, :email)
        end

        def password_params
          params.require(:user).permit(:current_password, :password, :password_confirmation)
        end
      end
    end
  end
end
