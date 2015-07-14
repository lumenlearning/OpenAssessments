class Api::GradesController < Api::ApiController
  
  def create

    # store lis stuff in session
    answered_correctly = 0;
    body = JSON.parse(request.body.read);
    item_to_grade = body["itemToGrade"]
    questions = item_to_grade["questions"]
    assessment_id = item_to_grade["assessmentId"]
    assessment = Assessment.find(assessment_id)
    doc = Nokogiri::XML(assessment.assessment_xmls.first.xml)
    doc.remove_namespaces!
    xml_questions = doc.xpath("//item")
    result = assessment.assessment_results.build
    result.save!

    settings = item_to_grade["settings"]
    correct_list = []
    answers = item_to_grade["answers"]
    
    questions.each_with_index do |question, index|

      # make sure we are looking at the right question
      xml_index = get_xml_index(question["id"], xml_questions)
      if question["id"] == xml_questions[xml_index].attributes["ident"].value

        correct = false;
        type = xml_questions[xml_index].children.xpath("qtimetadata").children.xpath("fieldentry").children.text
        
        # grade the question based off of question type
        if type == "multiple_choice_question"
          correct = grade_multiple_choice(xml_questions[xml_index], answers[index])  
        elsif type == "multiple_answers_question"
          correct = grade_multiple_answers(xml_questions[xml_index], answers[index])
        elsif type == "matching_question"
          correct = grade_matching(xml_questions[xml_index], answers[index])
        end
        if correct
          answered_correctly += 1
        end
        correct_list[index] = correct

        if item = assessment.items.find_by(identifier: question["id"])

          rendered_time, referer, user = tracking_info
          item.item_results.create(
            identifier: question["id"],
            item_id: item.id,
            eid: item.id,
            correct: correct,
            external_user_id: params["external_user_id"],
            time_elapsed: question["timeSpent"],
            src_url: settings["srcUrl"],
            assessment_result_id: result.id,
            session_status: "final",
            ip_address: request.ip,
            referer: referer,
            rendered_datestamp: rendered_time,
            confidence_level: question["confidenceLevel"],
            score: question["score"]
          )
        else
          rendered_time, referer, user = tracking_info
          item = assessment.items.build
          item.identifier = question["id"]
          item.question_text = question["material"]
          if item.save!
            item_result = item.item_results.create(
              identifier: question["id"],
              item_id: item.id,
              eid: item.id,
              correct: correct,
              external_user_id: params["external_user_id"],
              time_elapsed: question["timeSpent"],
              src_url: settings["srcUrl"],
              assessment_result_id: result.id,
              session_status: "final",
              ip_address: request.ip,
              referer: referer,
              rendered_datestamp: rendered_time,
              confidence_level: question["confidenceLevel"],
              score: question["score"]
            )
          end
        end
      end
      # TODO if the question id's dont match then check the rest of the id's
      # if the Id isn't found then there has been an error and return the error
    
    end

    score = Float(answered_correctly) / Float(questions.length)
    canvas_score = score
    score *= Float(100)
    graded_assessment = { 
      score: score,
      feedback: "Study Harder",
      correct_list: correct_list
    }

    params = {
      'lis_result_sourcedid'    => session[:lis_result_sourcedid]    || settings[:lisResultSourceDid],
      'lis_outcome_service_url' => session[:lis_outcome_service_url] || settings[:lisOutcomeSourceUrl],
      'user_id'                 => session[:lis_user_id]             || settings[:lisUserId]
    }

    provider = IMS::LTI::ToolProvider.new(current_account.lti_key, current_account.lti_secret, params)

    # post the given score to the TC
    canvas_score = (canvas_score != '' ? canvas_score.to_s : nil)

    res = provider.post_replace_result!(canvas_score)

    # Need to figure out error handling - these will need to be passed to the client
    # or we can also post scores async using activejob in which case we'll want to
    # log any errors and make them visible in the admin ui
    success = res.success?
      
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
    if answers.length != total_correct
      return correct
    end 
    choices.each_with_index do |choice, index|
      if answers.include?(choice.text)
        correct_count += 1;
      end
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