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
    message[:question_responses] = ar.item_results.order(:sequence_index).includes(:item).map do |ir|
      {
              ident: ir.identifier,
              responses_chosen: ir.processed_answers_chosen,
              score: ir.score,
              correct: correct_map.call(ir.score),
              confidence_level: confidence_map[ir.confidence_level]
      }
    end
    message[:correct_list] = message[:question_responses].map{|ir| ir[:correct]}

    render json: message
  end

  def log_progress
    raise "no api user" unless current_user

    if @lti_launch && @lti_launch.assessment_result
      @lti_launch.assessment_result.add_progress!(params[:answers])
      render json: {message: "OK"}
    else
      render json: {message: "No active assessment."}
    end
  end

  def send_lti_outcome
    raise "no api user" unless current_user
    result = @current_user.assessment_results.find(params[:assessment_result_id])

    if Lti::AssessmentResultReporter.post_lti_outcome!(result, @lti_launch)
      render json: {message: "OK"}
    else
      Rails.logger.error("Failed sending lti grade: AssessmentResult #{result.id} Errors: #{result.outcome_error_message}")
      render json: {message: "Failed to send grade for AssessmentResult #{result.id}"}, status: :internal_server_error
    end
  end

  def send_result_to_analytics
    # If there is a session, validate the auth header,
    # there won't be one for non-lti embedded quizzes
    if request.headers["Authorization"].present? && request.headers["Authorization"] != "Bearer null"
      return unless validate_token
    end

    if AnalyticsHelper.enabled?
      if current_user
        res = current_user.assessment_results.find(params[:assessment_result_id])
      else
        # Probably embedded so no user session
        res = AssessmentResult.find(params[:assessment_result_id])
        assessment = res.assessment
        if assessment.kind == 'summative'
          render json: {message: "no user for summative"}, status: :forbidden
          return
        end
      end

      message = AnalyticsHelper.send_for_result(res, params)
      render json: {message: message}
    else
      render json: {message: "not configured"}
    end
  end

end
