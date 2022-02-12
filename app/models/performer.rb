class Performer < ApplicationRecord
  has_many_attached :photos

  validate :name, presence: true
end
