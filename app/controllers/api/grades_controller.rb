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
    if settings['ltiLaunchId']
      lti_launch = current_user.lti_launches.find_by_id(settings['ltiLaunchId'])
    end

    result = assessment.assessment_results.build
    result.user_assessment = user_assessment
    result.lti_launch = lti_launch
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

    score = result.score = (ag.score * 100).round

    result.save!

    create_item_results(questions, settings, answers, result, assessment)

    graded_assessment = {
      score: score,
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

private

  def create_item_results(questions, settings, answers, result, assessment)
    questions.each_with_index do |question, index|
      confidence_level_int = ItemResult::CONFIDENCE_MAP[question["confidenceLevel"]]

      unless item = assessment.items.find_by_identifier(question["id"])
        item = assessment.items.build
        item.identifier = question["id"]
        item.question_text = question["material"]
        item.save!
end

        rendered_time = Time.now
        referer = request.env['HTTP_REFERER']
        item.item_results.create(
          identifier: question["id"],
          item_id: item.id,
          eid: item.id,
          correct: question["score"] == 1 ? true : false,
          external_user_id: settings["externalUserId"],
          time_elapsed: question["timeSpent"],
          src_url: settings["srcUrl"],
          assessment_result_id: result.id,
          session_status: "final",
          ip_address: request.ip,
          referer: referer,
          rendered_datestamp: rendered_time,
          confidence_level: confidence_level_int,
          score: question["score"],
          outcome_guid: question["outcome_guid"],
          sequence_index: answers[index],
          answers_chosen: answers[index].is_a?(Array) ? answers[index].join(",") : answers[index]
        )

    end
  end
end
