require 'rails_helper'
require 'lti/assessment_result_reporter'

describe Lti::AssessmentResultReporter do

  def create_assessment_result(user_assessment, score=100.0, attempt=0)
    create(:assessment_result,
         :external_user_id => user_assessment.eid,
         :score => score,
         :attempt => attempt,
         :user_assessment_id => user_assessment.id,
         :session_status => 'pendingLtiOutcome'
    )
  end


  before do
    @user_assessment = create(:user_assessment)
    @assessment_result = create_assessment_result(@user_assessment, 67.0, 1)
    @lti_launch = LtiLaunch.from_params({
                 :roles => 'Learner',
                 :lis_user_id => @user_assessment.eid,
                 :lis_result_sourcedid => 'abcdef',
                 :lis_outcome_service_url => 'https://example.com/api/ltigrade_passback'
         })
    @reporter = Lti::AssessmentResultReporter.new(@assessment_result, @lti_launch)
  end

  context 'should_send_lti_outcome?' do
    it 'should be false if no score' do
      @assessment_result.update(:score => nil)
      expect(@reporter.has_necessary_lti_data?).to eq false
    end

    it "should be false if no lis_result_sourcedid" do
      #todo belongs in lti_launch_spec
      @lti_launch.lis_result_sourcedid = nil
      expect(@reporter.has_necessary_lti_data?).to eq false
    end

    it "should be false if no lis_outcome_service_url" do
      #todo belongs in lti_launch_spec
      @lti_launch.lis_outcome_service_url = nil
      expect(@reporter.has_necessary_lti_data?).to eq false
    end

    it 'should be true if all required fields are present' do
      expect(@reporter.has_necessary_lti_data?).to eq true
    end
  end

  context 'should_send_lti_outcome?' do
    it 'should return false if session status is not pending lti outcome' do
      @assessment_result.update(:session_status => 'initial')
      expect(@reporter.should_send_lti_outcome?).to eq false
      @assessment_result.update(:session_status => 'pendingSubmission')
      expect(@reporter.should_send_lti_outcome?).to eq false
      @assessment_result.update(:session_status => 'pendingResponseProcessing')
      expect(@reporter.should_send_lti_outcome?).to eq false
      @assessment_result.update(:session_status => 'errorLtiOutcome')
      expect(@reporter.should_send_lti_outcome?).to eq false
      @assessment_result.update(:session_status => AssessmentResult::STATUS_FINAL)
      expect(@reporter.should_send_lti_outcome?).to eq false
    end

    it 'should return nil if all necessarry lti data is not present' do
      @assessment_result.update(:score => nil)
      expect(@reporter.should_send_lti_outcome?).to eq false
    end

    it 'should return false if the assessment result is of the kind "formative"' do
      @assessment_result.assessment.update(:kind => 'formative')
      expect(@reporter.should_send_lti_outcome?).to eq false
    end

    it 'should return false if the assessment result is not the one with the highest score' do
      expect(@reporter.should_send_lti_outcome?).to eq false
    end

    it 'should return true if the assessment result meets all the criteria' do
      @assessment_result.assessment.update(:kind => 'summative')
      expect(@reporter.should_send_lti_outcome?).to eq true
    end
  end

  context 'post_lti_outcome' do
    it 'should return true and change session_status to final if should_send_lti_outcome returns false' do
      @assessment_result.assessment.update(:kind => 'formative')
      expect(Lti::AssessmentResultReporter.post_lti_outcome!(@assessment_result)).to eq true
      expect(@assessment_result.session_status).to eq AssessmentResult::STATUS_FINAL
    end
  end

  context 'send_outcome_to_tool_consumer!' do
    it 'should set status to final on success' do
      expect(@lti_launch).to receive(:send_outcome_to_tool_consumer).and_return(true)
      @reporter.send_outcome_to_tool_consumer!
      expect(@assessment_result.session_status).to eq AssessmentResult::STATUS_FINAL
    end

    it 'should raise unless has_necessary_lti_data?' do
      @assessment_result.score = nil
      expect{@reporter.send_outcome_to_tool_consumer!}.to raise_error(OpenAssessments::LtiError)
    end

    it 'should store the error message if sending fails' do
      @lti_launch.outcome_error_message = 'sadness'
      expect(@lti_launch).to receive(:send_outcome_to_tool_consumer).and_return(false)
      @reporter.send_outcome_to_tool_consumer!
      expect(@assessment_result.session_status).to eq AssessmentResult::STATUS_ERROR_LTI_OUTCOME
      expect(@assessment_result.outcome_error_message).to eq 'sadness'
    end

  end

end