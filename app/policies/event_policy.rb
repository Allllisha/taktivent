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
      return true
    end

    def create
      return true
    end

    def edit
      return true
    end

    def update
      return true
    end

    def preview
      return true
    end

    def dashboard
      return true
    end
end
