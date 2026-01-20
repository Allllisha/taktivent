# frozen_string_literal: true

class SongPerformer < ApplicationRecord
  belongs_to :song
  belongs_to :performer
end
