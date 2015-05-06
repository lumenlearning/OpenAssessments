class Admin::UsersController < ApplicationController

  # before_filter :authenticate_user!
  before_filter :setup_will_paginate

  #load_and_authorize_resource :account
  #load_and_authorize_resource :user, through: :account

  # /account/1/users
  def index
    @account = Account.find(params[:account_id])
    respond_to do |format|
      format.json { render json: @account.users.paginate(page: @page, per_page: @per_paget) }
    end
  end

  # /account/1/users
  def create
    if @user = @account.create_user(create_params)
      respond_to do |format|
        format.json { render json: @user, status: success }
      end
    else
      respond_to do |format|
        format.json { render json: @user.errors, status: unprocessable_entity }
      end
    end
  end

  # /account/1/users/1
  def update
    if @user.update_attributes(update_params)
      respond_to do |format|
        format.json { render json: @user, status: success }
      end
    else
      respond_to do |format|
        format.json { render json: @user.errors, status: unprocessable_entity }
      end
    end
  end

  # /account/1/users/1
  def destroy
    @user.destroy
    respond_to do |format|
      format.json { render json: @user, status: status }
    end
  end

  private

    def create_params
      params.require(:user).permit(:name)
    end

    def update_params
      params.require(:user).permit(:role)
    end

end
