require 'rails_helper'

describe AssessmentResultsController do

  before do
    @account = FactoryGirl.create(:account)
    allow(controller).to receive(:current_account).and_return(@account)
  end
  
  describe "GET show" do
    let(:assessment){ create_assessment }

    it "returns http success" do
      get :show, :id => assessment.id
      expect(response).to have_http_status(200)
    end

    it 'should load the items and item results' do
      get :show, :id => assessment.id
      expect(assigns[:assessment].items.first.item_results.count).to eq 0
    end

  end

end
