class ApplicationController < ActionController::Base
  include Pundit
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?

  helper_method :current_account

  protected

    rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

    def configure_permitted_parameters
      devise_parameter_sanitizer.for(:sign_up) << :name
      devise_parameter_sanitizer.for(:account_update) << :name
    end

    # **********************************************
    #
    # OAuth related functionality:
    #
    def get_google_client(user)
      if auth = user.authentications.find_by_provider('google_oauth2')
        client = Google::APIClient.new(
          :application_name => Rails.application.secrets.application_name,
          :application_version => '1.0')
        client.authorization.client_id = Settings.google_id
        client.authorization.client_secret = Settings.google_secret
        client.authorization.scope = Settings.google_scope
        client.authorization.refresh_token = auth.refresh_token
        client
      end
    end

    def find_consumer
      key = params[:oauth_consumer_key].strip
      Account.find_by_lti_key(key) ||
      User.find_by_lti_key(key)
    end

    def check_external_identifier(user, only_build=false)
      if session[:external_identifier]
        exid = user.external_identifiers.build(:identifier => session[:external_identifier], :provider => session[:provider])
        exid.save! unless only_build
        session[:external_identifier] = nil
        session[:provider] = nil
        exid
      end
    end

    def find_external_identifier(url)
      return nil unless url.present?
      @provider = UrlHelper.host(url)
      @identifier = params[:custom_canvas_user_id] || params[:user_id]
      ExternalIdentifier.find_by_provider_and_identifier(@provider, @identifier)
    end

    def create_external_identifier_with_url(auth, user)
      json = Yajl::Parser.parse(auth['json_response'])
      key = UrlHelper.host(json['info']['url'])
      user.external_identifiers.create(:identifier => auth.uid, :provider => key) # If they already have an exernal identifier this can just fail silently
    end

    # **********************************************
    #
    # LTI related functionality:
    #

    def do_lti

      provider = IMS::LTI::ToolProvider.new(current_account.lti_key, current_account.lti_secret, params)

      if provider.valid_request?(request)

        @external_identifier = find_external_identifier(request.referer) ||
             find_external_identifier(params["launch_presentation_return_url"]) ||
             find_external_identifier(UrlHelper.host_from_instance_guid(params["tool_consumer_instance_guid"]))
        @user = @external_identifier.user if @external_identifier
        if @user
          # If we do LTI and find a different user. Log out the current user and log in the new user.
          # Log the user in
          sign_in(@user, :event => :authentication)
        else
          # Ask them to login or create an account

          # Generate a name from the LTI params
          name = params[:lis_person_name_full] ? params[:lis_person_name_full] : "#{params[:lis_person_name_given]} #{params[:lis_person_name_family]}"
          name = name.strip
          name = params[:roles] if name.blank? # If the name is blank then use their

          # If there isn't an email then we have to make one up. We use the user_id and instance guid
          email = params[:lis_person_contact_email_primary] || "#{params[:user_id]}@#{params[:tool_consumer_instance_guid]}"
          @user = User.new(email: email, name: name)
          @user.password             = ::SecureRandom::hex(15)
          @user.password_confirmation = @user.password
          @user.account = current_account
          @user.skip_confirmation!
          @user.save!

          @external_identifier = @user.external_identifiers.create(
            identifier: params[:user_id],
            provider: @provider,
            custom_canvas_user_id: params[:custom_canvas_user_id]
          )
          sign_in(@user, :event => :authentication)
        end
      end
    end

    def find_external_identifier(url)
      return nil unless url.present?
      @provider = UrlHelper.host(url)
      @identifier = params[:user_id]
      ExternalIdentifier.find_by(provider: @provider, identifier: @identifier)
    end

    # **********************************************
    #
    # Account related functionality:
    #

    def current_account
      @current_account ||= Account.find_by(code: request.subdomains.first) || Account.find_by(domain: request.host) || Account.main
    end

  private

    def user_not_authorized
      flash[:alert] = "Access denied."
      redirect_to (request.referrer || root_path)
    end

end
