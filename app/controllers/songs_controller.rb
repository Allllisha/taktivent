class SongsController < ApplicationController
  def new
    @song = Song.new
    @event = Event.find(params[:event_id])
    @song_performer = SongPerformer.new
    authorize @song
  end

  def create
    @song = Song.new(song_params)
    @event = Event.find(params[:event_id])
    authorize @song
    authorize @event
    @song.event = @event
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
    # if @song.save && @event.save
    #   redirect_to manage_event_path(@event)
    # else 
    #   render "edit"
    # end
  end

  def update
    @song = Song.find(params[:id])
    @event = Event.find(params[:event_id])
    @song.user = current_user
    @event.user = current_user
    authorize @song
    authorize @event
    @song.update(song_params)
    @event.update(event_params)
    redirect_to manage_event_path(@event)
  end

  def destroy
    @song = Song.find(params[:id])
    @song.destroy
    redirect_to songs_path(@songs)
    authorize @song
    authorize @event
  end

  private

  def song_params
    params.require(:song).permit(:name, :composer_name, :start_at, :length_in_minute, :images, :event_id, :description)
  end

  def event_params
    params.require(:event).permit(:user, :name, :description, :start_at, :end_at,  :images, :venue_id, :venue, :event_id, :song_id)
  end
end
