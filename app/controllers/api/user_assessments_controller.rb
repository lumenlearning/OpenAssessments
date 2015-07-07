class Api::UserAssessmentsController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :skip_trackable
  respond_to :json
  
  def update
    user_assessment = UserAssessment.where(eid: params[:id]).first
    if !user_assessment.nil?
      user_assessment.attempts += 1
      user_assessment.save!
    end
    respond_with(:api, user_assessment)
  end 

end
