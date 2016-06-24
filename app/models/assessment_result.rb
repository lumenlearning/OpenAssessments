class AssessmentResult < ActiveRecord::Base
  has_one :test_result, dependent: :destroy
  belongs_to :assessment
  belongs_to :user
  belongs_to :user_assessment
  belongs_to :lti_launch
  belongs_to :assessment_xml
  has_many :item_results, dependent: :destroy
  has_one :progress

  acts_as_taggable_on :keywords
  acts_as_taggable_on :objectives

  # deprecated in favor of lti_launch handling LTI information
  store_accessor :lti_outcome_data, :lis_result_sourcedid, :lis_outcome_service_url,
                 :lis_user_id, :lti_role, :outcome_error_message

  store_accessor :data, :question_ids, :lti_outcome_result

  scope :by_status_final, -> { where(session_status: 'final') }

  STATUS_INITIAL = 'initial'
  STATUS_PENDING_SUBMISSION = 'pendingSubmission'
  STATUS_PENDING_RESPONSE_PROCESSING  = 'pendingResponseProcessing'
  STATUS_PENDING_LTI_OUTCOME  = 'pendingLtiOutcome'
  STATUS_ERROR_LTI_OUTCOME  = 'errorLtiOutcome'
  STATUS_FINAL = 'final'

  STATUS_VALUES = [STATUS_INITIAL, STATUS_PENDING_SUBMISSION, STATUS_PENDING_RESPONSE_PROCESSING, STATUS_FINAL]

  def is_max_result?
    if self.user_assessment
      self.user_assessment.assessment_results.where('score IS NOT NULL').order('score DESC').select(:id, :score).limit(1).first == self
    else
      self.assessment.assessment_results.where(user_id: self.user.id).where('score IS NOT NULL').order('score DESC').select(:id, :score).limit(1).first == self
    end
  end

  # If the quiz is in progress and is summative, log the progress.
  def add_progress!(array)
    return unless self.session_status == AssessmentResult::STATUS_PENDING_SUBMISSION
    return unless Assessment.where(id: self.assessment_id).summative.exists?

    self.progress ||= Progress.new(assessment_result: self)
    self.progress.add_answers!(array)
  end

end
