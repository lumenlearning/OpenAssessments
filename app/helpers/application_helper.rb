module ApplicationHelper

  def canvas_url
    session[:canvas_url] || Rails.application.secrets.canvas_url
  end
  
  def available_styles 
    [
      ['oea', ''], 
      ['bw', 'bw'], 
      ['ocw', 'ocw']
    ]
  end

  def application_base_url
    File.join(request.base_url, "/")
  end

  def jwt_token
    return unless signed_in?

    payload = { user_id: current_user.id }
    if @lti_role == 'admin' && @external_context_id
      payload[AuthToken::ADMIN_SCOPES] = [@external_context_id]
    end
    if @lti_launch
      payload[:lti_launch_id] = @lti_launch.id
    end
    AuthToken.issue_token(payload)
  end

  def client_images(*images)
    map = images.map { |image| %Q{#{image.gsub('/', '_').gsub('.', '_')} : "#{image_path(image)}"} }
    "{ #{map.join(", ")} }".html_safe
  end

end
