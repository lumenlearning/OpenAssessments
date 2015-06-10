class Api::GradesController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :skip_trackable
  respond_to :json

  def create

    # store lis stuff in session
    params = {
      lis_result_sourcedid: session[:lis_result_sourcedid],
      lis_outcome_service_url: session[:lis_outcome_service_url],
      user_id: session[:lis_user_id]
    }
    provider = IMS::LTI::ToolProvider.new(current_account.lti_key, current_account.lti_secret, params)

    # post the given score to the TC
    score = (params['score'] != '' ? params['score'] : nil)
    res = provider.post_replace_result!(params['score'])

    # Need to figure out error handling - these will need to be passed to the client
    # or we can also post scores async using activejob in which case we'll want to
    # log any errors and make them visible in the admin ui
    success = res.success?
      
    # Ping analytics server
  end
  
end