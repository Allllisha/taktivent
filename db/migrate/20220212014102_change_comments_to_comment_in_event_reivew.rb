class ChangeCommentsToCommentInEventReivew < ActiveRecord::Migration[6.1]
  def change
    rename_column :event_reviews, :comments, :comment
  end
end
