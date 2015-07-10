require 'rails_helper'

describe Api::AssessmentResultsController do
  before do
    @account = FactoryGirl.create(:account)
    @user = FactoryGirl.create(:user, account: @account)
    @user.confirm!
    
    @admin = CreateAdminService.new.call
    @admin.make_account_admin({account_id: @account.id})

    @user_token = AuthToken.issue_token({ user_id: @user.id })
    @admin_token = AuthToken.issue_token({ user_id: @admin.id })
  end
  describe "POST create" do
    before do
      request.headers['Authorization'] = @admin_token
    end
    it "creates an assessment result" do
      assessment_result = FactoryGirl.build(:assessment_result)
      post :create, id: assessment_result.id, eid: "foo", format: :json
      expect(AssessmentResult.first).to_not be(nil)
      expect(AssessmentResult.first.eid).to eq("foo")
    end
    it "creates an assessment result with an src url" do
      assessment_result = FactoryGirl.build(:assessment_result)
      post :create, id: assessment_result.id, src_url: "foo", format: :json
      expect(AssessmentResult.first).to_not be(nil)
      expect(AssessmentResult.first.src_url).to eq("foo")
    end
    it "creates an assessment result with an src url" do
      assessment_result = FactoryGirl.build(:assessment_result)
      post :create, id: assessment_result.id, identifier: "foo", format: :json
      expect(AssessmentResult.first).to_not be(nil)
      expect(AssessmentResult.first.identifier).to eq("foo")
    end
    it "creates an assessment result with keywords" do
      assessment_result = FactoryGirl.build(:assessment_result)
      post :create, id: assessment_result.id, keywords: "foo, bar", format: :json
      expect(AssessmentResult.first).to_not be(nil)
      expect(AssessmentResult.first.keyword_list).to include("foo")
      expect(AssessmentResult.first.keyword_list).to include("bar")
    end
  end

end
