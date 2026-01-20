# frozen_string_literal: true

FactoryBot.define do
  factory :song do
    association :event
    name { Faker::Music.album }
    composer_name { Faker::Name.name }
    description { Faker::Lorem.sentence }
    start_at { 1.day.from_now }
    length_in_minute { rand(3..10) }
  end
end
