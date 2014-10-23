require 'rails_helper'

describe User do

  before do
    @user = FactoryGirl.create(:user)
    @attr = {
      :name => "Example User",
      :email => "user@example.com",
      :password => "foobar",
      :password_confirmation => "foobar"
    }
  end

  it { should have_many :external_identifiers }

end