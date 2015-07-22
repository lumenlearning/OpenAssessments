class Ability
  include CanCan::Ability

  def initialize(user, account)

    # Define abilities for the passed in user here. For example:
    #
    #   user ||= User.new # guest user (not logged in)
    #   if user.admin?
    #     can :manage, :all
    #   else
    #     can :read, :all
    #   end
    #
    # The first argument to `can` is the action you are giving the user
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on.
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/CanCanCommunity/cancancan/wiki/Defining-Abilities

    user ||= User.new # guest user (not logged in)

    basic(user, account)
    account_admin(user, account) if account.present? && user.account_admin?(account)
    admin(user, account) if user.admin?
  end

  def basic(user, account)
    can :manage, User, id: user.id
    can :read, Assessment, kind: "formative"
    can :read, Assessment, user_id: user.id
    cannot :read, Account
    if !account.restrict_assessment_create
      can :manage, Assessment, user_id: user.id
    end
  end

  def admin(user, account)
    can :read, :all
    can :manage, :all
  end

  def account_admin(user, account)
    can :read, Account, id: user.account_ids
    can :update, Account, id: account.id
  end
end
