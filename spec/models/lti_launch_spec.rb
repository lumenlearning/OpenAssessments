require 'rails_helper'

RSpec.describe LtiLaunch, type: :model do
  let(:params) { {:roles => 'Learner',
                  :user_id => "useridofvaguery",
                  :context_id => "contextidofvaguery",
                  :tool_consumer_instance_guid => "accountidofvaguery",
                  :lis_result_sourcedid => 'abcdef',
                  :lis_outcome_service_url => 'https://example.com/api/ltigrade_passback',
                  :oauth_nonce => 'oihoyt',
                 }.with_indifferent_access
  }

  let(:launch) { LtiLaunch.from_params(params) }


  context "create from params" do
    it "should set the LTI Outcome properties" do
      expect(launch.lis_result_sourcedid).to eq params[:lis_result_sourcedid]
      expect(launch.lis_outcome_service_url).to eq params[:lis_outcome_service_url]
    end

    it "should set all user and context values" do
      expect(launch.lti_user_id).to eq params[:user_id]
      expect(launch.lti_context_id).to eq params[:context_id]
      expect(launch.tc_instance_guid).to eq params[:tool_consumer_instance_guid]
      expect(launch.oauth_nonce).to eq params[:oauth_nonce]
    end

    it "should prefer ext_roles over roles" do
      params[:ext_roles] = "User,Learner"

      expect(launch.lti_roles).to eq params[:ext_roles]
    end

    it "should get roles" do
      expect(launch.lti_roles).to eq params[:roles]
    end

    it "should set valid to false" do
      expect(launch.was_valid).to eq false
    end
  end

  context "#has_outcome_data?" do
    it "should return true if all properties present" do
      expect(launch.has_outcome_data?).to be true
    end

    it "should return false if missing lis_result_sourcedid" do
      launch.lis_result_sourcedid = nil

      expect(launch.has_outcome_data?).to be false
    end

    it "should return false if missing lis_outcome_service_url" do
      launch.lis_outcome_service_url = nil

      expect(launch.has_outcome_data?).to be false
    end
  end

  context "#send_outcome_to_tool_consumer" do
    before do
      launch.was_valid = true
      launch.lti_credential = LtiCredential.new(lti_key: "oi", lti_secret: "hoyt")
    end

    it "should raise exception unless it was valid" do
      launch.was_valid = false

      expect{launch.send_outcome_to_tool_consumer(0.5)}.to raise_error
    end

    it "should return false and set error message if there is no outcome data" do
      launch.lis_result_sourcedid = nil
      launch.lis_outcome_service_url = nil

      expect(launch.send_outcome_to_tool_consumer(1)).to eq false
      expect(launch.outcome_error_message).to eq "No lis variables set"
    end

    it "should return true if score sent successfully" do
      result = double(IMS::LTI::OutcomeResponse)
      expect(result).to receive(:success?).and_return(true)
      [:response_code, :message_identifier, :code_major, :severity, :description, :operation, :message_ref_identifier].each do |prop|
        expect(result).to receive(prop).and_return('hi')
      end
      expect_any_instance_of(IMS::LTI::ToolProvider).to receive(:post_replace_result!).and_return(result)

      expect(launch.send_outcome_to_tool_consumer(1)).to eq true
    end

    it "should return false and set error message if score failed to send" do
      result = double(IMS::LTI::OutcomeResponse)
      expect(result).to receive(:success?).and_return(false)
      expect(result).to receive(:description).and_return("description")
      [:response_code, :message_identifier, :code_major, :severity, :description, :operation, :message_ref_identifier].each do |prop|
        expect(result).to receive(prop).and_return(prop.to_s)
      end
      expect_any_instance_of(IMS::LTI::ToolProvider).to receive(:post_replace_result!).and_return(result)

      expect(launch.send_outcome_to_tool_consumer(1)).to eq false
      expect(launch.outcome_error_message).to eq "Failed to send outcome - description"
    end

  end

  context "#tool_provider" do
    before do
      @account = FactoryGirl.create(:account)
      @account.lti_key = "key"
      @account.lti_secret = "secret!"
      @account.save!

      launch.account = @account
    end

    it "should use the associated LtiCredential" do
      launch.lti_credential = LtiCredential.new(lti_key: "oi", lti_secret: "hoyt")
      tp = launch.tool_provider

      expect(tp.consumer_key).to eq launch.lti_credential.lti_key
      expect(tp.consumer_secret).to eq launch.lti_credential.lti_secret
    end

    it "should fall back to associated account default credentials" do
      tp = launch.tool_provider

      expect(tp.consumer_key).to eq @account.lti_key
      expect(tp.consumer_secret).to eq @account.lti_secret
    end
  end

end
