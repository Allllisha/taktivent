# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
puts 'Clearing database...'
Event.destroy_all
User.destroy_all
Song.destroy_all
Performer.destroy_all
Venue.destroy_all


puts 'Generating users...'
artists = []
5.times do 
   user = User.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name,email: Faker::Internet.email, password: '123123123')
   artists << user
 end

arisa = User.new(first_name: "Arisa", last_name: "Nemoto",email: "ardolce23@gmail.com", password: "a23123123")

arisa.save!
artists << arisa

tom = User.new(first_name: "Tom", last_name: "Tsui",email: "tomtsui@xxx.com", password: "1234567")
tom.save!
artists << tom

ref = User.new(first_name: "Ref", last_name: "Mags",email: "refmags@xxx.com", password: "1234567")
ref.save!
artists << ref

nico = User.new(first_name: "Nico", last_name: "Lentgen",email: "nicolaslentgen@xxx.com", password: "1234567")
nico.save!
artists << nico

puts 'Generating venue ...'
8.times do
venue = Venue.create!(
   name: Faker::Address.city_suffix, 
   address: Faker::Address.full_address
)
venue.save!
end

puts 'Generating performer ...'
8.times do
   performer = Performer.new(
     name: Faker::Name.name_with_middle,
     description: Faker::Quote.matz
   )
   performer.user = User.all.sample
    # performer.images.attach(io: File.open(Rails.root.join('app/assets/images/performer.png')),
   # filename: "performer.png")
   performer.save!
 end



puts 'Generating events ...'
8.times do
   event = Event.create!(
      name: "#{Faker::Name.name_with_middle} Live Concert",
      start_at: Faker::Time.between_dates(from: Date.today - 1, to: Date.today, period: :all),
      end_at: Faker::Time.between_dates(from: Date.today + 1, to: Date.today + 2, period: :all),
      description: Faker::Quote.matz,
      user: User.all.sample,
      venue: Venue.all.sample
   )
   event.images.attach(io: File.open(Rails.root.join('app/assets/images/event-img.jpg')),
   filename: "event-img.jpg")
   event.save!
end


puts 'Generating songs ...'
8.times do
   song = Song.create!(
      name: Faker::Music::RockBand.song,
      composer_name: Faker::Music::RockBand.name,
      start_at:  Faker::Time.between_dates(from: Date.today - 1, to: Date.today, period: :all),
      length_in_minute: Faker::Number.within(range: 10..20),
      description: Faker::Quote.matz,
      event: Event.all.sample
      )
      song.images.attach(io: File.open(Rails.root.join('app/assets/images/song-img.png')),
      filename: "song-img.png")
      song.save!
   end


puts 'Event done'
