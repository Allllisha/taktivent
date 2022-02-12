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
  user = User.create(email: Faker::Internet.email, password: '123123123')
  # :first_name: Faker::Name.first_name, last_name
  artists << user
 end

arisa = User.new(
   email: "ardolce23@gmail.com", password: "a23123123"
)
# first_name: "Arisa", last_name: "Nemoto",
arisa.save!
artists << arisa

tom = User.new(
   email: "tomtsui@xxx.com", password: "1234567"
)
# first_name: "Tom", last_name: "Tsui",
tom.save!
artists << tom

ref = User.new(
   email: "refmag@xxx.com", password: "1234567"
)
# first_name: "Ref", last_name: "Mags",
ref.save!

nico = User.new(
   email: "nicolaslentgen@xxx.com", password: "1234567"
)
# first_name: "Nico", last_name: "Lentgen",
nico.save!


# artists.each do |user|
# puts 'Generating events ...'
#   5.times do
#     Event.create (
#       name: [],
#       start_at: ,
#       description: ,
#       images: ,
#   )
#   end