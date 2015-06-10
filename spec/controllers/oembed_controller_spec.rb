require 'rails_helper'

describe OembedController do
  before do
    @user = FactoryGirl.create(:user)
  end
  describe "endpoint" do
    context "assessment" do
      before do
        @assessment = FactoryGirl.create(:assessment, :user => @user)
        @url = CGI.escape(assessment_url(@assessment))
      end
      it "should return json for the given assessment" do
        get :endpoint, :url => @url, :format => 'json'
        expect(response).to have_http_status(200)
        result = JSON.parse(response.body)
        expect(result['title']).to eq @assessment.title
        expect(result['author_name']).to eq @assessment.user.display_name
      end
    end
  end

end