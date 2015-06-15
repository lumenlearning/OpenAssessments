class Api::GradesController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :skip_trackable
  respond_to :json

  def create

    # store lis stuff in session
  
    answered_correctly = 0;
    body = JSON.parse(request.body.read);
    item_to_grade = body["itemToGrade"]
    questions = item_to_grade["questions"]

    answers = item_to_grade["answers"]
    assessment_id = item_to_grade["assessmentId"]
    assessment = Assessment.find(assessment_id)
    doc = Nokogiri::XML(assessment.assessment_xmls.first.xml)
    doc.remove_namespaces!
    xml_questions = doc.xpath("//item")

    
    questions.each_with_index do |question, index|

      # make sure we are looking at the right question
      if question["id"] == xml_questions[index].attributes["ident"].value
        correct = false;
        type = xml_questions[index].children.xpath("qtimetadata").children.xpath("fieldentry").children.text
        
        # grade the question based off of question type
        if type == "multiple_choice_question"
          correct = grade_multiple_choice(xml_questions[index], answers[index])  
        elsif type == "multiple_answers_question"
          correct = grade_multiple_answers(xml_questions[index], answers[index])
        elsif type == "matching_question"
          correct = grade_matching(xml_questions[index], answers[index])
        end
        if correct
          answered_correctly += 1
        end
      end

      # TODO if the question id's dont match then check the rest of the id's
      # if the Id isn't found then there has been an error and return the error
    
    end
    debugger

    params = {
      lis_result_sourcedid: session[:lis_result_sourcedid],
      lis_outcome_service_url: session[:lis_outcome_service_url],
      user_id: session[:lis_user_id]
    }
    provider = IMS::LTI::ToolProvider.new(current_account.lti_key, current_account.lti_secret, params)

    # post the given score to the TC
    score = (params['score'] != '' ? params['score'] : nil)
    res = provider.post_replace_result!(params['score'])

    # Need to figure out error handling - these will need to be passed to the client
    # or we can also post scores async using activejob in which case we'll want to
    # log any errors and make them visible in the admin ui
    success = res.success?
      
    # Ping analytics server
  end

  private

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