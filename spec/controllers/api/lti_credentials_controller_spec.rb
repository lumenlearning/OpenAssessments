require 'rails_helper'

RSpec.describe Api::LtiCredentialsController, type: :controller do
  let!(:account) {FactoryGirl.create(:account)}
  let(:params) {{name: 'test credentials', lti_key: 'fake_lti_key', lti_secret: 'fake_lti_secret'}}
  let(:credential) {LtiCredential.create!(params.merge({account: account, enabled: true}))}

  before do
    admin_token = AuthToken.issue_token({scopes: [AuthToken::FULL_SERVICE_API_ACCESS]})
    request.headers['Authorization'] = admin_token
    allow(controller).to receive(:current_account).and_return(account)
  end

  context "#index" do
    before do
      credential
      @cred_2 = LtiCredential.create!(params.merge({account: account, enabled: true, name: "zifferent name", lti_key: "different"}))
    end

    it "returns all existing credentials" do
      get :index
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json.count).to eq 2
    end

    it "can search by name" do
      get :index, {name: "test"}
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json.count).to eq 1
      expect(json.first["name"]).to eq credential.name
    end

    it "paginates" do
      get :index, {per_page: 1}
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json.count).to eq 1
      expect(json.first["name"]).to eq credential.name

      get :index, {per_page: 1, page: 2}
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json.count).to eq 1
      expect(json.first["name"]).to eq @cred_2.name
    end
  end

  context "#show" do
    it "shows credential" do
      get :show, {id: credential.lti_key}
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json['account_id']).to eq account.id
      expect(json['enabled']).to eq true
      expect(json['lti_key']).to eq params[:lti_key]
      expect(json['lti_secret']).to be_nil
      expect(json['name']).to eq params[:name]
    end

    it "404s if key not found" do
      get :show, {id: "nothing"}
      expect(response).to have_http_status(404)
    end
  end


  context "#create" do
    it "creates credentials" do
      post :create, params
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json['account_id']).to eq account.id
      expect(json['enabled']).to eq true
      expect(json['lti_key']).to eq params[:lti_key]
      expect(json['lti_secret']).to be_nil
      expect(json['name']).to eq params[:name]

      cred = LtiCredential.last
      expect(cred.lti_secret).to eq params[:lti_secret]
    end

    it "errors if key already exists" do
      credential
      post :create, params
      expect(response).to have_http_status(400)
      json = JSON.parse(response.body)

      expect(json).to eq({"errors" => ["LTI Credential with that key already exists"]})
    end

  end

  context "#update" do
    it "can update" do
      credential
      post :update, {id: credential.lti_key, enabled: false, name: "new name"}
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json['enabled']).to eq false
      expect(json['name']).to eq "new name"
    end
  end

  context "authorization" do
    it "errors for wrong scope permissions" do
      request.headers['Authorization'] = AuthToken.issue_token({scopes: ["something_else"]})
      post :create, params
      expect(response).to have_http_status(401)
      json = JSON.parse(response.body)

      expect(json).to eq({"errors" => ["API Token not allowed to access LTI Credentials"]})
    end

    it "errors for no scope" do
      request.headers['Authorization'] = AuthToken.issue_token({})
      post :index
      expect(response).to have_http_status(401)
      json = JSON.parse(response.body)

      expect(json).to eq({"errors" => ["API Token not allowed to access LTI Credentials"]})
    end
  end

end
