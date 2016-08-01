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
    return unless current_user

    payload = { user_id: current_user.id }
    if @lti_role == 'admin' && @external_context_id
      payload[AuthToken::ADMIN_SCOPES] = [@external_context_id]
    end
    if @edit_id
      payload[AuthToken::EDIT_ID_SCOPE] = @edit_id
    end
    if @lti_launch
      payload[:lti_launch_id] = @lti_launch.id
    end
    AuthToken.issue_token(payload)
  end

  # Created map of image name to path
  # {
  #   "Books_svg": "/assets/Books.svg",
  #   "PersonWithBook_svg": "/assets/PersonWithBook.svg",
  #   "ProgressIcon_svg": "/assets/ProgressIcon.svg",
  #   "QuizIcon_svg": "/assets/QuizIcon.svg",
  #   "CheckMark_svg": "/assets/CheckMark.svg"
  # }
  def client_images(*images)
    images.inject({}){|map, image| map[image.gsub('/', '_').gsub('.', '_')] = image_path(image); map }
  end

end
