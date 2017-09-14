require 'rails_helper'

RSpec.describe Api::LtiCredentialsController, type: :controller do
  let(:account) { FactoryGirl.create(:account) }
  let(:user) { FactoryGirl.create(:user, account: account) }

  before do
    user.confirm!
    user.make_account_admin({account_id: account.id})
    admin_token = AuthToken.issue_token({user_id: user.id})
    request.headers['Authorization'] = admin_token
    allow(controller).to receive(:current_account).and_return(account)
  end

  it "returns ok for valid lti credentials" do
    post :create, {account_id: account.id,lti_key: 'fake_lti_key', lti_secret: 'fake_lti_secret'}
    json = JSON.parse(response.body)
    puts json
    expect(json).to eq({"message" => "ok"})
  end
end
