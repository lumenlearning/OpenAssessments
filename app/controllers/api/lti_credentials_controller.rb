class Api::LtiCredentialsController < Api::ApiController
  respond_to :json

  def index
    scope = LtiCredential
    scope = scope.where("name ILIKE ?", "%#{params[:name].strip}%") if params[:name]
    scope = scope.where(lti_key: params[:lti_key]) if params[:lti_key]

    scope = scope.order("LOWER(name) ASC")

    page = params[:page].blank? ? "1" : params[:page]
    page = "1" if page == "0"
    scope = scope.paginate(:page => page, :per_page => params[:per_page])

    render json: scope.to_a.map {|lc| serializer(lc)}
  end

  def show
    cred = LtiCredential.find_by(lti_key: params[:id])
    unless cred
      render status: 404, json: {"errors": ["LTI Credential not found"]}
      return
    end

    render json: serializer(cred)
  end

  def create
    # make sure key doesn't already exist
    if LtiCredential.where(lti_key: params[:lti_key]).any?
      render status: 400, json: {"errors": ["LTI Credential with that key already exists"]}
      return
    end

    cred = LtiCredential.create(lti_credential_params.merge(account_id: Account.first.id, enabled: true))

    if cred.save
      render json: serializer(cred)
    else
      render status: 400, json: {"errors": cred.errors}
    end
  end

  def update
    cred = LtiCredential.find_by(lti_key: params[:id])
    unless cred
      render status: 404, json: {"errors": ["LTI Credential not found"]}
      return
    end

    cred.update(lti_credential_params)

    if cred.save
      render json: serializer(cred)
    else
      render status: 400, json: {"errors": cred.errors}
    end
  end

  private

  def valid_token_callback(payload, header)
    unless payload['scopes'] && payload['scopes'].member?(AuthToken::FULL_SERVICE_API_ACCESS)
      render status: 401, json: {"errors": ["API Token not allowed to access LTI Credentials"]}
    end
  end

  def serializer(cred)
    {
            name: cred.name,
            lti_key: cred.lti_key,
            account_id: cred.account_id,
            enabled: cred.enabled,
            created_at: cred.created_at
    }
  end

  def lti_credential_params
    params.permit(:account_id, :lti_key, :lti_secret, :enabled, :name)
  end

end
