require 'rails_helper'

describe Canvas do
  before do
    @course_id = 11
    @token = 'test'
    @base_uri = 'http://www.example.com'    
    @canvas_authentication = FactoryGirl.create(:authentication, :provider => 'canvas', :token => @token, :provider_url => @base_uri)
    @api = Canvas.new(@canvas_authentication.provider_url, @canvas_authentication.token)
  end

  describe "api_put_request" do
    it "calls the given url with a PUT request" do
      payload = {}
      response = double(:code => "200")
      result = {}
      allow(result).to receive(:response).and_return(response)
      expect(HTTParty).to receive(:put).with("#{@base_uri}/api/v1/courses", :headers => @api.headers, :body => payload).and_return(result)
      @api.api_put_request("courses", payload)
    end
  end

  describe "api_post_request" do
    it "calls the given url with a POST request" do
      payload = {}
      response = double(:code => "200")
      result = {}
      allow(result).to receive(:response).and_return(response)
      expect(HTTParty).to receive(:post).with("#{@base_uri}/api/v1/courses", :headers => @api.headers, :body => payload).and_return(result)
      @api.api_post_request("courses", payload)
    end
  end

  describe "api_get_request" do
    it "calls the given url with a GET request" do
      response = double(:code => "200")
      result = {}
      allow(result).to receive(:response).and_return(response)
      expect(HTTParty).to receive(:get).with("#{@base_uri}/api/v1/courses", :headers => @api.headers).and_return(result)
      @api.api_get_request("courses")
    end
  end
  
  describe "check_result" do
    it "should raise an UnauthorizedException if 401 not authorized" do
      response = double(:code => "401")
      result = { 
        "errors" => "Not Authorized"
      }
      allow(result).to receive(:response).and_return(response)
      expect { @api.check_result(result) }.to raise_exception(Canvas::UnauthorizedException)
    end    
    it "should raise an NotFoundException if 404 not found" do
      response = double(:code => "404")
      result = { 
        "errors" => "Not Authorized"
      }
      allow(result).to receive(:response).and_return(response)
      expect { @api.check_result(result) }.to raise_exception(Canvas::NotFoundException)
    end
    it "should raise an InvalidRequestException if canvas call fails" do
      response = double(:code => "500")
      result = { 
        "errors" => "Something terrible happened"
      }
      allow(result).to receive(:response).and_return(response)
      expect { @api.check_result(result) }.to raise_exception(Canvas::InvalidRequestException)
    end
    it "should return the result for a 200" do
      response = double(:code => "200")
      result = {}
      allow(result).to receive(:response).and_return(response)
      expect(@api.check_result(result)).to eq(result)
    end
    it "should return the result for a 201" do
      response = double(:code => "201")
      result = {}
      allow(result).to receive(:response).and_return(response)
      expect(@api.check_result(result)).to eq(result)
    end
  end

  describe "get_course_lti_tools" do
    it "should find installed LTI tools for the given course" do
      tools = @api.get_course_lti_tools(@course_id)
      expect(tools.first['consumer_key']).to eq('fake')
    end
  end

end