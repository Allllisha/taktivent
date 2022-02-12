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

nico = User.new(first_name: "Nico", last_name: "Lentgen",email: "nicolaslentgen@xxx.com", password: "1234567")
nico.save!


artists.each do |artist|
puts 'Generating events ...'
  5.times do
    Event.create(
      name: ["#{artist.first_name} #{artist.last_name}:National Tour", "LIVE!!: #{artist.first_name} #{artist.last_name}"].sample,
      start_at: Faker::Time.forward,
      description: Faker::Lorem.paragraphs,
      user: User.all.sample
  )
  end
end
  puts 'Event done'
