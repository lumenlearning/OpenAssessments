require 'rails_helper'

describe AssessmentResult do

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
    @assessment_result_1 = create_assessment_result(@user_assessment, 33.0, 0)
    @assessment_result_2 = create_assessment_result(@user_assessment, 67.0, 1)
    @assessment_result_3 = create_assessment_result(@user_assessment, 16.0, 2)
  end

  context 'is_max_result?' do
    it 'should return false if assessment_result is not the top score' do
      expect(@assessment_result_1.is_max_result?).to eq false
    end

    it 'should return true if assessment_result is the top score' do
      expect(@assessment_result_2.is_max_result?).to eq true
    end

    it 'should return false if assessment_result score is null' do
      @assessment_result_2.score = nil
      @assessment_result_2.save
      expect(@assessment_result_2.is_max_result?).to eq false
    end
  end

  context 'should_send_lti_outcome?' do
    it 'should return false if any of the required fields are not present' do
      @assessment_result_1.update(:score => nil)
      expect(@assessment_result_1.has_necessary_lti_data?).to eq nil
      @assessment_result_1.update(:score => 24.0, :lis_result_sourcedid => nil)
      expect(@assessment_result_1.has_necessary_lti_data?).to eq nil
      @assessment_result_1.update(:lis_result_sourcedid => "", :lis_outcome_service_url => nil)
      expect(@assessment_result_1.has_necessary_lti_data?).to eq nil
    end

    it 'should return :lti_secret if all required fields are present' do
      expect(@assessment_result_1.has_necessary_lti_data?).to eq @assessment_result_1.assessment.try(:account).try(:lti_secret)
    end
  end

  context 'should_send_lti_outcome?' do
    it 'should return false if session status is not pending lti outcome' do
      @assessment_result_2.update(:session_status => 'initial')
      expect(@assessment_result_2.should_send_lti_outcome?).to eq false
      @assessment_result_2.update(:session_status => 'pendingSubmission')
      expect(@assessment_result_2.should_send_lti_outcome?).to eq false
      @assessment_result_2.update(:session_status => 'pendingResponseProcessing')
      expect(@assessment_result_2.should_send_lti_outcome?).to eq false
      @assessment_result_2.update(:session_status => 'errorLtiOutcome')
      expect(@assessment_result_2.should_send_lti_outcome?).to eq false
      @assessment_result_2.update(:session_status => 'final')
      expect(@assessment_result_2.should_send_lti_outcome?).to eq false
    end

    it 'should return nil if all necessarry lti data is not present' do
      @assessment_result_2.update(:score => nil)
      expect(@assessment_result_2.should_send_lti_outcome?).to eq nil
    end

    it 'should return false if the assessment result is of the kind "formative"' do
      @assessment_result_2.assessment.update(:kind => 'formative')
      expect(@assessment_result_2.should_send_lti_outcome?).to eq false
    end

    it 'should return false if the assessment result is not the one with the highest score' do
      expect(@assessment_result_1.should_send_lti_outcome?).to eq false
    end

    it 'should return true if the assessment result meets all the criteria' do
      @assessment_result_2.assessment.update(:kind => 'summative')
      expect(@assessment_result_2.should_send_lti_outcome?).to eq true
    end
  end

  context 'post_lti_outcome' do
    it 'should return true and change session_status to final if should_send_lti_outcome returns false or nil' do
      @assessment_result_2.assessment.update(:kind => 'formative')
      expect(@assessment_result_2.post_lti_outcome!).to eq true
      expect(@assessment_result_2.session_status).to eq 'final'
    end
  end

  context 'send_outcome_to_tool_consumer!' do
  end

end
