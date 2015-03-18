require 'rails_helper'

describe Integrations::CanvasAccountsLti do
  before do
    @base_uri = 'http://www.example.com'
    @token = 'test'
    @consumer_key = 'key'
    @shared_secret = 'secret'
    @lti_launch_url = 'http://www.example.com/launch'
    @lti_rich_editor_button_image_url = 'http://www.example.com/launch'
    @env = 'test'
    @canvas_authentication = FactoryGirl.create(:authentication, :provider => 'canvas', :token => @token, :provider_url => @base_uri)
    @headers = { "Authorization" => "Bearer #{@canvas_authentication.token}" }
  end

  describe "setup_lti" do
    # it "should return a 401 if not authorized" do
    #   msg = 'failed'
    #   response = double(:code => '401')
    #   result = { 'message' => msg }
    #   expect(result).to receive(:response).and_return(response)
    #   expect(HTTParty).to receive(:get).with("#{@base_uri}/api/v1/accounts/2/external_tools", :headers => @headers).and_return(result)
    #   lti_result = Integrations::CanvasAccountsLti.setup_lti(@accounts, @consumer_key, @shared_secret, @canvas_authentication, @lti_launch_url,
    #     @lti_rich_editor_button_image_url, @env)
    #   expect(lti_result).to eq ["Could not add tools to #{@account_name}: failed"]
    # end
    # it "should return an error if canvas call fails" do
    #   msg = 'failed'
    #   response = double(:code => '404')
    #   result = { 'message' => msg }
    #   allow(result).to receive(:response).and_return(response)
    #   expect(HTTParty).to receive(:get).with("#{@base_uri}/api/v1/accounts/2/external_tools", :headers => @headers).and_return(result)
    #   lti_result = Integrations::CanvasAccountsLti.setup_lti(@accounts, @consumer_key, @shared_secret, @canvas_authentication, @lti_launch_url,
    #     @lti_rich_editor_button_image_url, @env)
    #   expect(lti_result).to eq(["Could not add tools to #{@account_name}: #{msg}"])
    # end
    # it "should setup the Open Tapestry Tools in all accounts" do
    #   account_id = 2
    #   response = double(:code => '200')
    #   result = [{'id' => account_id}]
    #   config_xml = Lti::Canvas.config_xml(@lti_launch_url, @lti_rich_editor_button_image_url, @env)
    #   tool_config = {
    #     "config_type" => "by_xml",
    #     "config_xml" => config_xml,
    #     "consumer_key" => @consumer_key,
    #     "shared_secret" => @shared_secret
    #   }
    #   expect(result).to receive(:response).at_least(1).times.and_return(response)
    #   expect(HTTParty).to receive(:get).with("#{@base_uri}/api/v1/accounts/#{account_id}/external_tools", :headers => @headers).and_return(result)
    #   expect(HTTParty).to receive(:post).with("#{@base_uri}/api/v1/accounts/#{account_id}/external_tools", :headers => @headers, :body => tool_config).and_return(result)
    #   Integrations::CanvasAccountsLti.setup_lti(@accounts, @consumer_key, @shared_secret, @canvas_authentication, @lti_launch_url,
    #     @lti_rich_editor_button_image_url, @env)
    # end
  end
  
end