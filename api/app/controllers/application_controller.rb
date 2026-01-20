# frozen_string_literal: true

class ApplicationController < ActionController::API
  include Pundit::Authorization

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from Pundit::NotAuthorizedError, with: :forbidden

  private

  # Devise helpers for namespaced routes
  def authenticate_user!
    authenticate_api_v1_user!
  end

  def current_user
    current_api_v1_user
  end

  def user_signed_in?
    api_v1_user_signed_in?
  end

  def not_found(exception)
    render json: { error: { code: "not_found", message: exception.message } }, status: :not_found
  end

  def unprocessable_entity(exception)
    render json: {
      error: {
        code: "validation_error",
        message: "Validation failed",
        details: exception.record.errors.to_hash
      }
    }, status: :unprocessable_entity
  end

  def forbidden(_exception)
    render json: { error: { code: "forbidden", message: "You are not authorized to perform this action" } }, status: :forbidden
  end
end
