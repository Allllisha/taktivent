# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'date'
require 'uri'
require 'net/http'
require 'openssl'
require 'json'
require 'rake'

# call sentiment analysis api on comments in reviews
def get_sentiment(comment)
  url = URI("https://japerk-text-processing.p.rapidapi.com/sentiment/")

  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE

  request = Net::HTTP::Post.new(url)
  request["content-type"] = 'application/x-www-form-urlencoded'
  request["x-rapidapi-host"] = 'japerk-text-processing.p.rapidapi.com'
  request["x-rapidapi-key"] = ENV['RAPIDAPI_KEY']
  request.body = "text=#{comment}&language=english"

  case JSON.parse(http.request(request).read_body)['label']
  when 'pos'
    return 'Positive'
  when 'neg'
    return 'Negative'
  else
    return 'Neutral'
  end
end

puts 'Clearing database...'
system('rails db:schema:load')

puts 'Generating users...'
User.create!(first_name: "Arisa", last_name: "Nemoto", email: "ardolce23@gmail.com", password: "1234567")
User.create!(first_name: "Tom", last_name: "Tsui", email: "tomtsui@xxx.com", password: "1234567")
User.create!(first_name: "Ref", last_name: "Mags", email: "refmags@xxx.com", password: "1234567")
User.create!(first_name: "Nico", last_name: "Lentgen", email: "nicolaslentgen@xxx.com", password: "1234567")

puts 'Generating venues...'
8.times do
  Venue.create!(name: Faker::Address.city_suffix, address: Faker::Address.full_address)
end

User.all.each do |artist|
  puts "Generating events and performers for #{artist.first_name}..."
  2.times do |i|
    event = Event.create!(
      name: "#{artist.first_name} #{artist.last_name} Live Concert #{i + 1}",
      start_at: Faker::Time.between_dates(from: Date.today - 1, to: Date.today, period: :all),
      end_at: Faker::Time.between_dates(from: Date.today + 1, to: Date.today + 2, period: :all),
      description: Faker::Quote.matz,
      user: artist,
      venue: Venue.all.sample
    )
    event.images.attach(io: File.open(Rails.root.join('app/assets/images/event-img.jpeg')),
                        filename: "event-img.jpeg")

    performer = Performer.create!(
      name: Faker::Name.name_with_middle,
      description: Faker::Quote.matz,
      user: artist
    )
    performer.images.attach(io: File.open(Rails.root.join('app/assets/images/performer.png')),
                            filename: "performer.png")
  end
end

puts 'Generating songs...'
Event.all.each do |event|
  2.times do
    Song.create!(
      name: Faker::Music::RockBand.song,
      composer_name: Faker::Music::RockBand.name,
      start_at: Faker::Time.between_dates(from: event.start_at, to: event.end_at, period: :all),
      length_in_minute: Faker::Number.within(range: 10..20),
      description: Faker::Quote.matz,
      event: event
    )
    song.images.attach(io: File.open(Rails.root.join('app/assets/images/song-img.png')),
                       filename: "song-img.png")
  end
end

comments = [
  'Best performance I have ever seen!',
  "It's ok I guess.",
  'Overall pretty nice :)',
  'Boring as hell.',
  'Please work on the techniques.',
  'Bravo!',
  'Amazing, I have no words.',
  'Completely exceeded my expectation.',
  'Way too good for the price.',
  'Not bad at all.',
  'Splendid.',
  'Unbelievably good.'
]

User.all.each do |artist|
  puts "Generating reviews for #{artist.first_name}..."
  artist.events.each do |event|
    comment = comments.sample
    event.event_reviews.create!(rating: [1..5].sample, comment: comment, sentiment: get_sentiment(comment))
    event.songs.each do |song|
      comment = comments.sample
      song.song_reviews.create!(rating: [1..5].sample, comment: comment, sentiment: get_sentiment(comment))
    end
  end
end
