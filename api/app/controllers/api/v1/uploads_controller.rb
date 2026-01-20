# frozen_string_literal: true

module Api
  module V1
    class UploadsController < BaseController
      # Direct upload through backend (more secure)
      def create
        unless params[:file].present?
          return render_error(code: "missing_file", message: "No file provided", status: :bad_request)
        end

        Rails.logger.info "Uploading file: #{params[:file].original_filename}"

        result = Cloudinary::Uploader.upload(
          params[:file].tempfile.path,
          public_id: "taktivent/#{SecureRandom.uuid}",
          resource_type: "image"
        )

        Rails.logger.info "Upload successful: #{result['secure_url']}"

        render_success({
          url: result["secure_url"],
          public_id: result["public_id"]
        }, status: :created)
      rescue StandardError => e
        Rails.logger.error "Upload failed: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace.first(5).join("\n")
        render_error(code: "upload_failed", message: e.message, status: :unprocessable_entity)
      end

      # Keep presigned for backward compatibility
      def presigned
        timestamp = Time.now.to_i
        public_id = "taktivent/#{SecureRandom.uuid}"

        signature = Cloudinary::Utils.api_sign_request(
          {
            timestamp: timestamp,
            public_id: public_id
          },
          Cloudinary.config.api_secret
        )

        render_success({
          upload_url: "https://api.cloudinary.com/v1_1/#{Cloudinary.config.cloud_name}/image/upload",
          public_id: public_id,
          signature: signature,
          api_key: Cloudinary.config.api_key,
          timestamp: timestamp
        })
      end
    end
  end
end
