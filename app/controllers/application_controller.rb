class ApplicationController < ActionController::Base

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?

  helper_method :current_account
  helper_method :signif

  protected

    rescue_from CanCan::AccessDenied do |exception|
      redirect_to root_url, :alert => exception.message
    end

    # **********************************************
    #
    # Utility methods:
    #    
    def configure_permitted_parameters
      devise_parameter_sanitizer.for(:sign_up) << :name
      devise_parameter_sanitizer.for(:account_update) << :name
    end

    def signif(value, signs)
      Float("%.#{signs}g" % value)
    end

    # **********************************************
    #
    # Domain related functionality:
    #
    def get_domain(url)
      url = "http://#{url}" if URI.parse(url).scheme.nil? rescue nil
      host = URI.parse(url).host.downcase rescue nil
      host
    end

    def ensure_scheme(url)
      return nil unless url.present?
      url = "http://#{url}" unless url.starts_with?("http") || url.starts_with?('//:')
      url
    end

    # **********************************************
    #
    # Embed related functionality:
    #
    def embed_url(assessment)
      api_assessment_url(assessment, format: 'xml')
    end

    def embed_code(assessment, confidence_levels=true, eid=nil, enable_start=false, offline=false, src_url=nil, style=nil, asid=nil, per_sec=nil)
      if assessment
        url = "#{request.host_with_port}#{assessment_path('load')}?src_url=#{embed_url(assessment)}"
      elsif src_url
        url = "#{request.host_with_port}#{assessment_path('load')}?src_url=#{src_url}"
      else
        raise "You must provide an assessment or src_url"
      end
      url << "&results_end_point=#{request.scheme}://#{request.host_with_port}/api"
      url << "&assessment_id=#{assessment.id}" if assessment.present?
      url << "&confidence_levels=true" if confidence_levels.present?
      url << "&eid=#{eid}" if eid.present?
      url << "&enable_start=#{enable_start}" if enable_start.present?
      url << "&offline=true" if offline
      url << "&style=" + style if style.present?
      url << "&asid=" + asid if asid.present?
      url << "&per_sec=" + per_sec if per_sec.present?
      if assessment
        height = assessment.recommended_height || 575
      else
        height = 575
      end
      CGI.unescapeHTML(%Q{<iframe id="openassessments_container" src="//#{url}" frameborder="0" style="border:none;width:100%;height:100%;min-height:#{height}px;"></iframe>})
    end    

    # **********************************************
    #
    # Devise related functionality:
    #
    def after_sign_in_path_for(user)
      user_path(user)
    end

    # **********************************************
    #
    # Tracking related functionality:
    #
    def skip_trackable
      request.env['devise.skip_trackable'] = true
    end

    def tracking_info
      rendered_time = Time.now
      referer = request.env['HTTP_REFERER']
      if !@user = User.find_by(name: request.session.id)
        @user = User.create_anonymous
        @user.name = request.session.id
        @user.external_id = params[:user_id]
        @user.save!
      end
      [rendered_time, referer, @user]
    end

    # **********************************************
    # JWT methods
    #

    class InvalidTokenError < StandardError; end

    def validate_token
      begin
        authorization = request.headers['Authorization']
        raise InvalidTokenError if authorization.nil?

        token = request.headers['Authorization'].split(' ').last
        decoded_token = AuthToken.valid?(token)

        raise InvalidTokenError if Rails.application.secrets.auth0_client_id != decoded_token[0]["aud"]

        @user = decoded_token
      rescue JWT::DecodeError, InvalidTokenError
        render :json => { :error => "Unauthorized: Invalid token." }, status: :unauthorized
      end
    end

    # **********************************************
    # Paging methods
    #

    def setup_paging
      @page = (params[:page] || 1).to_i
      @page = 1 if @page < 1
      @per_page = (params[:per_page] || (::Rails.env=='test' ? 1 : 40)).to_i
    end

    def set_will_paginate_string
      # Because I18n.locale are dynamically determined in ApplicationController,
      # it should not put in config/initializers/will_paginate.rb
      WillPaginate::ViewHelpers.pagination_options[:previous_label] = "previous"
      WillPaginate::ViewHelpers.pagination_options[:next_label] = "next"
    end

    def setup_will_paginate
      setup_paging
      set_will_paginate_string
    end

    # **********************************************
    #
    # OAuth related functionality:
    #

    def find_consumer
      key = params[:oauth_consumer_key].strip
      Account.find_by(lti_key: key) ||
      User.find_by(lti_key: key)
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
      ExternalIdentifier.find_by(provider: @provider, identifier: @identifier)
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
             find_external_identifier(params["custom_canvas_api_domain"])

        @user = @external_identifier.user if @external_identifier

        if provider.outcome_service?
          # store lis outcome values in session
          session[:lis_result_sourcedid]    = params["lis_result_sourcedid"]
          session[:lis_outcome_service_url] = params["lis_outcome_service_url"]
          session[:lis_user_id]             = params["user_id"]
          @is_writeback = true
        end

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
          
          # MAKE SURE THAT WE REMOVE THIS because the test user doesnt have an email.
          email = params[:lis_person_contact_email_primary] || "#{params[:user_id]}@#{params["custom_canvas_api_domain"]}"
          # email = "test@test.test"
          if email.nil? || email == ""
            email = ::SecureRandom::hex(15)+"@test.test"
          end
          @user = User.new(email: email, name: name)
          @user.password             = ::SecureRandom::hex(15)
          @user.password_confirmation = @user.password
          @user.account = current_account
          @user.skip_confirmation!
          begin
            @user.save!
          rescue ActiveRecord::RecordInvalid => ex
            if ex.to_s == "Validation failed: Email has already been taken"
              @user.email = "#{params[:user_id]}@#{params["custom_canvas_api_domain"]}"
              @user.save!
            else
              raise ex
            end
          end

          @external_identifier = @user.external_identifiers.create(
            identifier: params[:user_id],
            provider: @provider,
            custom_canvas_user_id: params[:custom_canvas_user_id]
          )

          sign_in(@user, :event => :authentication)
        end
      else
        user_not_authorized
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
      render :file => "public/401.html", :status => :unauthorized
    end

    def authenticate_user_from_token!
      auth_token = params[:auth_token].presence
      user = auth_token && User.find_by(authentication_token: auth_token.to_s)

      if user
        # Notice we are passing store false, so the user is not
        # actually stored in the session and a token is needed
        # for every request. If you want the token to work as a
        # sign in token, you can simply remove store: false.
        sign_in user, store: false
      end
    end

end
