require 'rails_helper'
require 'lti/assessment_result_reporter'

describe Lti::AssessmentResultReporter do

  def create_assessment_result(user_assessment, score=100.0, attempt=0)
    create(:assessment_result,
         :external_user_id => user_assessment.eid,
         :score => score,
         :attempt => attempt,
         :lti_outcome_data => {
                 :lti_role => 'admin',
                 :lis_user_id => user_assessment.eid,
                 :lis_result_sourcedid => '',
                 :lis_outcome_service_url => 'https://example.com/api/ltigrade_passback'
         },
         :user_assessment_id => user_assessment.id,
         :session_status => 'pendingLtiOutcome'
    )
  end


  before do
    @user_assessment = create(:user_assessment)
    @assessment_result = create_assessment_result(@user_assessment, 67.0, 1)
    @reporter = Lti::AssessmentResultReporter.new(@assessment_result)
  end

  context 'should_send_lti_outcome?' do
    it 'should return false if any of the required fields are not present' do
      @assessment_result.update(:score => nil)
      expect(@reporter.has_necessary_lti_data?).to eq nil
      @assessment_result.update(:score => 24.0, :lis_result_sourcedid => nil)
      expect(@reporter.has_necessary_lti_data?).to eq nil
      @assessment_result.update(:lis_result_sourcedid => "", :lis_outcome_service_url => nil)
      expect(@reporter.has_necessary_lti_data?).to eq nil
    end

    it 'should return :lti_secret if all required fields are present' do
      expect(@reporter.has_necessary_lti_data?).to eq @assessment_result.assessment.try(:account).try(:lti_secret)
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
      @assessment_result.update(:session_status => 'final')
      expect(@reporter.should_send_lti_outcome?).to eq false
    end

    it 'should return nil if all necessarry lti data is not present' do
      @assessment_result.update(:score => nil)
      expect(@reporter.should_send_lti_outcome?).to eq nil
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
    it 'should return true and change session_status to final if should_send_lti_outcome returns false or nil' do
      @assessment_result.assessment.update(:kind => 'formative')
      expect(Lti::AssessmentResultReporter.post_lti_outcome!(@assessment_result)).to eq true
      expect(@assessment_result.session_status).to eq 'final'
    end
  end

  context 'send_outcome_to_tool_consumer!' do
  end
end