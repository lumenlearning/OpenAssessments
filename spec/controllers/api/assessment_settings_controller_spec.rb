require 'rails_helper'

describe Api::AssessmentSettingsController do
  
  before do
    @account = FactoryGirl.create(:account)
    @user = FactoryGirl.create(:user, account: @account)
    @user.confirm!
    
    @admin = CreateAdminService.new.call
    @admin.make_account_admin({account_id: @account.id})

    @user_token = AuthToken.issue_token({ user_id: @user.id })
    @admin_token = AuthToken.issue_token({ user_id: @admin.id })
  end

  describe "GET index" do
    before do
      request.headers['Authorization'] = @user_token
      @assessment = Assessment.create(FactoryGirl.attributes_for(:assessment))
      @assessment_setting = AssessmentSetting.create({allowed_attempts: 10})
    end

    it "should get the assessment_settings" do
      get :index, format: :json
      expect(response).to have_http_status(:success)
    end
  end
  describe "POST create" do
    before do
      request.headers['Authorization'] = @user_token
      @assessment = Assessment.create(FactoryGirl.attributes_for(:assessment))
    end
    it "should create a valid assessement setting" do
      params = {
        allowed_attempts: 10,
        per_sec: 2,
        confidence_levels: true,
        enable_start: true,
        style: "lumen_learning",
        assessment_id: @assessment.id
      }
      post :create, assessment_setting: params, format: :json
      expect(response).to have_http_status(:success)
    end

  end

end
