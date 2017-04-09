require 'jwt'
require 'question_graders'

class AssessmentGrader

  include QuestionGraders
  attr_reader :questions, :answers, :assessment, :correct_list, :confidence_level_list

  def initialize(questions, answers, assessment)
    @questions = questions
    @answers = answers
    @assessment = assessment
    @correct_list = []
    @confidence_level_list = []
    @ungraded_questions = []
    @xml_index_list = []
    @answered_correctly = 0
    @doc = Nokogiri::XML(@assessment.xml_with_answers)
    @doc.remove_namespaces!
    @xml_questions = @doc.xpath("//item")
  end

  def grade!
    @questions.each_with_index do |question, index|
      # make sure we are looking at the right question
      xml_index = get_xml_index(question["id"], @xml_questions)
      question_node = get_question_node_from_index(xml_index)
      @xml_index_list.push(xml_index)
      if question["id"] == @xml_questions[xml_index].attributes["ident"].value
        total = 0
        
        total = grade_question(question, question_node, @answers[index])

        if total == 1 then @correct_list[index] = true
        elsif total == 0 then @correct_list[index] = false
        elsif total == ! 1 || 0 then @correct_list[index] = "partial" end

        @answered_correctly += total
        @confidence_level_list[index] = question["confidenceLevel"]
        question["score"] = total
      end
    end
  end

  def score
    ((@answered_correctly.to_f) / (@questions.length.to_f)).round(3)
  end

  def get_xml_index(id, xml_questions)
    xml_questions.each_with_index do |question, index|
      return index if question.attributes["ident"].value == id
    end
    return -1
  end

  def get_question_node_from_index(index)
    @xml_questions[index]
  end

end
