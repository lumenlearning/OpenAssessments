class Api::AssessmentResultsController < Api::ApiController
  before_action :validate_token, except: :send_result_to_analytics

  # TODO Might have to cheat and make this a index or show so we can use a GET request to record the data. This will avoid cross origin issues.
  def create
    rendered_time, referer, user = tracking_info
    assessment_result = user.assessment_results.create!(
      assessment_id: params[:assessment_id],
      eid: params[:eid],
      src_url: params[:src_url],
      external_user_id: params[:external_user_id],
      identifier: params['identifier'],
      rendered_datestamp: rendered_time,
      referer: referer,
      ip_address: request.ip,
      session_status: 'initial')

    assessment_result.keyword_list.add(params[:keywords], parse: true) if params[:keywords]
    assessment_result.objective_list.add(params[:objectives], parse: true) if params[:objectives]
    assessment_result.save! if params[:objectives] || params[:keywords]
    respond_with(:api, assessment_result)
  end

  def send_result_to_analytics
    if request.headers["Authorization"].present? &&
            request.headers["Authorization"] != "Bearer null"
      return unless validate_token
    end

    if @current_user = current_user
      res = @current_user.assessment_results.find(params[:assessment_result_id])
      assessment = res.assessment
    else
      res = AssessmentResult.find(params[:assessment_result_id])
      assessment = res.assessment
      if assessment.kind == 'summative'
        render json: {message: "nope"}, status: :forbidden
        return
      end
    end

    if @current_user && ei = @current_user.external_identifiers.first
      user_id = ei.identifier
      tc_guid = ei.provider

      user_assessment = assessment.user_assessments.where(eid: ei.identifier).first
      context_id = user_assessment ? user_assessment.lti_context_id : nil
    end

    user_id ||= params[:external_user_id]
    context_id ||= params[:external_context_id]
    tc_guid ||= params[:external_account_id]

    unless user_id.present?
      render json: {message: "no user"}
      return
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
              score: ir.score
      }
    end

    if AnalyticsHelper.enabled?
      message = AnalyticsHelper.send_result(message)
      render json: {message: message}
    else
      render json: {message: "not configured"}
    end
  end

end
