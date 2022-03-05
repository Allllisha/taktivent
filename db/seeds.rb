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
require 'pry-byebug'

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
SongPerformer.destroy_all
User.destroy_all
Venue.destroy_all

puts 'Generating users...'
User.create!(first_name: "Arisa", last_name: "Nemoto", email: "ardolce23@gmail.com", password: "a23123")
User.create!(first_name: "Tom", last_name: "Tsui", email: "tomtsui@xxx.com", password: "1234567")
User.create!(first_name: "Ref", last_name: "Mags", email: "refmags@xxx.com", password: "1234567")
User.create!(first_name: "Nico", last_name: "Lentgen", email: "nicolaslentgen@xxx.com", password: "1234567")

puts 'Generating venues...'
8.times do
  Venue.create!(name: Faker::Address.city_suffix, address: Faker::Address.full_address)
end

# questions_and_choices seeds
questions_and_choices = [
  {
    question_type: :radio_buttons,
    question: 'What season does the performance remind you of?',
    choices: ['Spring', 'Summer', 'Autumn', 'Winter']
  },
  {
    question_type: :radio_buttons,
    question: 'Would you recommend to your friends?',
    choices: ['Absolutely', 'Maybe', 'No']
  },
  {
    question_type: :dropdown_list,
    question: 'Which of the following needs to work on the most?',
    choices: ['Techniques', 'Emotion', 'Pacing']
  },
  {
    question_type: :dropdown_list,
    question: 'Which of the following do you like the most?',
    choices: ['The performance', 'The performer(s)', 'The pacing']
  },
  {
    question_type: :stars,
    question: 'How likely are you going to recommend to your friends?'
  },
  {
    question_type: :stars,
    question: 'Please rate.'
  },
  {
    question_type: :stars,
    question: 'How likely are you coming to the next performance?'
  }
]

# Generate events and performers for all users
User.all.each do |artist|
  puts "Generating events and performers for #{artist.first_name}..."
  2.times do |i|
    event = artist.events.create!(
      name: "#{artist.first_name} #{artist.last_name} Live Concert #{i + 1}",

      start_at: Faker::Time.between_dates(from: Date.today, to: Date.today, period: :all),
      end_at: Faker::Time.between_dates(from: Date.today + 1, to: Date.today + 2, period: :all),
      description: Faker::Quote.matz,
      venue: Venue.all.sample,
      questions_and_choices: questions_and_choices.sample(4),
      enable_textbox: [true, false].sample
    )
    event.images.attach(io: File.open(Rails.root.join('app/assets/images/event-img.jpg')),
                        filename: "event-img.jpg")

    performer = artist.performers.create!(
      name: Faker::Name.name_with_middle,
      description: Faker::Quote.matz
    )
    performer.images.attach(io: File.open(Rails.root.join('app/assets/images/performer.png')),
                            filename: "performer.png")
  end
end

puts 'Generating songs...'
Event.all.each do |event|
  2.times do
    song = Song.create!(
      name: Faker::Music::RockBand.song,
      composer_name: Faker::Music::RockBand.name,
      start_at: Faker::Time.between_dates(from: event.start_at, to: event.end_at, period: :all),
      length_in_minute: Faker::Number.within(range: 1..2),
      description: Faker::Quote.matz,
      questions_and_choices: questions_and_choices.sample(4),
      enable_textbox: [true, false].sample,
      event: event
    )
    song.images.attach(io: File.open(Rails.root.join('app/assets/images/song-img.png')),
                       filename: "song-img.png")
  end
end

puts 'Attaching performers to songs...'
Song.all.each do |song|
  SongPerformer.create!(
    song: song,
    performer: song.event.user.performers.sample
  )
end

# Comments seed catagorized by sentiment
comments = [
  # positive
  'Best performance I have ever seen!',
  'Overall pretty nice :)',
  'Amazing!',
  'Amazing, I have no words.',
  'Good as hell.',
  'Amazing for the price.',
  'Splendid.',
  'Unbelievably good.',
  # neutral
  'What',
  'Neutral',
  # negative
  'Boring as hell.',
  "It's ok I guess.",
  "Worst performance I've even seen."
]

# generate event reviews and song reviews for all users
# call API to get sentiment
User.all.each do |artist|
  puts "Generating reviews for #{artist.first_name}..."
  artist.events.each do |event|
    # generate 5 event_reviews
    5.times do
      # generate responses for musician-defined questions
      responses = []
      event.questions_and_choices.each do |question_and_choice|
        responses << {
          question: question_and_choice['question'],
          response: question_and_choice['question_type'] == 'stars' ? rand(1..5) : question_and_choice['choices'].sample
        }
      end

      # add comment and sentiment if enable_textbox is true
      comment = comments.sample if event.enable_textbox
      event.event_reviews.create!(
        responses: responses,
        comment: event.enable_textbox ? comment : nil,
        sentiment: event.enable_textbox ? get_sentiment(comment) : nil
      )
    end

    # generate 5 song_reviews
    event.songs.each do |song|
      5.times do
        # generate responses for musician-defined questions
        responses = []
        song.questions_and_choices.each do |question_and_choice|
          responses << {
            question: question_and_choice['question'],
            response: question_and_choice['question_type'] == 'stars' ? rand(1..5) : question_and_choice['choices'].sample
          }
        end

        # add comment and sentiment if enable_textbox is true
        comment = comments.sample if song.enable_textbox
        song.song_reviews.create!(
          responses: responses,
          comment: song.enable_textbox ? comment : nil,
          sentiment: song.enable_textbox ? get_sentiment(comment) : nil
        )
      end
    end
  end
end

puts 'Done.'
