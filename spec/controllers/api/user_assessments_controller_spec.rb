require 'rails_helper'

describe Api::UserAssessmentsController do
  before do 
    @account = FactoryGirl.create(:account)
    @user = FactoryGirl.create(:user, account: @account)
    @user.confirm!
    
    @admin = CreateAdminService.new.call
    @admin.make_account_admin({account_id: @account.id})

    @user_token = AuthToken.issue_token({ user_id: @user.id })
    @admin_token = AuthToken.issue_token({ user_id: @admin.id })

    allow(controller).to receive(:current_account).and_return(@account)
  end
  describe "PUT update" do
    before do
      request.headers['Authorization'] = @admin_token
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