require 'rails_helper'

RSpec.describe Api::AssessmentsController, type: :controller do
  before do
    file = File.join(__dir__, '../../fixtures/assessment.xml')
    @xml = open(file).read

    @account = FactoryGirl.create(:account)
    @account.restrict_assessment_create = false
    @account.save!
    @user = FactoryGirl.create(:user, account: @account)
    @user.confirm!
    
    @admin = CreateAdminService.new.call
    @admin.make_account_admin({account_id: @account.id})

    @user_token = AuthToken.issue_token({ user_id: @user.id })
    @admin_token = AuthToken.issue_token({ user_id: @admin.id })

    allow(controller).to receive(:current_account).and_return(@account)
  end

  describe "GET 'index'" do

    before do
      request.headers['Authorization'] = @admin_token
    end
    it "returns http success" do
      FactoryGirl.create(:assessment)
      get 'index', format: :json, q: 'Question'
      expect(response).to have_http_status(200)
    end
    describe "search" do
      before do
        request.headers['Authorization'] = @admin_token
        @assessment = FactoryGirl.create(:assessment, title: "#{FactoryGirl.generate(:name)} batman dark knight", description: "#{FactoryGirl.generate(:description)} shrimp on the barbie")
        @outcome = FactoryGirl.create(:outcome)
        @assessment_outcome = FactoryGirl.create(:assessment_outcome, assessment: @assessment, outcome: @outcome)
      end
      it "should return the assessment from the title" do
        get 'index', format: :json, q: @assessment.title
        expect(assigns(:assessments)).to include(@assessment)
      end
      it "should return the assessment from the title" do
        get 'index', format: :json, q: "batman"
        expect(assigns(:assessments)).to include(@assessment)
      end
      it "should return the assessment from the description" do
        get 'index', format: :json, q: @assessment.description
        expect(assigns(:assessments)).to include(@assessment)
      end
      it "should return the assessment from the description" do
        get 'index', format: :json, q: "shrimp"
        expect(assigns(:assessments)).to include(@assessment)
      end
    end
  end

  describe "GET 'show'" do
    before do
      request.headers['Authorization'] = @admin_token
      @assessment = FactoryGirl.create(:assessment, account: @account, xml_file: @xml)
    end

    context "json" do
      it "returns http success" do
        get 'show', format: :json, id: @assessment.id
        expect(response).to have_http_status(200)
      end
    end

    context "xml" do
      it "renders the assessment QTI xml" do
        get 'show', format: :xml, id: @assessment.id
        expect(response).to have_http_status(200)
      end

      it "should use the per_sec value on the settings" do
        @assessment.assessment_settings.create({per_sec: 1})

        get :show, format: :xml, id: @assessment.id

        node = Nokogiri::XML(response.body)
        expect(node.css('item').count).to eq 1
      end

    end
  end

  describe "POST 'create'" do
    before do
      request.headers['Authorization'] = @admin_token
      @user = FactoryGirl.create(:user)
    end

    # context "xml" do

      # it "denies unauthenticated requests" do
      #   request.headers['Authorization'] = ""
      #   request.env['RAW_POST_DATA'] = @xml
      #   post :create, format: :xml
      #   expect(response.status).to eq(401)
      # end
      
      # it "creates an assessment xml" do
      #   request.headers['Authorization'] = @admin_token
      #   request.env['RAW_POST_DATA'] = @xml
      #   post :create, auth_token: @user.authentication_token, format: :xml
      #   expect(response).to have_http_status(201)
      # end

    # end


    context "json" do
      
      it "creates an assessment json" do
        xml_file = Rack::Test::UploadedFile.new File.join(Rails.root, 'spec', 'fixtures', 'assessment.xml')
        params = FactoryGirl.attributes_for(:assessment)
        params[:title] = 'Test'
        params[:description] = 'Test description'
        params[:xml_file] = xml_file
        params[:license] = 'test'
        post :create, assessment: params, format: :json
        expect(response).to have_http_status(201)
      end

    end

  end

  describe "PUT 'update'" do
    before(:each) do
      request.headers['Authorization'] = @admin_token
      @assessment = FactoryGirl.create(:assessment, account: @account, xml_file: @xml)
    end

    it "should update an assessment" do
      xml_file = Rack::Test::UploadedFile.new File.join(Rails.root, 'spec', 'fixtures', 'assessment.xml')
      params = {}
      params[:title] = 'Test'
      params[:description] = 'Test description'
      params[:xml_file] = xml_file
      params[:license] = 'test'
      put :update, account_id: @account, id: @assessment.id, assessment: params, format: :json
      assessment = Assessment.find(@assessment.id)
      expect(assessment.title).to eq("Test")
      expect(assessment.description).to eq("Test description")
      expect(assessment.assessment_xmls.length).to eq(2)
      with = assessment.xml_with_answers
      expect(with).to include("conditionvar")
      expect(with).to include("Neptune")
      expect(assessment.xml_without_answers).not_to include("conditionvar")
      expect(response).to have_http_status(:success)
    end

    it "doesn't delete assessment xmls if there is not a new xml file" do
      params = {}
      params[:title] = 'Test'
      params[:description] = 'Test description'
      params[:license] = 'test'
      put :update, account_id: @account, id: @assessment.id, assessment: params, format: :json
      assessment = Assessment.find(@assessment.id)
      expect(assessment.assessment_xmls.length).to eq(1)
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST #copy" do
    before(:each) do
      @copy_admin_token = AuthToken.issue_token({sub: 'test', scopes:['root_assessment_copier'], user_id: @admin.id})
      request.headers['Authorization'] = @copy_admin_token
      @assessment = FactoryGirl.create(:assessment, account: @account, xml_file: @xml)
    end

    let(:params) {{assessment_id: @assessment.id, assessment_id: @assessment.id, edit_id: "testedit", context_ids_to_update: "oi,hoyt", format: :json}}

    context "authorization" do
      it "should accept a root_assessment_copier token" do
        post :copy, params
        expect(response).to have_http_status(200)
      end

      it "should reject an admin token" do
        request.headers['Authorization'] = @admin_token
        post :copy, params
        expect(response).to have_http_status(401)
      end

      it "should reject a user token" do
        request.headers['Authorization'] = @user_token
        post :copy, params
        expect(response).to have_http_status(401)
      end

      it "should reject no auth" do
        request.headers['Authorization'] = nil
        post :copy, params
        expect(response).to have_http_status(401)
      end

    end

    it "should error if no edit_id" do
      params.delete :edit_id
      post :copy, params
      json = JSON.parse response.body

      expect(response).to have_http_status(400)
      expect(json["error"]).to eq "param is missing or the value is empty: edit_id"
    end

    it "should error if no context_ids_to_update" do
      params.delete :context_ids_to_update
      post :copy, params
      json = JSON.parse response.body

      expect(response).to have_http_status(400)
      expect(json["error"]).to eq "param is missing or the value is empty: context_ids_to_update"
    end

    it "should error if empty context_ids_to_update" do
      params[:context_ids_to_update] = ''
      post :copy, params
      json = JSON.parse response.body

      expect(response).to have_http_status(400)
      expect(json["error"]).to eq "param is missing or the value is empty: context_ids_to_update"
    end

    it "should copy the assessment" do
      post :copy, params
      json = JSON.parse response.body

      expect(response).to have_http_status(200)

      new = Assessment.by_copied_from_assessment_id(@assessment.id).first
      expect(json["id"]).to eq new.id
      expect(json["data"]["external_edit_id"]).to eq "testedit"
    end

    it "should update the UserAssessment" do
      ua = UserAssessment.create!(lti_context_id: 'oi',  assessment_id: @assessment.id, user_id: @user.id)
      post :copy, params
      expect(response).to have_http_status(200)
      new = Assessment.by_copied_from_assessment_id(@assessment.id).first

      ua.reload
      expect(ua.assessment_id).to eq new.id
    end

  end

end
