class AnalyticsHelper
  def self.enabled?
    !!(server_url && auth_token)
  end

  def self.server_url
    Rails.application.secrets.analytics_server
  end

  def self.auth_token
    Rails.application.secrets.analytics_auth_token
  end

  def self.headers
    {
            "Authorization" => "Bearer #{Rails.application.secrets.analytics_auth_token}",
            "Content-Type" => "application/json",
    }
  end

  def self.post_message(payload)
    response = HTTParty.post(server_url, headers: headers, body: payload.to_json, timeout: 4)
    if response.code == 200
      return "OK"
    else
      Rails.logger.error "Response error posting to analytics. Status code: #{response.code} - #{response.body}"
      return "Sending event failed"
    end
  rescue HTTParty::Error, Net::ReadTimeout, Errno::ECONNREFUSED => e
    Rails.logger.error "Error posting to analytics server: #{e.message}"
    return "Sending event errored"
  end

  def self.send_for_result(res, opts={})
    user = res.user
    assessment = res.assessment

    if user && ei = user.external_identifiers.first
      user_id = ei.identifier
      tc_guid = ei.provider

      if opts[:external_context_id].present?
        user_assessment = assessment.user_assessments.where(eid: ei.identifier, lti_context_id: opts[:external_context_id]).first
      else
        user_assessment = assessment.user_assessments.where(eid: ei.identifier).first
      end
      context_id = user_assessment ? user_assessment.lti_context_id : nil
    end

    user_id ||= opts[:external_user_id]
    context_id ||= opts[:external_context_id]
    tc_guid ||= opts[:external_account_id]

    unless user_id.present?
      return "no user"
    end

    if user_assessment && user_assessment.lti_role == "admin"
      return "only reporting for student"
    end

    message = {
            assessment_result_id: res.id,
            lti_user_id: user_id,
            lti_context_id: context_id,
            tc_lti_guid: tc_guid,
            quiz_id: res.assessment_id,
            quiz_qti_ident: res.identifier,
            score: res.score,
            quiz_type: assessment.kind,
            attempt: res.attempt
    }

    message[:question_responses] = res.item_results.map do |ir|
      {
              ident: ir.identifier,
              responses_chosen: ir.answers_chosen.split(","),
              outcome_guid: ir.outcome_guid,
              score: ir.score,
              confidence_level: ir.confidence_level
      }
    end

    post_message(message)
  end

end