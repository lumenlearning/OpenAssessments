class Admin::AdminController < ApplicationController

  before_action :validate_token
  before_action :check_admin

  private

    def check_admin
      if !current_user.admin?
        respond_to do |format|
          format.json {
            render json: { error: "Unauthorized: User not allowed to access requested resource." }, status: :unauthorized  
          }
        end
      end
    end

end