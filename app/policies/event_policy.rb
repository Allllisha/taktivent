class EventPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def create?
    record.user == user
  end

  def edit?
    record.user == user
  end

  def update?
    record.user == user
  end

  def preview?
    record.user == user
  end

  def analytics?
    # temp
    true
  end

  def dashboard?
    true
  end

  def new?
    true
  end

end
