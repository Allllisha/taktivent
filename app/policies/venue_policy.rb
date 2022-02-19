class VenuePolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
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

  def analytics
    return true
  end
end
