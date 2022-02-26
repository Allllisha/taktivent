class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :performers, dependent: :destroy
  has_many :events, dependent: :destroy

  validates :first_name, :last_name, presence: true
end
