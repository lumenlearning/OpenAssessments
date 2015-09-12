class UserAssessment < ActiveRecord::Base
  belongs_to :user
  belongs_to :assessment

  def increment_attempts!
    self.attempts += 1
    if self.attempts == 1
      self.first_attempt_at = Time.now
    end
    self.most_recent_attempt_at = Time.now
    self.save!
  end

  def assessment_results
    AssessmentResult.where(user_id: self.user_id).where(assessment_id: self.assessment_id)
  end
end
