class SongReviewsController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  def new
    @song_review = SongReview.new
    @song = Song.find(params[:song_id])
    # new.html.erb should render 'song_review_without_form' plus the form
  end

  def create
    @song_review = SongReview.new(song_review_params)
    @song_review.song = Song.find(params[:song_id])
    if @song_review.save
      render 'song_review_without_form'
      # remove form after submitting
    else
      redirect_to new_song_song_review(params[:song_id])
    end
  end

  def song_review_params
    params.require(:song_preview).permit(:rating, :comment)
  end
end
