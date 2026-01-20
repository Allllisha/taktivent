# frozen_string_literal: true

class CreateInitialTables < ActiveRecord::Migration[7.1]
  def change
    # Users (Devise)
    create_table :users do |t|
      t.string :email, null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :reset_password_token
      t.datetime :reset_password_sent_at
      t.datetime :remember_created_at
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.timestamps
    end
    add_index :users, :email, unique: true
    add_index :users, :reset_password_token, unique: true

    # Venues
    create_table :venues do |t|
      t.string :name, null: false
      t.string :address
      t.float :latitude
      t.float :longitude
      t.timestamps
    end

    # Events
    create_table :events do |t|
      t.string :name, null: false
      t.datetime :start_at, null: false
      t.datetime :end_at, null: false
      t.text :description
      t.references :user, null: false, foreign_key: true
      t.references :venue, foreign_key: true
      t.jsonb :questions_and_choices, default: {}, null: false
      t.boolean :enable_textbox, default: true
      t.timestamps
    end

    # Performers
    create_table :performers do |t|
      t.string :name, null: false
      t.text :description
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end

    # Songs
    create_table :songs do |t|
      t.string :name, null: false
      t.string :composer_name, null: false
      t.datetime :start_at, null: false
      t.integer :length_in_minute, null: false
      t.text :description
      t.references :event, null: false, foreign_key: true
      t.jsonb :questions_and_choices, default: {}, null: false
      t.boolean :enable_textbox, default: true
      t.timestamps
    end

    # Song Performers (join table)
    create_table :song_performers do |t|
      t.references :song, null: false, foreign_key: true
      t.references :performer, null: false, foreign_key: true
      t.timestamps
    end

    # Event Reviews
    create_table :event_reviews do |t|
      t.text :comment
      t.references :event, null: false, foreign_key: true
      t.integer :sentiment
      t.integer :rating
      t.jsonb :responses, default: {}, null: false
      t.timestamps
    end

    # Song Reviews
    create_table :song_reviews do |t|
      t.text :comment
      t.references :song, null: false, foreign_key: true
      t.integer :sentiment
      t.integer :rating
      t.jsonb :responses, default: {}, null: false
      t.timestamps
    end
  end
end
