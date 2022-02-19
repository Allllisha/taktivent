class SongsController < ApplicationController
  def new
    @song = Song.new
    @event = Event.find(params[:event_id])
    @song_performer = SongPerformer.new
    authorize @song
  end

  def create
    @song = Song.new(song_params)
    authorize @song
    @event = Event.find(params[:event_id])
    @song.event = @event
    if @song.save
      redirect_to @song
    else 
      render "new"
    end
  end

  def edit
    @song = Song.find(params[:id])
  end

  def update
    @song = Song.find(params[:id])
    @song.update(song_params)
    redirect_to song_path
  end

  def destroy
    @song = Song.find(params[:id])
    @song.destroy
    redirect_to songs_path(@songs)
  end

  private

  def song_params
    params.require(:song).permit(:name, :composer_name, :start_at, :length_in_minute, :images)
  end
end
