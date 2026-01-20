# frozen_string_literal: true

FactoryBot.define do
  factory :performer do
    association :user
    name { Faker::Music.band }
    description { Faker::Lorem.sentence }
  end
end
