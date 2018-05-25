require 'jwt'

module AuthToken
  ADMIN_SCOPES = 'admin_scopes'
  EDIT_ID_SCOPE = 'edit_id_scope'
  FULL_SERVICE_API_ACCESS = 'full_service_api_access'

  # More information on jwt available at
  # http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#rfc.section.4.1.6
  def AuthToken.issue_token(payload, exp=24.hours.from_now)
    payload['iat'] = DateTime.now.to_i    # issued at claim
    payload['exp'] = exp.to_i if exp      # Default expiration set to 24 hours.
    payload['aud'] = Rails.application.secrets.auth0_client_id
    JWT.encode(payload, Rails.application.secrets.auth0_client_secret, 'HS512')
  end

  def AuthToken.valid?(token)
    JWT.decode(token, Rails.application.secrets.auth0_client_secret)
  end
end
