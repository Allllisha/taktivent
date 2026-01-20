# frozen_string_literal: true

module Api
  module V1
    class SongsController < BaseController
      skip_before_action :authenticate_user!, only: [:index, :show]
      before_action :set_event
      before_action :set_song, only: [:show, :update, :destroy]
      before_action :authorize_event, only: [:create, :update, :destroy]

      def index
        songs = @event.songs.includes(:performers, :song_reviews).order(:start_at)
        render_success(SongBlueprint.render_as_hash(songs))
      end

      def show
        render_success(SongBlueprint.render_as_hash(@song))
      end

      def create
        song = @event.songs.build(song_params)
        song.save!

        if params[:song][:performer_ids].present?
          song.performer_ids = params[:song][:performer_ids]
        end

        render_success(SongBlueprint.render_as_hash(song), status: :created)
      end

      def update
        @song.update!(song_params)

        if params[:song][:performer_ids].present?
          @song.performer_ids = params[:song][:performer_ids]
        end

        render_success(SongBlueprint.render_as_hash(@song))
      end

      def destroy
        @song.destroy!
        render_success({ message: "Song deleted successfully" })
      end

      private

      def set_event
        @event = Event.find(params[:event_id])
      end

      def set_song
        @song = @event.songs.find(params[:id])
      end

      def authorize_event
        unless @event.user_id == current_user.id
          render_error(code: "forbidden", message: "You are not authorized to modify this event", status: :forbidden)
        end
      end

      def song_params
        params.require(:song).permit(
          :name, :composer_name, :description, :start_at, :length_in_minute, :enable_textbox,
          questions_and_choices: [:question, :question_type, choices: []],
          image_urls: []
        )
      end
    end
  end
end
