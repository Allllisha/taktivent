# frozen_string_literal: true

FactoryBot.define do
  factory :song_review do
    association :song
    rating { rand(1..5) }
    sentiment { %i[positive neutral negative].sample }
    comment { Faker::Lorem.sentence }
  end
end
