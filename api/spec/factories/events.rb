# frozen_string_literal: true

FactoryBot.define do
  factory :event do
    association :user
    association :venue
    name { Faker::Music.band + ' Concert' }
    description { Faker::Lorem.paragraph }
    start_at { 1.day.from_now }
    end_at { 1.day.from_now + 2.hours }
  end
end
