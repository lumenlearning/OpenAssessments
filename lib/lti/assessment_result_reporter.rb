module Lti
  class AssessmentResultReporter
    def initialize(result, launch=nil)
      @assessment_result = result
      @lti_launch = launch
    end

    def self.post_lti_outcome!(result, lti_launch=nil)
      lti_launch ||= result.lti_launch
      AssessmentResultReporter.new(result, lti_launch).post_lti_outcome!
    end

    def post_lti_outcome!
      if should_send_lti_outcome?
        return send_outcome_to_tool_consumer!
      elsif @assessment_result.session_status == AssessmentResult::STATUS_PENDING_LTI_OUTCOME
        @assessment_result.session_status = AssessmentResult::STATUS_FINAL
        @assessment_result.save
      end

      true
    end

    def send_outcome_to_tool_consumer!
      raise OpenAssessments::LtiError.new("Not enough data to send lti outcome") unless has_necessary_lti_data?

      if @lti_launch.send_outcome_to_tool_consumer(outcome_score)
        @assessment_result.session_status = AssessmentResult::STATUS_FINAL
        @assessment_result.save
        true
      else
        @assessment_result.outcome_error_message = @lti_launch.outcome_error_message
        @assessment_result.session_status = AssessmentResult::STATUS_ERROR_LTI_OUTCOME
        @assessment_result.save
        false
      end
    end

    # LTI expects float between 0 and 1
    def outcome_score
      @assessment_result.score/100.0
    end

    def should_send_lti_outcome?
      !!(@assessment_result.session_status == AssessmentResult::STATUS_PENDING_LTI_OUTCOME &&
              has_necessary_lti_data? &&
              @assessment_result.assessment.summative? &&
              @assessment_result.is_max_result?)
    end

    def has_necessary_lti_data?
      !!(@assessment_result.score && @lti_launch && @lti_launch.has_outcome_data?)
    end

  end
end