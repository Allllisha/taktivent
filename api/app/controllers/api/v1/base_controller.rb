# frozen_string_literal: true

module Api
  module V1
    class BaseController < ApplicationController
      before_action :authenticate_user!

      private

      def render_success(data, status: :ok, meta: nil)
        response = { data: data }
        response[:meta] = meta if meta.present?
        render json: response, status: status
      end

      def render_error(code:, message:, details: nil, status: :bad_request)
        response = { error: { code: code, message: message } }
        response[:error][:details] = details if details.present?
        render json: response, status: status
      end
    end
  end
end
