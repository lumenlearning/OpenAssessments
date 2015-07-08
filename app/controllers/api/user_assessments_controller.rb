class Api::UserAssessmentsController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :skip_trackable
  respond_to :json
  
  def update
    assessment = Assessment.find(params[:assessmentId])
    if assessment != nil
      user_assessment = assessment.user_assessments.where(eid: params[:id]).first
      if !user_assessment.nil?
        user_assessment.attempts += 1
        user_assessment.save!
      end
    end
    respond_with(:api, user_assessment)
  end 

end
