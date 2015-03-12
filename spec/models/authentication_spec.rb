require 'spec_helper'

describe Authentication do
  it { should belong_to :user }
  it "Requires the provider" do
    authentication = FactoryGirl.build(:authentication, provider: nil)
    authentication.save.should be false
  end
end
