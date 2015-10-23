class UserAssessment < ActiveRecord::Base
  belongs_to :user
  belongs_to :assessment
  has_many :assessment_results

  def increment_attempts!
    self.attempts += 1
    if self.attempts == 1
      self.first_attempt_at = Time.now
    end
    self.most_recent_attempt_at = Time.now
    self.save!
  end

end
