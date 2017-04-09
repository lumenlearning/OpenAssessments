module QuestionGraders

  # all registered question graders
  # to add a new one create a module that has a static method like:
  # self.grade(question_node, answer)
  QUESTION_GRADERS = {
          "essay_question" => EssayGrader,
          "multiple_choice_question" => MultipleChoiceGrader,
          "multiple_answers_question" => MultipleAnswersGrader,
          "mom_embed" => OhmGrader
  }

  def self.grade_question(question, question_node, answer)
    total = 0
    # find the question type
    # todo - don't grab type by order of metadata fields
    question["type"] = question_node.children.xpath("qtimetadata").children.xpath("fieldentry").children.text
    # if the question type gets some wierd stuff if means that the assessment has outcomes so we need
    # to get the question data a little differently
    if question["type"] != "multiple_choice_question" && question["type"] != "multiple_answers_question" && question["type"] != "matching_question"
      question["type"] = question_node.children.xpath("qtimetadata").children.xpath("fieldentry").children.first.text
    end

    if grader_module = QUESTION_GRADERS[question["type"]]
      total = grader_module.grade(question_node, answer)
    else
      #todo better handle unknown question types
      puts "uh oh"
    end

    total
  end

end

require 'question_graders/essay_grader'
require 'question_graders/multiple_choice_grader'
require 'question_graders/multiple_answers_grader'
require 'question_graders/ohm_grader'
