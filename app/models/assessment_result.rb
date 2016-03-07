class AssessmentResult < ActiveRecord::Base
  has_one :test_result, dependent: :destroy
  belongs_to :assessment
  belongs_to :user
  belongs_to :user_assessment
  belongs_to :lti_launch
  has_many :item_results, dependent: :destroy

  acts_as_taggable_on :keywords
  acts_as_taggable_on :objectives

  store_accessor :lti_outcome_data, :lis_result_sourcedid, :lis_outcome_service_url,
                 :lis_user_id, :lti_role, :outcome_error_message

  scope :by_status_final, -> { where(session_status: 'final') }

  STATUS_INITIAL = 'initial'
  STATUS_PENDING_SUBMISSION = 'pendingSubmission'
  STATUS_PENDING_RESPONSE_PROCESSING  = 'pendingResponseProcessing'
  STATUS_PENDING_LTI_OUTCOME  = 'pendingLtiOutcome'
  STATUS_ERROR_LTI_OUTCOME  = 'errorLtiOutcome'
  STATUS_FINAL = 'final'

  STATUS_VALUES = [STATUS_INITIAL, STATUS_PENDING_SUBMISSION, STATUS_PENDING_RESPONSE_PROCESSING, STATUS_FINAL]

  def lti_outcome_params
    {
            'lis_result_sourcedid' => self.lis_result_sourcedid,
            'lis_outcome_service_url' => self.lis_outcome_service_url,
            'user_id' => self.lis_user_id
    }
  end

  def send_outcome_to_tool_consumer!
    raise "Not enough data to send lti outcome" unless has_necessary_lti_data?

    #todo: update to use the LtiCredential's key/secret
    @tp = IMS::LTI::ToolProvider.new(self.assessment.account.lti_key, self.assessment.account.lti_secret, lti_outcome_params)

    if !@tp.outcome_service?
      self.outcome_error_message = "No lis variables set"
      self.session_status = STATUS_ERROR_LTI_OUTCOME
      self.save
      return false
    end

    # LTI expects float between 0 and 1
    res = @tp.post_replace_result!(self.score/100.0)

    if res.success?
      self.session_status = STATUS_FINAL
      self.save
      true
    else
      self.outcome_error_message = "#{res.response_code} - #{res.code_major} - #{res.severity} - #{res.description}"
      self.session_status = STATUS_ERROR_LTI_OUTCOME
      self.save
      false
    end
  end

  def is_max_result?
    if self.user_assessment
      self.user_assessment.assessment_results.where('score IS NOT NULL').order('score DESC').select(:id, :score).limit(1).first == self
    else
      self.assessment.assessment_results.where(user_id: self.user.id).where('score IS NOT NULL').order('score DESC').select(:id, :score).limit(1).first == self
    end
  end

  def should_send_lti_outcome?
    self.session_status == STATUS_PENDING_LTI_OUTCOME &&
            has_necessary_lti_data? &&
            self.assessment.summative? &&
            self.lti_role != "admin" &&
            is_max_result?
  end

  def has_necessary_lti_data?
    self.score &&
            self.lis_result_sourcedid &&
            self.lis_outcome_service_url &&
            self.assessment.try(:account).try(:lti_key) &&
            self.assessment.try(:account).try(:lti_secret)
  end

  def post_lti_outcome!
    if should_send_lti_outcome?
      return send_outcome_to_tool_consumer!
    elsif self.session_status == STATUS_PENDING_LTI_OUTCOME
      self.session_status = STATUS_FINAL
      self.save
    end

    true
  end

end
