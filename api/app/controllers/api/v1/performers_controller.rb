# frozen_string_literal: true

module Api
  module V1
    class PerformersController < BaseController
      before_action :set_performer, only: [:show, :update, :destroy]

      def index
        performers = current_user.performers.includes(:songs)
        render_success(PerformerBlueprint.render_as_hash(performers))
      end

      def show
        render_success(PerformerBlueprint.render_as_hash(@performer))
      end

      def create
        performer = current_user.performers.build(performer_params)
        performer.save!
        render_success(PerformerBlueprint.render_as_hash(performer), status: :created)
      end

      def update
        @performer.update!(performer_params)
        render_success(PerformerBlueprint.render_as_hash(@performer))
      end

      def destroy
        @performer.destroy!
        render_success({ message: "Performer deleted successfully" })
      end

      private

      def set_performer
        @performer = current_user.performers.find(params[:id])
      end

      def performer_params
        params.require(:performer).permit(:name, :description, :bio, image_urls: [])
      end
    end
  end
end
