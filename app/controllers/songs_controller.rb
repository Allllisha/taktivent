class SongsController < ApplicationController
  def new
    @song = Song.new
    @song_performer = Song_performer.new
  end

  def create
    @song = Song.new(song_params)
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

  def song_params
    params.require(:song).permit(:name, :composer_name, :start_at, :length_in_munute, :images)
  end
end
