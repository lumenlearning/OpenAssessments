class Api::GradesController < Api::ApiController

  skip_before_action :validate_token, only: [:create]

  def create
    if request.headers["Authorization"].present? &&
            request.headers["Authorization"] != "Bearer null"
      return unless validate_token
    end

    # store lis stuff in session
    body = JSON.parse(request.body.read)
    item_to_grade = body["itemToGrade"]
    questions = item_to_grade["questions"]
    assessment_id = item_to_grade["assessmentId"]
    assessment = Assessment.find(assessment_id)
    settings = item_to_grade["settings"]
    if settings['userAssessmentId']
      user_assessment = current_user.user_assessments.find_by_id(settings['userAssessmentId'])
    end
    result = assessment.assessment_results.build
    result.user_assessment = user_assessment
    result.identifier = item_to_grade["identifier"]
    result.external_user_id = settings["externalUserId"]
    result.attempt = settings["userAttempts"]
    result.user = current_user
    result.session_status = AssessmentResult::STATUS_PENDING_RESPONSE_PROCESSING
    result.save!

    answers = item_to_grade["answers"]

    ag = AssessmentGrader.new(questions, answers, assessment)
    ag.grade!

    # if it needs an lti grade write-back save the info
    if settings["isLti"] && assessment.summative?
      result.external_user_id = settings["externalUserId"]
      result.lis_result_sourcedid = settings["lisResultSourceDid"]
      result.lis_outcome_service_url = settings["lisOutcomeServiceUrl"]
      result.lis_user_id = settings["lisUserId"]
      result.lti_role = settings["ltiRole"]
      result.session_status = AssessmentResult::STATUS_PENDING_LTI_OUTCOME
    else
      result.session_status = AssessmentResult::STATUS_FINAL
    end

    result.score = (ag.score * 100).round
    result.save!

    graded_assessment = {
      score: result.score,
      feedback: "Study Harder",
      correct_list: ag.correct_list,
      confidence_level_list: ag.confidence_level_list,
      lti_params: params,
      assessment_results_id: result.id,
    }

    respond_to do |format|
      format.json { render json: graded_assessment }
    end
  end
end
