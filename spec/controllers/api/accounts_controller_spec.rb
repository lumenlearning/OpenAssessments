# require 'rails_helper'

# describe Api::AccountsController do
#   before do
#     @request.host = @account_default.domain
#   end

#   describe "GET index" do
#     context "valid api key" do
#       it "returns all accounts as json" do
#         account = FactoryGirl.create(:account)
#         get :index, internal_api_key: Settings.internal_api_key, format: :json
#         result = JSON.parse(response.body)
#         result['accounts'].should be_present
#         result['accounts'].find{|s| s['id'] == account.id}.should be_present
#       end
#     end
#     context "invalid api key" do
#       it "returns unauthorized" do
#         get :index, format: :json
#         response.status.should == 401
#       end
#     end
#   end

# end
