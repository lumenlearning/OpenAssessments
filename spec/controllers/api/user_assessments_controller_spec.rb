require 'rails_helper'

describe Api::UserAssessmentsController do

  describe "PUT update" do
    before do
      @assessment = Assessment.create(FactoryGirl.attributes_for(:assessment));
      @user_assessment = @assessment.user_assessments.create({
        :eid => "abcdefg",
        :attempts => 0
        })
    end

    it "increments the users attempts upon update" do
      params = {
        :accountId => @assessment.id
      }
      put :update, id: "abcdefg", assessmentId: @assessment.id, format: :json
      expect(UserAssessment.first.attempts).to eq(1)
    end
  end

end