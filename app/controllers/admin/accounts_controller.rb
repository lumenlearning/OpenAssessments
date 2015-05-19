class Admin::AccountsController < ApplicationController
  before_action :validate_token

  # before_filter :authenticate_user!
  # load_and_authorize_resource

  def index
    @accounts = Account.all
    respond_to do |format|
      format.json { render json: @accounts }
    end
  end

end
