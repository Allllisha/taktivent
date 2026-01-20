# frozen_string_literal: true

FactoryBot.define do
  factory :event_review do
    association :event
    rating { rand(1..5) }
    sentiment { %i[positive neutral negative].sample }
    comment { Faker::Lorem.sentence }
  end
end
