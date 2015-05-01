class LtiInstallsController < ApplicationController

  before_filter :authenticate_user!
  before_filter :validate_account!

  def new

    auth = current_user.authentications.find_by(provider: 'canvas')
    if auth
      api = Canvas.new(current_account.canvas_uri, auth.token)
      @accounts = api.accounts.map{|a| OpenStruct.new(a) }
      @courses = api.courses.map{|a| OpenStruct.new(a) }
    else
      flash[:info] = "Please authenticate with Canvas before attempting to install an LTI tool"
      redirect_to new_canvas_authentication_path
    end

  end

  def create

    auth = current_user.authentications.find_by(provider: 'canvas')

    if auth.blank?
      flash[:info] = "Please authenticate with Canvas before attempting to install an LTI tool"
      redirect_to new_canvas_authentication_path
      return
    end
      
    api = Canvas.new(current_account.canvas_uri, auth.token)
    
    main_account = current_user.account

    @errors = []
    @accounts = []
    @courses = []

    selected_accounts = api.accounts.find_all{|a| params[:lti_install][:account_ids].include?(a['id']) }

    # Validate that the user has admin level access
    selected_accounts.each do |canvas_account|
      
      canvas_account['asset_url'] = "https://#{Rails.application.secrets.canvas_tools_assets_domain}/#{account_code}"
      canvas_account['settings_url'] = "#{main_account.canvas_uri}/accounts/#{canvas_account['id']}/settings"

      account_code = "#{main_account.code}"
      lti_options = {
        launch_url: "https://#{account_code}.#{Rails.application.secrets.lti_launch_domain}/lti_launches",
        env: Rails.env,
        title: Rails.application.secrets.lti_tool_name,
        description: Rails.application.secrets.lti_tool_description,
        icon: "No ICO",
        domain: "#{account_code}.#{Rails.application.secrets.lti_launch_domain}",
        course_navigation: {
          text: Rails.application.secrets.lti_tool_name,
          visibility: "admins",
          default: "enabled",
          enabled: true
        } 
      }
      
      # Install the LTI tool into each account
      result = Integrations::CanvasAccountsLti.setup(
        canvas_account, 
        main_account.lti_key, 
        main_account.lti_secret,
        main_account.canvas_uri,
        main_account.canvas_token, 
        lti_options
      )

      # Check the result to make sure there wasn't an error
      if(!result['id'])
        @errors << canvas_account
      else
        @accounts << canvas_account
      end

    end

  end

  private 

    def validate_account!
      if !current_user.account.present?
        flash[:notice] = "No valid account was detected for the current user. Please sign in again."
        sign_out(current_user)
        redirect_to new_user_session_path
      end
    end

end