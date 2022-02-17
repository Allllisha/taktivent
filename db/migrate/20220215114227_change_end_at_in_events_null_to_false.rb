class ChangeEndAtInEventsNullToFalse < ActiveRecord::Migration[6.1]
  def change
    change_column_null :events, :end_at, false
  end
end
