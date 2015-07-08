require 'rails_helper'

describe Api::UserAssessmentsController do

  describe "PUT update" do
    before do
      @user_assessment = UserAssessment.create({
        :eid => "abcdefg",
        :attempts => 0
        })
    end

    it "increments the users attempts upon update" do
      put :update, id: "abcdefg", format: :json
      expect(UserAssessment.first.attempts).to eq(1)
    end
  end

end