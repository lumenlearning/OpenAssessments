require 'spec_helper'

class LtiMethodsTester
  attr_accessor :lti_key, :lti_secret
  def self.before_save(foo); end
  def self.before_create(foo); end
  include Lti::Methods
end

describe Lti::Methods do
  before do
    LtiMethodsTester.stub(:find_by_lti_key).and_return(nil)
    @test = LtiMethodsTester.new
  end
  describe "#set_lti" do
    it "should set the lti_key" do
      @test.set_lti
      @test.lti_key.should_not be_nil
    end
    it "should set the lti_secret" do
      @test.set_lti
      @test.lti_secret.should_not be_nil
    end
  end
  describe "#random_key" do
    it "generates a random key" do
      key = 'foo'
      @test.random_key.should_not be_nil
    end
  end
end