class LtiLaunchesController < ApplicationController

  layout "assessment"
  
  skip_before_filter :verify_authenticity_token
  before_filter :check_lti

  def index

    @assessment_id = @assessment ? @assessment.id : params[:assessment_id] || 'null'
    @external_user_id = params[:external_user_id] if params[:external_user_id]
    @eid = params[:eid] if params[:eid]
    
    respond_to do |format|
      format.html { render layout: 'assessment' }
    end

  end

  protected

    def check_lti
      if request.post?
        do_lti
      else
      end
    end

end
