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
      total = MultipleChoiceGrader.grade(question_node, answer)
    elsif question["type"] == "multiple_answers_question"
      total = MultipleAnswersGrader.grade(question_node, answer)
    elsif question["type"] == "mom_embed"
      total = OhmGrader.grade(question_node, answer)
    elsif question["type"] == "essay_question"
      total = EssayGrader.grade(question_node, answer)
    end

    total
  end

end

require 'question_graders/essay_grader'
require 'question_graders/multiple_choice_grader'
require 'question_graders/multiple_answers_grader'
require 'question_graders/ohm_grader'
