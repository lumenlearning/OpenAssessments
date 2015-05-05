class Admin::UsersController < ApplicationController

  # before_filter :authenticate_user!
  # load_and_authorize_resource

  def index
    @account = Account.find(params[:account_id])
    respond_to do |format|
      format.json { render json: @account.users }
    end
  end

end
