# frozen_string_literal: true

module Api
  module V1
    class SongSearchController < BaseController
      def index
        query = params[:q].to_s.strip

        if query.blank?
          # Return recent songs from user's events
          songs = Song.joins(:event)
                      .where(events: { user_id: current_user.id })
                      .includes(:performers)
                      .order(created_at: :desc)
                      .limit(10)
        else
          # Search songs by name or composer
          songs = Song.joins(:event)
                      .where(events: { user_id: current_user.id })
                      .where("songs.name ILIKE :q OR songs.composer_name ILIKE :q", q: "%#{query}%")
                      .includes(:performers)
                      .order(created_at: :desc)
                      .limit(20)
        end

        render_success(SongBlueprint.render_as_hash(songs, view: :search))
      end

      def composers
        query = params[:q].to_s.strip

        composers = Song.joins(:event)
                        .where(events: { user_id: current_user.id })
                        .where.not(composer_name: [nil, ""])
                        .select(:composer_name)
                        .distinct
                        .order(:composer_name)

        if query.present?
          composers = composers.where("composer_name ILIKE ?", "%#{query}%")
        end

        render_success(composers.limit(20).pluck(:composer_name))
      end
    end
  end
end
