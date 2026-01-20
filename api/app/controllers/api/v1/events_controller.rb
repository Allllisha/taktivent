# frozen_string_literal: true

module Api
  module V1
    class EventsController < BaseController
      skip_before_action :authenticate_user!, only: [:show]
      before_action :set_event, only: [:show, :update, :destroy, :dashboard, :analytics, :qr_code, :duplicate]
      before_action :authorize_event, only: [:update, :destroy, :dashboard, :analytics, :qr_code, :duplicate]

      def index
        events = current_user.events.includes(:venue, :songs, :event_reviews).order(start_at: :desc)
        render_success(EventBlueprint.render_as_hash(events))
      end

      def stats
        events = current_user.events.includes(:event_reviews, songs: :song_reviews)

        # Aggregate all reviews
        all_event_reviews = EventReview.joins(:event).where(events: { user_id: current_user.id })
        all_song_reviews = SongReview.joins(song: :event).where(events: { user_id: current_user.id })

        # Calculate aggregated stats
        total_events = events.count
        total_reviews = all_event_reviews.count + all_song_reviews.count

        # Rating distribution (1-5 stars)
        event_ratings = all_event_reviews.group(:rating).count
        song_ratings = all_song_reviews.group(:rating).count
        rating_distribution = (1..5).each_with_object({}) do |rating, hash|
          hash[rating.to_s] = (event_ratings[rating] || 0) + (song_ratings[rating] || 0)
        end

        # Sentiment distribution
        event_sentiments = all_event_reviews.group(:sentiment).count
        song_sentiments = all_song_reviews.group(:sentiment).count
        sentiment_distribution = %w[positive neutral negative].each_with_object({}) do |sentiment, hash|
          hash[sentiment] = (event_sentiments[sentiment] || 0) + (song_sentiments[sentiment] || 0)
        end

        # Average rating
        all_ratings = all_event_reviews.pluck(:rating) + all_song_reviews.pluck(:rating)
        average_rating = all_ratings.compact.empty? ? nil : (all_ratings.compact.sum.to_f / all_ratings.compact.size).round(1)

        render_success({
          total_events: total_events,
          total_reviews: total_reviews,
          average_rating: average_rating,
          rating_distribution: rating_distribution,
          sentiment_distribution: sentiment_distribution
        })
      end

      def show
        render_success(EventBlueprint.render_as_hash(@event, view: :with_songs))
      end

      def create
        event = current_user.events.build(event_params.except(:venue_attributes))

        if event_params[:venue_attributes].present?
          venue = Venue.find_or_create_by!(
            name: event_params[:venue_attributes][:name],
            address: event_params[:venue_attributes][:address]
          )
          event.venue = venue
        end

        event.save!
        render_success(EventBlueprint.render_as_hash(event), status: :created)
      end

      def update
        if event_params[:venue_attributes].present?
          @event.venue.update!(event_params[:venue_attributes])
        end

        @event.update!(event_params.except(:venue_attributes))
        render_success(EventBlueprint.render_as_hash(@event))
      end

      def destroy
        @event.destroy!
        render_success({ message: "Event deleted successfully" })
      end

      def dashboard
        render_success(EventBlueprint.render_as_hash(@event, view: :with_songs))
      end

      def analytics
        render_success(EventBlueprint.render_as_hash(@event, view: :with_analytics))
      end

      def qr_code
        require "rqrcode"

        url = "#{ENV.fetch('FRONTEND_URL', 'http://localhost:5173')}/events/#{@event.id}"
        qrcode = RQRCode::QRCode.new(url)
        svg = qrcode.as_svg(
          color: "fff",
          shape_rendering: "crispEdges",
          module_size: 6,
          standalone: true,
          use_path: true
        )

        render_success({ svg: svg, url: url })
      end

      def duplicate
        new_event = @event.dup
        new_event.name = "#{@event.name} (Copy)"
        new_event.start_at = @event.start_at + 1.week
        new_event.end_at = @event.end_at + 1.week
        new_event.save!

        # Duplicate songs
        @event.songs.each do |song|
          new_song = song.dup
          new_song.event = new_event
          new_song.start_at = song.start_at + 1.week
          new_song.save!

          # Copy song performers
          song.performers.each do |performer|
            new_song.performers << performer
          end
        end

        render_success(EventBlueprint.render_as_hash(new_event, view: :with_songs), status: :created)
      end

      private

      def set_event
        @event = Event.includes(:venue, :songs, :event_reviews).find(params[:id])
      end

      def authorize_event
        unless @event.user_id == current_user.id
          render_error(code: "forbidden", message: "You are not authorized to access this event", status: :forbidden)
        end
      end

      def event_params
        params.require(:event).permit(
          :name, :description, :start_at, :end_at, :enable_textbox,
          questions_and_choices: [:question, :question_type, choices: []],
          venue_attributes: [:name, :address],
          image_urls: []
        )
      end
    end
  end
end
