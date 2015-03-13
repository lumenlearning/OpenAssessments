require 'spec_helper'

describe Integrations::Canvas do
  before do
    @course_name = 'a great course name'
    @course = {:id => 2, :name => @course_name}
    @courses = {'2' => Yajl::Encoder.encode(@course)}
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
    context "courses" do
      it "should return a 401 if not authorized" do
        msg = 'failed'
        response = double(:code => '401')
        result = { 'message' => msg }
        result.should_receive(:response).and_return(response)
        HTTParty.should_receive(:get).with("#{@base_uri}/api/v1/courses/2/external_tools", :headers => @headers).and_return(result)
        Integrations::Canvas.setup_lti(@courses, @consumer_key, @shared_secret, @canvas_authentication, @lti_launch_url,
          @lti_rich_editor_button_image_url, @env).should == ["Could not add tools to #{@course_name}: failed"]
      end
      it "should return an error if canvas call fails" do
        msg = 'failed'
        response = double(:code => '404')
        result = { 'message' => msg }
        result.stub(:response).and_return(response)
        HTTParty.should_receive(:get).with("#{@base_uri}/api/v1/courses/2/external_tools", :headers => @headers).and_return(result)
        Integrations::Canvas.setup_lti(@courses, @consumer_key, @shared_secret, @canvas_authentication, @lti_launch_url,
          @lti_rich_editor_button_image_url, @env).should == ["Could not add tools to #{@course_name}: #{msg}"]
      end
      it "should setup the Open Tapestry Tools in all courses" do
        course_id = 2
        response = double(:code => '200')
        result = [{'id' => course_id}]
        config_xml = Lti::Canvas.config_xml(@lti_launch_url, @lti_rich_editor_button_image_url, @env)
        tool_config = {
          "config_type" => "by_xml",
          "config_xml" => config_xml,
          "consumer_key" => @consumer_key,
          "shared_secret" => @shared_secret
        }
        result.should_receive(:response).at_least(1).times.and_return(response)
        HTTParty.should_receive(:get).with("#{@base_uri}/api/v1/courses/#{course_id}/external_tools", :headers => @headers).and_return(result)
        HTTParty.should_receive(:post).with("#{@base_uri}/api/v1/courses/#{course_id}/external_tools", :headers => @headers, :body => tool_config).and_return(result)
        Integrations::Canvas.setup_lti(@courses, @consumer_key, @shared_secret, @canvas_authentication, @lti_launch_url,
          @lti_rich_editor_button_image_url, @env)
      end
    end
  end

end
