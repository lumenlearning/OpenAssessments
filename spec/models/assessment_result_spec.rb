require 'rails_helper'

describe AssessmentResult do

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
    @assessment_result_1 = create_assessment_result(@user_assessment, 33.0, 0)
    @assessment_result_2 = create_assessment_result(@user_assessment, 67.0, 1)
    @assessment_result_3 = create_assessment_result(@user_assessment, 16.0, 2)
  end

  context 'is_max_result?' do
    it 'should return false if assessment_result is not the top score' do
      expect(@assessment_result_1.is_max_result?).to eq false
      expect(@assessment_result_3.is_max_result?).to eq false
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

end
