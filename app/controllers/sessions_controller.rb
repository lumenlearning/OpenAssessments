class SessionsController < Devise::SessionsController
  
  def destroy
    current_user.authentications.where(provider: 'canvas').destroy_all
    super
  end

end