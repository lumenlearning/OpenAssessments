require 'rails_helper'

describe Integrations::CanvasCoursesLti do
  before do
    @course_name = "a great course name"
    @course_id = 2
    @course = {"id" => @course_id, "name" => @course_name}
    @token = "test"
    @consumer_key = "key"
    @shared_secret = "secret"
    @lti_launch_url = "http://www.example.com/launch"
    @lti_rich_editor_button_image_url = "http://www.example.com/launch"
    @provider_url = "http://www.example.com"
    @env = "test"
    @canvas_authentication = FactoryGirl.create(:authentication, :provider => "canvas", :token => @token, :provider_url => @provider_url)
  end

  describe "courses" do
    pending "add some examples to (or delete) #{__FILE__}"
  end
  describe "setup_lti" do
    it "should call config_xml and setup" do
      expect(Lti::Canvas).to receive(:config_xml).and_return("")
      expect(Integrations::CanvasCoursesLti).to receive(:setup)
      lti_result = Integrations::CanvasCoursesLti.setup_lti(@course, @consumer_key, @shared_secret, 
        @canvas_authentication, @lti_launch_url, @lti_rich_editor_button_image_url, @env)
    end
  end
  describe "setup_course_navigation_lti" do
    it "should call config_xml and setup" do
      expect(Lti::Canvas).to receive(:course_navigation_config_xml).and_return("")
      expect(Integrations::CanvasCoursesLti).to receive(:setup)
      lti_result = Integrations::CanvasCoursesLti.setup_course_navigation_lti(@course, @consumer_key, @shared_secret, 
        @canvas_authentication, @lti_launch_url, @lti_rich_editor_button_image_url, @env)
    end
  end
  describe "setup" do
    before do
      @result = JSON.parse(lti_tool_json)
    end
    it "should create a new LTI tool in the specified course" do
      config_xml = Lti::Canvas.config_xml(@lti_launch_url, @lti_rich_editor_button_image_url, @env)
      result = Integrations::CanvasCoursesLti.setup(config_xml, @course, @consumer_key, @shared_secret, @canvas_authentication, @lti_launch_url, @env)
      expect(result.parsed_response).to eq(@result)
    end
    it "should update an existing LTI tool in the specified course" do
      lti_launch_url = "https://www.edu-apps.org/tool_redirect?id=ck12"
      config_xml = Lti::Canvas.config_xml(lti_launch_url, @lti_rich_editor_button_image_url, @env)
      result = Integrations::CanvasCoursesLti.setup(config_xml, @course, @consumer_key, @shared_secret, @canvas_authentication, lti_launch_url, @env)
      expect(result.parsed_response).to eq(@result)
    end    
  end

end
