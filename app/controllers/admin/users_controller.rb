class Admin::UsersController < ApplicationController
  respond_to :json

  # before_filter :authenticate_user!
  before_filter :setup_will_paginate

  #load_and_authorize_resource :account
  #load_and_authorize_resource :user, through: :account

  # /account/1/users
  def index
    @account = Account.find(params[:account_id])
    @users = @account.users
    respond_to do |format|
        format.json { render json: @account.users.paginate(page: @page, per_page: @per_page) }
    end
  end

  # /account/1/users
  def create
    @account = Account.find(params[:account_id])
    if @user = @account.users.create(create_params)
      respond_with @user
    else
      respond_with @user.errors
    end
  end

  # /account/1/users/1
  def update
    byebug
    @user = User.find(params[:id])
    if @user.update_attributes(update_params)
      respond_to do |format|
        format.json { render json: @user }
      end
    else
     respond_to do |format|
        format.json { render json: @user.errors, status: :unprocessable_entity}
      end
    end
  end

  # /account/1/users/1
  def destroy
    @user.destroy
    respond_with @user
  end

  private

    def create_params
      params.require(:user).permit(
        :name,
        :email,
        :password,
        :password_confirmation
        )
    end

    def update_params
      params.require(:user).permit(
        :name,
        :email,
        :role
        )
    end

end
