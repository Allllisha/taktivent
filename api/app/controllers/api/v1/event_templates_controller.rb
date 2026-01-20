# frozen_string_literal: true

module Api
  module V1
    class EventTemplatesController < BaseController
      before_action :set_template, only: [:show, :update, :destroy]

      def index
        templates = current_user.event_templates.order(updated_at: :desc)
        render_success(EventTemplateBlueprint.render_as_hash(templates))
      end

      def show
        render_success(EventTemplateBlueprint.render_as_hash(@template))
      end

      def create
        template = current_user.event_templates.build(template_params)
        template.save!
        render_success(EventTemplateBlueprint.render_as_hash(template), status: :created)
      end

      def update
        @template.update!(template_params)
        render_success(EventTemplateBlueprint.render_as_hash(@template))
      end

      def destroy
        @template.destroy!
        render_success({ message: "Template deleted successfully" })
      end

      private

      def set_template
        @template = current_user.event_templates.find(params[:id])
      end

      def template_params
        params.require(:event_template).permit(
          :name, :description,
          template_data: {}
        )
      end
    end
  end
end
