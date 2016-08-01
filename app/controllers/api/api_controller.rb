class Api::ApiController < ApplicationController
  respond_to :json

  before_action :validate_token
  before_action :skip_trackable

  skip_before_action :verify_authenticity_token

  # Set the user and LtiLaunch
  def valid_token_callback(payload, header)
    @admin_scopes = payload[AuthToken::ADMIN_SCOPES] ? payload[AuthToken::ADMIN_SCOPES] : []
    @edit_id_scope = payload[AuthToken::EDIT_ID_SCOPE] ? payload[AuthToken::EDIT_ID_SCOPE] : nil

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

  # If it's an LTI Edit launch this scope is added to the JWT
  # So you can only edit quizzes you launched to with this edit_id
  def token_has_edit_id_scope(edit_id)
    edit_id.nil? || @edit_id_scope.nil? || @edit_id_scope == edit_id
  end

  # makes sure the JWT token allows admin scope for this LTI context id
  def ensure_context_admin
    return true if @lti_launch && token_has_admin_scope(@lti_launch.lti_context_id)
    render :json => { :error => "Unauthorized" }, status: :unauthorized
    false
  end
end