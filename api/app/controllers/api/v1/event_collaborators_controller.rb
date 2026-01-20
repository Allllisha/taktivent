# frozen_string_literal: true

module Api
  module V1
    class EventCollaboratorsController < BaseController
      before_action :set_event
      before_action :authorize_owner
      before_action :set_collaborator, only: [:update, :destroy]

      def index
        collaborators = @event.event_collaborators.includes(:user)
        render_success(EventCollaboratorBlueprint.render_as_hash(collaborators))
      end

      def create
        user = User.find_by(email: params[:email])

        unless user
          return render_error(code: "not_found", message: "User not found with that email", status: :not_found)
        end

        if user.id == @event.user_id
          return render_error(code: "invalid", message: "Cannot add owner as collaborator", status: :unprocessable_entity)
        end

        collaborator = @event.event_collaborators.build(user: user, role: params[:role] || 'editor')
        collaborator.save!

        render_success(EventCollaboratorBlueprint.render_as_hash(collaborator), status: :created)
      end

      def update
        @collaborator.update!(role: params[:role])
        render_success(EventCollaboratorBlueprint.render_as_hash(@collaborator))
      end

      def destroy
        @collaborator.destroy!
        render_success({ message: "Collaborator removed successfully" })
      end

      private

      def set_event
        @event = Event.find(params[:event_id])
      end

      def authorize_owner
        unless @event.user_id == current_user.id
          render_error(code: "forbidden", message: "Only the owner can manage collaborators", status: :forbidden)
        end
      end

      def set_collaborator
        @collaborator = @event.event_collaborators.find(params[:id])
      end
    end
  end
end
