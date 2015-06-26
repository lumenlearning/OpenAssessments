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
    user_params = FactoryGirl.attributes_for(:user)
    user_params[:name] = create_params[:name]
    user_params[:email] = create_params[:email]
    user_params[:role] = create_params[:role]
    @account = Account.find(params[:account_id])
    if @user = @account.users.create(user_params)
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
  def update
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
    @user = User.find(params[:id]);
    @user.destroy
    respond_to do |format|
      format.json { render json: @user }
    end
  end
  
  private

    def create_params
      params.require(:user).permit(
        :name,
        :email,
        :role,
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
