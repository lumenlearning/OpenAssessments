class Api::ApiController < ApplicationController
  respond_to :json

  before_action :validate_token
  before_action :skip_trackable

  skip_before_action :verify_authenticity_token

  # Set the user and LtiLaunch
  def valid_token_callback(payload, header)
    @admin_scopes = payload[AuthToken::ADMIN_SCOPES] ? payload[AuthToken::ADMIN_SCOPES] : []
    if payload['lti_launch_id']
      @user = User.find(payload['user_id'])
      @current_user = @user
      @lti_launch = @user.lti_launches.find_by_id(payload['lti_launch_id'])
    else
      @user = User.find(payload['user_id'])
      @current_user = @user
    end
  end

  # When a teacher/admin launches into a quiz the JWT they're issued lists the current
  # lti context_id so that they can do administrative tasks in the scope of the
  # course.
  def token_has_admin_scope(context_id)
    @admin_scopes && @admin_scopes.member?(context_id)
  end
end