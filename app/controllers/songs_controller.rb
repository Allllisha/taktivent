class SongsController < ApplicationController
  def new
    @song = Song.new
    @event = Event.find(params[:event_id])
    authorize @song
  end


  def show
    @song = Song.find(params[:id])
    @event = Event.find(params[:event_id])
    @song_performer = SongPerformer.new
    authorize @song
  end


  def create
    @song = Song.new(song_params)
    @event = Event.find(params[:event_id])
    authorize @song
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
    @song.destroy
    redirect_to songs_path(@songs)
    authorize @song
  end

  private

  def song_params
    params.require(:song).permit(:name, :composer_name, :start_at, :length_in_minute, :event_id, :description, images:[])
  end

  def song_performer_params
    params.require(:song).require(:song_performer).permit(:song_id, :performer_id, :name, :description, :user_id)
  end
end
