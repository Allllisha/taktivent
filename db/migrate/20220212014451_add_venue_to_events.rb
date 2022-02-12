class AddVenueToEvents < ActiveRecord::Migration[6.1]
  def change
    add_reference :events, :venue
  end
end
