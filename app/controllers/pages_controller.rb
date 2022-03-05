class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home ]

  def home
    redirect_to dashboard_path if user_signed_in?
  end

  def dashboard
    @events = Event.where(user: current_user)
    @analytics_rating = generate_analytics(:rating)
    @analytics_sentiment = generate_analytics(:sentiment)
  end

  def generate_analytics(type)
    analytics_raw = @events.map{|event|event.event_reviews.group(type).count}
    analytics = {}
    analytics_raw.each do |hash|
      hash.each do |k, v|
        if analytics[k]
          analytics[k] += v
        else
          analytics[k] = v
        end
      end
    end
    analytics
  end
end
