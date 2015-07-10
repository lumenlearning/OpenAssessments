class Api::UserAssessmentsController < ApplicationController
  
  respond_to :json

  before_action :validate_token
  before_action :skip_trackable
  
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
