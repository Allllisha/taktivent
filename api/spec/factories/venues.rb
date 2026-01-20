# frozen_string_literal: true

FactoryBot.define do
  factory :venue do
    name { Faker::Address.community }
    address { Faker::Address.full_address }
  end
end
