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

    context "for_edit" do
      before do
        @lti_launch = LtiLaunch.from_params({roles: 'Instructor', user_id: 'lti_id', context_id: 'extcontext'})
        @lti_launch.user_id = @admin.id; @lti_launch.save!
        @assessment = FactoryGirl.create(:assessment, title: "hi", external_edit_id: 'testid', kind: 'summative', xml_file: @xml, account: @account)
        @payload = { :user_id => @admin.id, AuthToken::EDIT_ID_SCOPE => 'testid', AuthToken::ADMIN_SCOPES => ['extcontext'], 'lti_launch_id' => @lti_launch.id }
        @edit_token = AuthToken.issue_token(@payload)
        @params = {format: :xml, id: @assessment.id, for_edit: 1}
        request.headers['Authorization'] = @edit_token
      end

      it "should return for summative" do
        get :show, @params

        expect(response).to have_http_status(200)
        expect(response.body).to include("conditionvar")
      end

      it "should return for swyk" do
        @assessment.kind = 'show_what_you_know'; @assessment.save!
        get :show, @params

        expect(response).to have_http_status(200)
        expect(response.body).to include("conditionvar")
      end

      it "should return for formative" do
        @assessment.kind = 'formative'; @assessment.save!
        get :show, @params

        expect(response).to have_http_status(200)
        expect(response.body).to include("conditionvar")
      end

      it "should include answers" do
        get :show, @params

        expect(response.body).to include("conditionvar")
      end

      it "should require edit_id scope in jwt" do
        @payload.delete AuthToken::EDIT_ID_SCOPE
        request.headers['Authorization'] = AuthToken.issue_token(@payload)
        get :show, @params

        expect(response).to have_http_status(401)
        expect(response.body).to include "Unauthorized for this edit scope"
      end

      it "should require edit_id scope in assessment" do
        @assessment.external_edit_id = nil; @assessment.save!
        get :show, @params

        expect(response).to have_http_status(401)
        expect(response.body).to include "Unauthorized for this edit scope"
      end

      it "should require context admin" do
        @payload[AuthToken::ADMIN_SCOPES] = []
        request.headers['Authorization'] = AuthToken.issue_token(@payload)
        get :show, @params

        expect(response).to have_http_status(401)
        expect(response.body).to include "Unauthorized for this context"
      end
    end

    context "for_review" do
       before do
        @lti_launch = LtiLaunch.from_params({roles: 'Instructor', user_id: 'lti_id', context_id: 'extcontext'})
        @lti_launch.user_id = @admin.id; @lti_launch.save!
        @assessment = FactoryGirl.create(:assessment, title: "hi", kind: 'summative', xml_file: @xml, account: @account)
        @payload = { :user_id => @admin.id, AuthToken::ADMIN_SCOPES => ['extcontext'], 'lti_launch_id' => @lti_launch.id }
        @edit_token = AuthToken.issue_token(@payload)
        @params = {format: :xml, id: @assessment.id, for_review: 1}
        
        request.headers['Authorization'] = @edit_token
       end

        it "should return for summative" do
        get :show, @params

        expect(response).to have_http_status(200)
        expect(response.body).to include("conditionvar")
      end

      it "should return for swyk" do
        @assessment.kind = 'show_what_you_know'; @assessment.save!
        get :show, @params

        expect(response).to have_http_status(200)
        expect(response.body).to include("conditionvar")
      end

      it "should return for formative" do
        @assessment.kind = 'formative'; @assessment.save!
        get :show, @params

        expect(response).to have_http_status(200)
        expect(response.body).to include("conditionvar")
      end

      it "should include answers" do
        get :show, @params

        expect(response.body).to include("conditionvar")
      end

      it "should require context admin" do
        @payload[AuthToken::ADMIN_SCOPES] = []
        request.headers['Authorization'] = AuthToken.issue_token(@payload)
        get :show, @params

        expect(response).to have_http_status(401)
        expect(response.body).to include "Unauthorized for this context"
      end

      it "shouldn't create an AssessmentResult or UserAssessment" do
        expect(UserAssessment.count).to eq 0
        expect(AssessmentResult.count).to eq 0
      end

    end

  end

  describe "GET 'review_show'" do
    before do
      @lti_launch = LtiLaunch.from_params({roles: 'Instructor', user_id: 'lti_id', context_id: 'extcontext'})
      @lti_launch.user_id = @admin.id; @lti_launch.save!
      @assessment = FactoryGirl.create(:assessment, title: "hi", kind: 'summative', xml_file: @xml, account: @account)
      @payload = {:user_id => @admin.id, AuthToken::ADMIN_SCOPES => ['extcontext'], 'lti_launch_id' => @lti_launch.id}
      @edit_token = AuthToken.issue_token(@payload)
      @params = {format: :xml, assessment_id: @assessment.id}

      request.headers['Authorization'] = @edit_token
    end

    it "should return for summative" do
      get :review_show, @params

      expect(response).to have_http_status(200)
      expect(response.body).to include("conditionvar")
    end

    it "should return for swyk" do
      @assessment.kind = 'show_what_you_know'; @assessment.save!
      get :review_show, @params

      expect(response).to have_http_status(200)
      expect(response.body).to include("conditionvar")
    end

    it "should return for formative" do
      @assessment.kind = 'formative'; @assessment.save!
      get :review_show, @params

      expect(response).to have_http_status(200)
      expect(response.body).to include("conditionvar")
    end

    it "should include answers" do
      get :review_show, @params

      expect(response.body).to include("conditionvar")
    end

    it "should require context admin" do
      @payload[AuthToken::ADMIN_SCOPES] = []
      request.headers['Authorization'] = AuthToken.issue_token(@payload)
      get :review_show, @params

      expect(response).to have_http_status(401)
      expect(response.body).to include "Unauthorized for this context"
    end

    context "with AssessmentResult" do
      before do
        @user_assessment = @assessment.user_assessments.create(lti_context_id: @lti_launch.lti_context_id, user_id: @user, assessment_id: @assessment.id)
        @assessment_result = AssessmentResult.create(user_id: @user, assessment_id: @assessment.id, user_assessment: @user_assessment, assessment_xml: @assessment.current_assessment_xml)
        @params[:assessment_result_id] = @assessment_result.id
      end

      it "should return the AssessmentResult's AssessmentXML" do
        @assessment.xml_file = @xml.gsub('XQuestionSample', 'different quiz'); @assessment.save!

        expect(@assessment.current_assessment_xml_id).to_not eq @assessment_result.assessment_xml_id
        get :review_show, @params

        expect(response.body).to include 'XQuestionSample'
      end

      it "should 404 if AssessmentResult not found" do
        @params[:assessment_result_id] = 0

        expect{ get :review_show, @params }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it "should 401 if AssessmentResult for different lti_context_id" do
        @user_assessment.lti_context_id = "somethingdifferent"; @user_assessment.save!
        get :review_show, @params

        expect(response).to have_http_status(401)
      end

      it "should use Assessment's XML if none on AssessmentResult" do
        @assessment_result.assessment_xml = nil; @assessment_result.save!
        get :review_show, @params

        expect(response.body).to include 'XQuestionSample'
      end

      it "should use Assessment's XML if AssessmentResult's is formative" do
        @assessment.xml_file = @xml.gsub('XQuestionSample', 'different quiz'); @assessment.save!
        xml = @assessment_result.assessment_xml
        xml.kind = 'formative'
        xml.save!
        get :review_show, @params

        expect(response.body).to include 'different quiz'
      end

    end
  end

  describe "POST 'create'" do
    before do
      request.headers['Authorization'] = @admin_token
      @user = FactoryGirl.create(:user)
      @xml_file = Rack::Test::UploadedFile.new File.join(Rails.root, 'spec', 'fixtures', 'assessment.xml')
      @params = {xml_file: @xml_file, title: 'Test', kind: 'practice'}
    end

    it "creates an assessment" do
      post :create, assessment: @params, format: :json
      
      expect(response).to have_http_status(201)
      a = Assessment.last
      expect(a.title).to eq @params[:title]
      expect(a.kind).to eq @params[:kind]
      expect(a.xml_with_answers).to eq File.read(@xml_file)
    end

    it "should create assessment settings" do
      @params[:enable_start] = 'false'
      @params[:style] = 'lumen_learning'
      @params[:confidence_levels] = 'true'
      @params[:per_sec] = "2"
      @params[:allowed_attempts] = "2"

      post :create, assessment: @params, format: :json
      expect(response).to have_http_status(201)

      settings = Assessment.last.default_settings
      expect( settings.enable_start ).to eq false
      expect( settings.style ).to eq @params[:style]
      expect( settings.confidence_levels ).to eq true
      expect( settings.per_sec ).to eq "2"
      expect( settings.allowed_attempts ).to eq 2
      expect( settings.mode ).to eq @params[:kind]
    end

  end

  describe "PUT 'update'" do
    before(:each) do
      request.headers['Authorization'] = @admin_token
      @assessment = FactoryGirl.create(:assessment, account: @account, kind: 'formative', xml_file: @xml)
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
    
    it "should create assessment settings" do
      @params = {}
      @params[:title] = 'Test'
      @params[:enable_start] = 'false'
      @params[:style] = 'lumen_learning'
      @params[:confidence_levels] = 'true'
      @params[:per_sec] = "2"
      @params[:allowed_attempts] = "2"

      put :update, account_id: @account, id: @assessment.id, assessment: @params, format: :json
      expect(response).to have_http_status(204)

      settings = @assessment.default_settings
      expect( settings.enable_start ).to eq false
      expect( settings.style ).to eq @params[:style]
      expect( settings.confidence_levels ).to eq true
      expect( settings.per_sec ).to eq "2"
      expect( settings.allowed_attempts ).to eq 2
      expect( settings.mode ).to eq @assessment.kind
    end
    
    it "should update assessment settings" do
      orig_settings = @assessment.assessment_settings.create(mode: 'summative')
      @params = {}
      @params[:title] = 'Test'
      @params[:enable_start] = 'false'
      @params[:style] = 'lumen_learning'

      put :update, account_id: @account, id: @assessment.id, assessment: @params, format: :json
      expect(response).to have_http_status(204)

      @assessment.reload
      settings = @assessment.default_settings
      expect( settings.id ).to eq orig_settings.id
      expect( settings.enable_start ).to eq false
      expect( settings.style ).to eq @params[:style]
      expect( settings.confidence_levels ).to be_nil
      expect( settings.per_sec ).to be_nil
      expect( settings.allowed_attempts ).to be_nil
      expect( settings.mode ).to eq @assessment.kind
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

    let(:params) {{assessment_id: @assessment.id, edit_id: "testedit", context_ids_to_update: "oi,hoyt", format: :json}}

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
