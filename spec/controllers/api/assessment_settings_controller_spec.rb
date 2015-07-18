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

    allow(controller).to receive(:current_account).and_return(@account)
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

  describe "PUT 'update'" do
    before do
      request.headers['Authorization'] = @user_token
      @assessment = Assessment.create(FactoryGirl.attributes_for(:assessment))
      params = {
        allowed_attempts: 10,
        per_sec: 2,
        confidence_levels: true,
        enable_start: true,
        style: "lumen_learning",
        assessment_id: @assessment.id
      }
      @assessment_setting = AssessmentSetting.create(params)
    end
    it "should update the assessment settings" do
      params = {
        allowed_attempts: 11,
        per_sec: 3,
        confidence_levels: false,
        enable_start: false,
        style: "oea",
        assessment_id: @assessment.id
      }
      put :update, id: @assessment_setting.id, assessment_setting: params, format: :json
      assessment_setting = AssessmentSetting.find(@assessment_setting.id)
      expect(assessment_setting.allowed_attempts).to eq(11)
      expect(assessment_setting.per_sec).to eq("3")
      expect(assessment_setting.confidence_levels).to eq(false)
      expect(assessment_setting.enable_start).to eq(false)
      expect(assessment_setting.style).to eq("oea")
    end
  end

end
