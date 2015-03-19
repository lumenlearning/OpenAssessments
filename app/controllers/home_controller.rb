class HomeController < ApplicationController
  before_filter :authenticate_user!
  
  def index
    auth = current_user.authentications.find_by(provider: 'canvas')
    api = Canvas.new(current_account.canvas_uri, auth.token)
  end

end
