require "rails_helper"

RSpec.describe Admin::UsersController, type: :controller do
  
  before do
    @account = FactoryGirl.create(:account)
  end

  describe "GET index" do
    it "should render users for the given account" do
    end
  end

  describe "POST create" do
    describe "with valid params" do
      it "creates the user and returns the object as json" do
        params = FactoryGirl.attributesFor(:user)
        post :create, account_id: @account, user: params
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)['name']).to eq(params[:name])
      end
    end
    describe "with invalid params" do
      it "returns an error" do
        params = FactoryGirl.attributesFor(:user)
        params[:email] = nil
        post :create, account_id: @account, user: params
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "PUT update" do
    before do
      @user = FactoryGirl.create(:user)
    end
    describe "with valid params" do
      it "updates the user and returns the object as json" do
        new_name = "Billy Joel"
        put :update, account_id: @account, id: @user.id, name: new_name
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)['name']).to eq(new_name)
      end
    end
    describe "with invalid params" do
      it "returns an error" do
        put :update, account_id: @account, id: @user.id, name: nil
        expect(response).to have_http_status(403)
      end
    end
  end

end
