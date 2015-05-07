class LtiInstallsController < ApplicationController

  before_filter :authenticate_user!
  before_filter :validate_account!

  def new

    auth = current_user.authentications.find_by(provider: 'canvas')
    if auth
      api = Canvas.new(current_account.canvas_uri, auth.token)
      @accounts = api.all_accounts.map{|a| OpenStruct.new(a) }
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
    
    # Install the LTI tool into each selected account
    api.all_accounts.find_all{|a| params[:lti_install][:account_ids].include?(a['id'].to_s) }.each do |canvas_account|
      result = Integrations::CanvasAccountsLti.setup(
        canvas_account, 
        main_account.lti_key, 
        main_account.lti_secret,
        main_account.canvas_uri,
        auth.token, 
        lti_options
      )
      
      # Check the result to make sure there wasn't an error
      if(!result['id'])
        @errors << canvas_account
      else
        @accounts << canvas_account
      end

    end

    # Install the LTI tool into each selected course
    api.courses.find_all{|a| params[:lti_install][:course_ids].include?(a['id'].to_s) }.each do |canvas_course|
      result = Integrations::CanvasCoursesLti.setup(
        canvas_course,
        main_account.lti_key, 
        main_account.lti_secret,
        auth, 
        lti_options
      )

      # Check the result to make sure there wasn't an error
      if(!result['id'])
        @errors << canvas_course
      else
        @courses << canvas_course
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