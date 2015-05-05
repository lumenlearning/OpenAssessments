module ApplicationHelper

  def canvas_url
    session[:canvas_url] || Rails.application.secrets.canvas_url
  end
  
  def application_base_url
    request.original_url.gsub(request.original_fullpath, '')
  end

end
