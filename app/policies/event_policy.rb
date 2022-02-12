class EventPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end
    def show
      return true
    end

    def new
      record.user == user
    end

    def create
      record.user == user
    end

    def edit
      record.user == user
    end

    def update
      record.user == user
    end

    def preview
      record.user == user
    end

    def analytics
      record.user == user
    end
end
