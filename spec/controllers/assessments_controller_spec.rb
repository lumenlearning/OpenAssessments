require "rails_helper"

RSpec.describe AssessmentsController, type: :controller do
  
  before do
    @account = setup_lti_account
    @assessment = create_assessment

    allow(controller).to receive(:current_account).and_return(@account)
    allow(Account).to receive(:find_by).with(:lti_key).and_return(@account)

    @user = FactoryGirl.create(:user, account: @account)
    @external_identifier = FactoryGirl.create(:external_identifier, user: @user, identifier: "292832126") # identifier is from lti_params in support/lti.rb
    @lti_url = 'school.edu'

    @admin = CreateAdminService.new.call
    @admin.make_account_admin({account_id: @account.id})

    @user_token = AuthToken.issue_token({ user_id: @user.id })
    @admin_token = AuthToken.issue_token({ user_id: @admin.id })

    allow(controller).to receive(:current_account).and_return(@account)
  end

  describe "GET index" do
    it "returns http success" do
      get 'index'
      expect(response).to have_http_status(200)
    end
  end

  describe "show" do

    describe "GET" do
      it "returns http success" do
        get 'show', :id => @assessment.id
        expect(response).to have_http_status(200)
      end
    end

    describe "GET with confidence_levels true" do
      it "returns the confidence_level" do
        get 'show', id: @assessment.id, confidence_levels: true
        expect(assigns[:confidence_levels]).to eq(true)
      end
    end

    describe "LTI" do
      before do
        request.env['CONTENT_TYPE'] = "application/x-www-form-urlencoded"
      end

      describe "POST - correct params" do
        context "matching external identifier" do
          it "setups the user, logs them in and redirects" do
            params = lti_params({"launch_url" => assessment_url(@assessment) })
            params[:id] = @assessment.id
            post :show, params
            expect(response).to have_http_status(200)
            expect(assigns(:user)).to be
            expect(assigns(:user).email).to eq(params["lis_person_contact_email_primary"])
          end
        end
      end

      describe "POST - invalid params" do
        it "should return unauthorized status" do
          params = lti_params({"launch_url" => assessment_url(@assessment)})
          params[:context_title] = 'invalid'
          params[:id] = @assessment.id
          post :show, params
          expect(response).to have_http_status(401)
        end
      end
    end
  end

  context "logged in" do
    
    login_user

    describe "CREATE - Valid Params" do
      before do
        request.headers['Authorization'] = @admin_token
      end
      it "should return a valid assessment" do
        xml_file = Rack::Test::UploadedFile.new File.join(Rails.root, 'spec', 'fixtures', 'assessment.xml')
        params = FactoryGirl.attributes_for(:assessment)
        params[:title] = 'Test'
        params[:description] = 'Test description'
        params[:xml_file] = xml_file
        params[:license] = 'test'
        post :create, assessment: params
        expect(response).to have_http_status(302)
      end  

      it "sets a license and keywords" do
        @account.restrict_signup = false
        @account.restrict_assessment_create = false
        xml_file = Rack::Test::UploadedFile.new File.join(Rails.root, 'spec', 'fixtures', 'assessment.xml')
        assessment = FactoryGirl.attributes_for(:assessment).merge({title: "test", xml_file: xml_file, license: "foo license", keyword_list: "foo, keywords"} )
        post :create, assessment: assessment
        result = Assessment.where({title: "test"}).first
        expect(result.license).to eq("foo license")
        expect(result.keyword_list).to eq(["keywords","foo"])
      end

      it "sets creates two assessment xmls" do
        @account.restrict_signup = false
        @account.restrict_assessment_create = false
        xml_file = Rack::Test::UploadedFile.new File.join(Rails.root, 'spec', 'fixtures', 'assessment.xml')
        assessment = FactoryGirl.attributes_for(:assessment).merge({title: "test", xml_file: xml_file, license: "foo license", keyword_list: "foo keywords"} )
        post :create, assessment: assessment
        assessment = Assessment.where({title: "test"}).first
        expect(assessment.assessment_xmls.length).to eq(2)
      end
    end

  end
  

end