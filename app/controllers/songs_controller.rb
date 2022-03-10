class SongsController < ApplicationController
  include QuestionFormattable

  skip_after_action :verify_authorized, only: [:show]
  skip_before_action :authenticate_user!, only: [:show]

  def new
    @song = Song.new
    @event = Event.find(params[:event_id])
    @performer = Performer.new
    @performer = Performer.all
    authorize @song
  end


  def show
    @song = Song.find(params[:id])
    @event = Event.find(params[:event_id])
    @performers = @song_performers
    authorize @song
  end


  def create
    @song = Song.new(song_params)
    @event = Event.find(params[:event_id])
    # @performer = Performer.new(performer_params)
    # @performer.user = current_user
    authorize @song
    @song.event = @event
    @song.questions_and_choices = format_questions_and_choices(params[:review][:questions_and_choices])
    # @song.performer = @performer
    if @song.save && @event.save
      redirect_to manage_event_path(@event)
    else
      render "new"
    end
  end

  def edit
    @song = Song.find(params[:id])
    @event = Event.find(params[:event_id])
    authorize @song
    authorize @event
  end

  def update
    @song = Song.find(params[:id])
    @event = Event.find(params[:event_id])
    authorize @song
    @song.update(song_params)
    redirect_to manage_event_path(@event)
  end

  def destroy
    @song = Song.find(params[:id])
    authorize @song
    # @song.destroy
    # redirect_to songs_path(@songs)
  end

  private

  def song_params
    params.require(:song).permit(:name, :composer_name, :start_at, :length_in_minute,
                                 :event_id, :description, :enable_textbox, performer_ids: [], images: [])
  end

  def song_performer_params
    params.require(:song).require(:song_performer).permit(:song_id, :performer_id, :name, :description, :user_id)
  end

  def performer_params
    params.require(:performer).permit(:name, :description, :user_id, images: [])
  end
end
