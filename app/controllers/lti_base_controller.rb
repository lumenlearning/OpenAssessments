require 'oauth/request_proxy/rack_request'

class LtiBaseController < ApplicationController
  # **********************************************
  #
  # LTI related functionality:
  #
  def lti_provider
    params[:tool_consumer_instance_guid] ||
            UrlHelper.safe_host(request.referer) ||
            UrlHelper.safe_host(params["launch_presentation_return_url"]) ||
            UrlHelper.safe_host(params["custom_canvas_api_domain"])
  end

  def do_lti
    @lti_launch = LtiLaunch.from_params(params)

    if find_lti_credentials
      provider = @lti_credential.create_tool_provider(params)
    else
      #todo next refactor stage: when all credentials are in prod this can be removed
      # There will be a window where the first branch won't find a cred, this is for backwards compatibility during that window
      provider = IMS::LTI::ToolProvider.new(current_account.lti_key, current_account.lti_secret, params)
    end

    @lti_launch.account = current_account
    @lti_launch.lti_credential = @lti_credential

    if provider.valid_request?(request)
      @lti_launch.was_valid = true
      @isLtiLaunch = true
      @lti_provider = lti_provider
      @identifier = params[:user_id]

      @external_identifier = ExternalIdentifier.find_by(provider: @lti_provider, identifier: @identifier)

      @user = @external_identifier.user if @external_identifier

      @is_writeback = provider.outcome_service?

      if @user
        # If we do LTI and find a different user. Log out the current user and log in the new user.
        # Log the user in
        @lti_launch.user = @user if @lti_launch
        @current_user = @user
      else
        # Ask them to login or create an account

        # Generate a name from the LTI params
        name = params[:lis_person_name_full] ? params[:lis_person_name_full] : "#{params[:lis_person_name_given]} #{params[:lis_person_name_family]}"
        name = name.strip
        name = params[:roles] if name.blank? # If the name is blank then use their

        # If there isn't an email then we have to make one up. We use the user_id and instance guid
        email = params[:lis_person_contact_email_primary] || "#{params[:user_id]}@#{params["custom_canvas_api_domain"]}"
        email = "#{params[:user_id]}_#{params[:tool_consumer_instance_guid].try(:strip)}@example.com" if email.blank?
        @user = User.new(email: email, name: name)
        @user.password = ::SecureRandom::hex(15)
        @user.password_confirmation = @user.password
        @user.account = current_account
        @user.skip_confirmation!
        @user.skip_confirmation_notification!

        count = 0
        while !safe_save_email(@user) && count < 10 do
          # Email was taken. Generate a fake email and save again
          @user.email = "#{params[:user_id]}_#{count}_#{params[:tool_consumer_instance_guid].try(:strip)}@example.com"
          count = count + 1
        end

        @external_identifier = @user.external_identifiers.create!(
                identifier: @identifier,
                provider: @lti_provider,
                custom_canvas_user_id: params[:custom_canvas_user_id]
        )

        @lti_launch.user = @user if @lti_launch
        @current_user = @user
      end
    else
      @lti_launch.launch_error_message = "Invalid LTI request."
      user_not_authorized
    end

  rescue OpenAssessments::LtiError
    @message = "We don't recognize your account."
    @lti_launch.launch_error_message = $!.message + @message if @lti_launch
    user_not_authorized
  ensure
    @lti_launch.save! if @lti_launch
  end

  def safe_save_email(user)
    begin
      user.save!
    rescue ActiveRecord::RecordInvalid => ex
      if ex.to_s == "Validation failed: Email has already been taken"
        false
      elsif ex.to_s == "Validation failed: Email is invalid"
        false
      else
        raise ex
      end
    end
  end

  # Finds the LtiCredential & Account based on the oauth_consumer_key
  def find_lti_credentials
    raise OpenAssessments::NoLtiKey unless params["oauth_consumer_key"].present?

    if @lti_credential = LtiCredential.enabled.where(lti_key: params["oauth_consumer_key"]).first
      @current_account = @lti_credential.account

      @lti_credential
    else
      #todo: next refactor stage: can't raise now for backwards-compatibility
      # raise OpenAssessments::UnknownLtiKey
      nil
    end
  end
end