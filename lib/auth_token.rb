require 'jwt'

module AuthToken
  def AuthToken.issue_token(payload, exp=24.hours.from_now)
    payload['exp'] = exp.to_i # Default expiration set to 24 hours.
    payload['aud'] = Rails.application.secrets.auth0_client_id
    JWT.encode(payload, Rails.application.secrets.auth0_client_secret, 'HS512')
  end

  def AuthToken.valid?(token)
    JWT.decode(token, Rails.application.secrets.auth0_client_secret)
  end
end
