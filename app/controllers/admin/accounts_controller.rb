class Admin::AccountsController < ApplicationController

  # before_filter :authenticate_user!
  # load_and_authorize_resource

  def index
    @accounts = Account.all
    respond_with(@accounts)
  end

end
