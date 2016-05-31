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

    def lti_outcome_params
      {
              'lis_result_sourcedid' => @assessment_result.lis_result_sourcedid,
              'lis_outcome_service_url' => @assessment_result.lis_outcome_service_url,
              'user_id' => @assessment_result.lis_user_id
      }
    end

    def send_outcome_to_tool_consumer!
      raise "Not enough data to send lti outcome" unless has_necessary_lti_data?

      #todo: update to use the LtiCredential's key/secret
      @tp = IMS::LTI::ToolProvider.new(@assessment_result.assessment.account.lti_key, @assessment_result.assessment.account.lti_secret, lti_outcome_params)

      if !@tp.outcome_service?
        @assessment_result.outcome_error_message = "No lis variables set"
        @assessment_result.session_status = AssessmentResult::STATUS_ERROR_LTI_OUTCOME
        @assessment_result.save
        return false
      end

      # LTI expects float between 0 and 1
      res = @tp.post_replace_result!(@assessment_result.score/100.0)

      if res.success?
        @assessment_result.session_status = AssessmentResult::STATUS_FINAL
        @assessment_result.save
        true
      else
        @assessment_result.outcome_error_message = "#{res.response_code} - #{res.code_major} - #{res.severity} - #{res.description}"
        @assessment_result.session_status = AssessmentResult::STATUS_ERROR_LTI_OUTCOME
        @assessment_result.save
        false
      end
    end

    def should_send_lti_outcome?
      @assessment_result.session_status == AssessmentResult::STATUS_PENDING_LTI_OUTCOME &&
              has_necessary_lti_data? &&
              @assessment_result.assessment.summative? &&
              @assessment_result.is_max_result?
    end

    def has_necessary_lti_data?
      @assessment_result.score &&
              @assessment_result.lis_result_sourcedid &&
              @assessment_result.lis_outcome_service_url &&
              @assessment_result.assessment.try(:account).try(:lti_key) &&
              @assessment_result.assessment.try(:account).try(:lti_secret)
    end

  end
end