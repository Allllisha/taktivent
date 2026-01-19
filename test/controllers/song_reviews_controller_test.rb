require "test_helper"

class SongReviewsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get song_reviews_create_url
    assert_response :success
  end
end
