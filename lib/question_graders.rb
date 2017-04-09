module QuestionGraders

  def grade_question(question, question_node, answer)
    total = 0
    # find the question type
    # todo - don't grab type by order of metadata fields
    question["type"] = question_node.children.xpath("qtimetadata").children.xpath("fieldentry").children.text
    # if the question type gets some wierd stuff if means that the assessment has outcomes so we need
    # to get the question data a little differently
    if question["type"] != "multiple_choice_question" && question["type"] != "multiple_answers_question" && question["type"] != "matching_question"
      question["type"] = question_node.children.xpath("qtimetadata").children.xpath("fieldentry").children.first.text
    end

    # grade the question based off of question type
    if question["type"] == "multiple_choice_question"
      total = grade_multiple_choice(question_node, answer)
    elsif question["type"] == "multiple_answers_question"
      total = grade_multiple_answers(question_node, answer)
    elsif question["type"] == "mom_embed"
      total = grade_mom_embed(question_node, answer)
    elsif question["type"] == "essay_question"
      total = EssayGrader.grade(question_node, answer)
    end

    total
  end

  def get_mom_question_id(question)
    id = question.children.at_css("material mat_extension mom_question_id").text.strip
    id.to_i
  end

# MOM returns a a JWT signed with the shared secret
# This allows us to trust the score even though it goes through the client
# If the JWT is invalid we score the answer for 0 points
# The JWT's payload looks like:
# {
#         "id" => 79660,
#         "score" => 1,
#         "redisplay" => "3766;0;(2,2)",
#         "auth" => "secret_lookup_key"
# }
  def grade_mom_embed(question_node, answer)
    payload, header = JWT.decode(answer, Rails.application.secrets.mom_secret)

    # Verify that the score is for the designated question
    if payload["id"] == get_mom_question_id(question_node)
      return payload["score"]
    end

    return 0
  rescue JWT::DecodeError
    # The token was invalid
    return 0
  end

# - for each correct chosen, add 1/#correct
# - for each incorrectly chosen, subtract 1/total#
# - make sure #correct * (1/#correct) is 1
  def grade_multiple_answers(question_node, answers)

    correct_idents = question_node.children.xpath("respcondition").children.xpath("and").xpath("varequal").map(&:text)
    count_of_response_options = correct_idents.length + (question_node.children.xpath("respcondition").children.xpath("and").xpath("not").xpath("varequal")).length

    user_correct_count = 0
    correct_idents.each do |ident|
      user_correct_count += 1 if answers.include?(ident)
    end
    user_wrongly_chosen_count = (answers.length - user_correct_count)

    if user_correct_count == 0
      0
    elsif correct_idents.length == user_correct_count && user_wrongly_chosen_count == 0
      1
    else
      score = (((user_correct_count)/correct_idents.length.to_f) - (user_wrongly_chosen_count/count_of_response_options.to_f)).round(3)
      score < 0.0 ? 0.0 : score
    end
  end

  def get_correct_mc_answer_id(question)
    choices = question.children.xpath("respcondition")
    choices.each_with_index do |choice, index|
      # if the students response id matches the correct response id for the question the answer is correct
      setvar = choice.xpath("setvar")[0]
      if setvar && setvar.children.text == "100"
        return choice.xpath("conditionvar").xpath("varequal").children.text
      end
    end
  end

  def grade_multiple_choice(question_node, answer)
    correct_answer_id = get_correct_mc_answer_id(question_node)
    answer == correct_answer_id ? 1 : 0
  end
end

require 'question_graders/essay_grader'
