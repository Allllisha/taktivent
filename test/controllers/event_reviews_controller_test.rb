require "test_helper"

class EventReviewsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get event_reviews_create_url
    assert_response :success
  end
end
