# frozen_string_literal: true

class AddJtiToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :jti, :string unless column_exists?(:users, :jti)

    # Generate JTI for existing users
    reversible do |dir|
      dir.up do
        User.reset_column_information
        User.find_each do |user|
          user.update_column(:jti, SecureRandom.uuid) if user.jti.blank?
        end
      end
    end

    change_column_null :users, :jti, false
    add_index :users, :jti, unique: true unless index_exists?(:users, :jti)
  end
end
