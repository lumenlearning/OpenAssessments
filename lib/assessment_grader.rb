class AssessmentGrader

  attr_accessor :questions, :answers, :assessment

  def initialize(questions, answers, assessment)
    @questions = questions
    @answers = answers
    @assessment = assessment
    @correct_list = []
    @confidence_level_list = []
    @ungraded_questions = []
    @xml_index_list = []
    @answered_correctly = 0
    @doc = Nokogiri::XML(@assessment.assessment_xmls.where(kind: "formative").last.xml)
    @doc.remove_namespaces!
    @xml_questions = @doc.xpath("//item")
  end

  def grade!
    @questions.each_with_index do |question, index|
      # make sure we are looking at the right question
      xml_index = get_xml_index(question["id"], @xml_questions)
      @xml_index_list.push(xml_index)
      if question["id"] == @xml_questions[xml_index].attributes["ident"].value
        correct = false;
        # find the question type
        type = @xml_questions[xml_index].children.xpath("qtimetadata").children.xpath("fieldentry").children.text
        # if the question type gets some wierd stuff if means that the assessment has outcomes so we need
        # to get the question data a little differently
        if type != "multiple_choice_question" && type != "multiple_answers_question" && type != "matching_question"
          type = @xml_questions[xml_index].children.xpath("qtimetadata").children.xpath("fieldentry").children.first.text
        end

        # grade the question based off of question type
        if type == "multiple_choice_question"
          correct = grade_multiple_choice(@xml_questions[xml_index], @answers[index])
        elsif type == "multiple_answers_question"
          correct = grade_multiple_answers(xml_index, @answers[index])
        elsif type == "matching_question"
          correct = grade_matching(@xml_questions[xml_index], @answers[index])
        end

        if correct == 1
          @correct_list[index] = true
        elsif correct == 0
          @correct_list[index] = false
        elsif correct != 1 || 0
          @correct_list[index] = "partial"
        end

        @answered_correctly += correct
        question["score"] = correct
        @confidence_level_list[index] = question["confidenceLevel"]
      end
    end
  end

  def get_xml_index(id, xml_questions)
    xml_questions.each_with_index do |question, index|
      if question.attributes["ident"].value == id
        return index
      end
    end
    return -1
  end

  def grade_multiple_choice(question, answer)
    return true
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

  def grade_multiple_answers(xml_index, answers)
    question = @xml_questions[xml_index]
    correct = 0
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
      correct = (correct_count) * (1/total_correct.to_f)
      if correct == 0 || correct == 1
        correct = correct.to_i
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

  def score
    score = (Float(@answered_correctly) / Float(@questions.length))
    score
  end
end
