class Api::LtiCredentialsController < Api::ApiController
  respond_to :json

  def create
    LtiCredential.create!(lti_credentials_params.merge(enabled: true))
    render json: {message: 'ok'}
  end

  private

  def lti_credentials_params
    params.permit(:account_id, :lti_key, :lti_secret)
  end
end
