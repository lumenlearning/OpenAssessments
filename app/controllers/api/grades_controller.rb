class Api::GradesController < Api::ApiController
  
  skip_before_action :validate_token, only: [:create]
  
  def create
    if request.headers["Authorization"].present? &&
            request.headers["Authorization"] != "Bearer null"
      return unless validate_token
    end

    # store lis stuff in session
    answered_correctly = 0;
    body = JSON.parse(request.body.read);
    item_to_grade = body["itemToGrade"]
    questions = item_to_grade["questions"]
    assessment_id = item_to_grade["assessmentId"]
    assessment = Assessment.find(assessment_id)
    doc = Nokogiri::XML(assessment.assessment_xmls.where(kind: "formative").last.xml)
    doc.remove_namespaces!
    xml_questions = doc.xpath("//item")
    errors = []
    settings = item_to_grade["settings"]
    result = assessment.assessment_results.build
    result.identifier = item_to_grade["identifier"]
    result.external_user_id = settings["externalUserId"]
    result.attempt = settings["userAttempts"]
    result.user = current_user
    result.session_status = AssessmentResult::STATUS_PENDING_RESPONSE_PROCESSING
    result.save!
    correct_list = []
    confidence_level_list = []
    answers = item_to_grade["answers"]
    ungraded_questions = []
    xml_index_list = []
    
    questions.each_with_index do |question, index|

      # make sure we are looking at the right question
      xml_index = get_xml_index(question["id"], xml_questions)
      xml_index_list.push(xml_index)
      if question["id"] == xml_questions[xml_index].attributes["ident"].value

        correct = false;
        # find the question type
        type = xml_questions[xml_index].children.xpath("qtimetadata").children.xpath("fieldentry").children.text
        
        # if the question type gets some wierd stuff if means that the assessment has outcomes so we need
        # to get the question data a little differently
        if type != "multiple_choice_question" && type != "multiple_answers_question" && type != "matching_question"
          type = xml_questions[xml_index].children.xpath("qtimetadata").children.xpath("fieldentry").children.first.text
        end

        # grade the question based off of question type
        if type == "multiple_choice_question"
          correct = grade_multiple_choice(xml_questions[xml_index], answers[index])  
        elsif type == "multiple_answers_question"
          correct = grade_multiple_answers(xml_questions[xml_index], answers[index])
        elsif type == "matching_question"
          correct = grade_matching(xml_questions[xml_index], answers[index])
        end
        if correct == true
          answered_correctly += 1
          correct_list[index] = correct
          question["score"] = 1
        elsif correct == false
          correct_list[index] = correct
          question["score"] = 0
        elsif correct[:name]== "partial"
          p_score = (Float(correct[:correct]) / Float(correct[:total]))
          answered_correctly = Float(answered_correctly) + p_score
          question["score"] = p_score
          correct_list[index] = correct[:name]
          correct = false
        end
        confidence_level_list[index] = question["confidenceLevel"]
        confidence_level_int = ItemResult::CONFIDENCE_MAP[question["confidenceLevel"]]

        if item = assessment.items.find_by(identifier: question["id"])

          rendered_time = Time.now
          referer = request.env['HTTP_REFERER']
          item.item_results.create(
            identifier: question["id"],
            item_id: item.id,
            eid: item.id,
            correct: correct,
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
            sequence_index: index,
            answers_chosen: answers[index].is_a?(Array) ? answers[index].join(",") : answers
          )
        else
          rendered_time = Time.now
          referer = request.env['HTTP_REFERER']
          item = assessment.items.build
          item.identifier = question["id"]
          item.question_text = question["material"]
          if item.save!
            item_result = item.item_results.create(
              identifier: question["id"],
              item_id: item.id,
              eid: item.id,
              correct: correct,
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
              sequence_index: index,
              answers_chosen: answers[index].is_a?(Array) ? answers[index].join(",") : answers
            )
          end
        end
      else
        ungraded_questions.push(question)
      end
      # TODO if the question id's dont match then check the rest of the id's
      # if the Id isn't found then there has been an error and return the error
    
    end


    score = Float(answered_correctly) / Float(questions.length)
    score *= Float(100)
    result.score = score

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

    result.save!

    unless result.post_lti_outcome!
      errors << result.outcome_error_message
    end

    graded_assessment = { 
      score: score,
      feedback: "Study Harder",
      correct_list: correct_list,
      confidence_level_list: confidence_level_list,
      lti_params: params,
      assessment_results_id: result.id,
      errors: errors
    }
    # Ping analytics server
    respond_to do |format|
      format.json { render json: graded_assessment }
    end
  end

  private

  def get_xml_index(id, xml_questions)
    xml_questions.each_with_index do |question, index|
      if question.attributes["ident"].value == id
        return index
      end
    end
    return -1
  end
  def grade_multiple_choice(question, answer) 
    correct = false;
    choices = question.children.xpath("respcondition")
    choices.each_with_index do |choice, index|
      
      # if the students response id matches the correct response id for the question the answer is correct
      if choice.xpath("setvar")[0].children.text == "100" && answer == choice.xpath("conditionvar").xpath("varequal").children.text
        correct = true;
      end
    end
    correct
  end

  def grade_multiple_answers(question, answers)
    correct = false;
    choices = question.children.xpath("respcondition").children.xpath("and").xpath("varequal")
    correct_count = 0
    total_correct = choices.length
    # if the answers to many or to few then return false

    if answers.length > total_correct
      return correct
    end 
    choices.each_with_index do |choice, index|
      if answers.include?(choice.text)
        correct_count += 1;
      end
    end

    if correct_count > 0
      correct = {name: "partial", correct: correct_count, total: total_correct}
    end
    if correct_count == total_correct
      correct = true
    end

    correct
  end

  def grade_matching(question, answers)
    correct = false;
    choices = question.children.xpath("respcondition")
    total_correct = choices.length
    correct_count = 0
    choices.each_with_index do |choice, index|
      if answers[index] && choice.xpath("conditionvar").xpath("varequal").children.text == answers[index]["answerId"]
        correct_count += 1
      end
    end
    if correct_count == total_correct
      correct = true
    end

    correct
  end
  
end