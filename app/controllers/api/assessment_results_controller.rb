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


  def show
    assessment = Assessment.find(params[:assessment_id])
    ar = assessment.assessment_results.find(params[:result_id])
    ua = ar.user_assessment

    unless ua && ua.lti_context_id
      render json: {message: "can't connect user to a course"}, status: :forbidden
      return
    end

    unless token_has_admin_scope(ua.lti_context_id)
      # The JWT token must specify this user is admin in this context
      render :json => { :error => "Unauthorized" }, status: :unauthorized
      return
    end

    message = {
            assessment_results_id: ar.id,
            score: ar.score,
            attempt: ar.attempt,
            user: {
                      id: ua.user.try(:id),
                      name: ua.user.try(:name),
                      email: ua.user.try(:email)
              }
    }

    confidence_map = {0 => "Just A Guess", 1 => "Pretty Sure", 2 => "Very Sure"}
    correct_map = ->(score){
      case score
        when 0
          false
        when 1
          true
        else
          'partial'
      end
    }
    message[:question_responses] = ar.item_results.order(:sequence_index).map do |ir|
      {
              ident: ir.identifier,
              responses_chosen: ir.answers_chosen.split(","),
              score: ir.score,
              correct: correct_map.call(ir.score),
              confidence_level: confidence_map[ir.confidence_level]
      }
    end
    message[:correct_list] = message[:question_responses].map{|ir| ir[:correct]}

    render json: message
  end

  def send_lti_outcome
    raise "no api user" unless current_user
    result = @current_user.assessment_results.find(params[:assessment_result_id])

    if result.post_lti_outcome!
      render json: {message: "OK"}
    else
      Rails.logger.error("Failed sending lti grade: AssessmentResult #{result.id} Errors: #{result.outcome_error_message}")
      render json: {message: "Failed to send grade for AssessmentResult #{result.id}"}, status: :internal_server_error
    end
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

      if params[:external_context_id].present?
        user_assessment = assessment.user_assessments.where(eid: ei.identifier, lti_context_id: params[:external_context_id]).first
      else
        user_assessment = assessment.user_assessments.where(eid: ei.identifier).first
      end
      context_id = user_assessment ? user_assessment.lti_context_id : nil
    end

    user_id ||= params[:external_user_id]
    context_id ||= params[:external_context_id]
    tc_guid ||= params[:external_account_id]

    unless user_id.present?
      render json: {message: "no user"}
      return
    end

    if user_assessment && user_assessment.lti_role == "admin"
      render json: {message: "only reporting for student"}
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
              score: ir.score,
              confidence_level: ir.confidence_level
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
