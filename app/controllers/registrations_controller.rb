class RegistrationsController < Devise::RegistrationsController
  
  before_action :update_sanitized_params, if: :devise_controller?
  before_action :check_registration_restrictions

  def update_sanitized_params
    devise_parameter_sanitizer.for(:sign_up) {|u| u.permit(:name, :email, :password, :password_confirmation)}
    devise_parameter_sanitizer.for(:account_update) {|u| u.permit(:name, :email, :password, :password_confirmation, :current_password)}
  end

  private
    def check_registration_restrictions
      user_not_authorized if current_account.restrict_signup
    end
end
