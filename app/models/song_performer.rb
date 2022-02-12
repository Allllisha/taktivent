class SongPerformer < ApplicationRecord
  belongs_to :song
  belongs_to :performer
end
