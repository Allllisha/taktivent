# frozen_string_literal: true

module Api
  module V1
    module Auth
      class CurrentUserController < Api::V1::BaseController
        def show
          render_success(UserBlueprint.render_as_hash(current_user))
        end
      end
    end
  end
end
