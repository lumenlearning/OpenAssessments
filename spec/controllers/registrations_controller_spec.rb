require "rails_helper"

RSpec.describe RegistrationsController, type: :controller do
  
  before do
    @request.env["devise.mapping"] = Devise.mappings[:user]
  end

  context "unrestricted account" do
    before do
      @unrestricted_account = FactoryGirl.create(:account, restrict_signup: false)
      allow(controller).to receive(:current_account).and_return(@unrestricted_account)
    end
    describe "GET sign_up" do
      it "displays a registration form" do
        get :new
        expect(response).to have_http_status(:success)
      end
    end
  end

  context "restricted account" do
    before do
      @restricted_account = FactoryGirl.create(:account, restrict_signup: true)
      allow(controller).to receive(:current_account).and_return(@restricted_account)
    end
    describe "GET sign_up" do
      it "doesn't display a registration form" do
        get :new
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
  
end
