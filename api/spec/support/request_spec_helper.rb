module RequestSpecHelper
  # Generate JWT token for authenticated requests
  def auth_headers(user)
    token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
    { 'Authorization' => "Bearer #{token}" }
  end

  # Parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
