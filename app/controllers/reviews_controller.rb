class ReviewsController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  # the app goes into this action when event-goers submit a form for a song
  def create
    @song_review = SongReview.new(song_review_params)
    @song_review.song = Song.find(params[:song_id])
    if @song_review.save
      # if the review is successfully saved, go back to events#show,
      # with the form for this song and all the forms that have to submitted before hidden
    else
      # if the review is successfully saved, go back to events#show, with the form for this song hidden
      redirect_to new_song_song_review(params[:song_id])
    end
  end

  def song_review_params
    params.require(:song_preview).permit(:rating, :comment)
  end
end
