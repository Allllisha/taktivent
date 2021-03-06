class EventsController < ApplicationController
  include QuestionFormattable

  skip_after_action :verify_authorized, only: %i[show]
  skip_before_action :authenticate_user!, only: :show

  def show
    @event = Event.find(params[:id])
    @event_review = EventReview.new
    @song_review = SongReview.new
    @songs = @event.songs.order(start_at: :asc).limit(300)
    authorize @event
  end

  def new
    @event = Event.new
    @venue = Venue.new
    authorize @venue
  end

  def create
    @event = Event.new(event_params)
    @venue = Venue.new(venue_params)
    @event.user = current_user
    authorize @event
    authorize @venue
    # refer to app/controllers/concerns/question_formattable.rb
    @event.questions_and_choices = format_questions_and_choices(params[:review][:questions_and_choices])
    @event.venue = @venue
    if @event.save && @venue.save
      redirect_to event_path(@event)
    else
      render :new
    end
  end

  def edit
    @event = Event.find(params[:id])
    @venue = @event.venue
    authorize @event
    authorize @venue
  end

  def update
    @event = Event.find(params[:id])
    @venue = @event.venue
    @event.update(event_params)
    @venue.update(venue_params)
    authorize @event
    authorize @venue
    redirect_to event_path
  end

  def preview
    @event = Event.find(params[:id])
    @songs = @event.songs
    authorize @event
  end

  def dashboard
    @event = Event.includes(:event_reviews, songs: :song_reviews).find(params[:id])
    @songs = @event.songs.order(start_at: :asc).limit(300)
    ratings = @event.event_reviews.group(:rating).count
    @total_ratings = ratings.values.sum
    @possible_stars = ratings.size * 5

    authorize @event

    url = event_url(@event)
    qrcode = RQRCode::QRCode.new(url)
    @qr = qrcode.as_svg(
      offset: 0,
      color: '000',
      shape_rendering: 'crispEdges',
      module_size: 6,
      standalone: true
    )
  end

  def analytics
    @event = Event.includes(:event_reviews, songs: :song_reviews).find(params[:id])
    ratings = @event.event_reviews.group(:rating).count
    @ratings = {}
    6.times do |number|
      if ratings[number]
        @ratings[number] = ratings[number]
      else
        @ratings[number] = 0
      end
    end

    @total_ratings = ratings.values.sum
    @possible_stars = ratings.size * 5
    @average_ratings = @total_ratings / ratings.size

    if @average_ratings >= 4.5
      @rating_text = "Excellent"
    elsif @average_ratings < 4.5 && @average_ratings > 2.5
      @rating_text = "Satisfactory"
    else
      @rating_text = "Unsatisfactory"
    end

    sentiments = @event.event_reviews.group(:sentiment).count
    @total_sentiments = sentiments.values.sum
    @average_sentiments = @total_sentiments / sentiments.size

    @review_per_count = @event.event_reviews.count / sentiments.size
    authorize @event
    @ratings

    @comments = @event.event_reviews.group(:comment)
  end

  def destroy
    @event = Event.find(params[:id])
    @event.destroy
    redirect_to dashboard_path
  end

  private

  def event_params
    params.require(:event).permit(:user, :name, :description, :start_at, :end_at, :images, :venue_id, :venue, :enable_textbox)
  end

  def venue_params
    params.require(:event).require(:venue).permit(:name, :address)
  end
end
