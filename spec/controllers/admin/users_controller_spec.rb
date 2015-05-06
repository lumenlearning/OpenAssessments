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
        params = FactoryGirl.attributes_for(:user)
        post :create, account_id: @account, user: params, format: :json
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)['name']).to eq(params[:name])
      end
    end
    describe "with invalid params" do
      it "returns an error" do
        params = FactoryGirl.attributes_for(:user)
        params[:email] = nil
        post :create, account_id: @account, user: params, format: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PUT update" do
    before do
      @user = FactoryGirl.create(:user)
    end
    
    describe "with valid params" do
      it "updates the user and returns the object as json" do
        params = @user.attributes
        new_name = "Billy Joel"
        params[:name] = new_name
        put :update, account_id: @account, id: @user.id, user: params, name: new_name, format: :json
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)['name']).to eq(params[:name])
      end
    end

    describe "with invalid params" do
      it "returns an error" do
        params = @user.attributes
        new_email = nil
        params[:email] = new_email
        put :update, account_id: @account, id: @user.id, user: params, email: new_email, format: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

end
