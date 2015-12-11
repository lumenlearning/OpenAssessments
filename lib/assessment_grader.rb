class AssessmentGrader

  attr_reader :questions, :answers, :assessment

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
        total = 0
        # find the question type
        type = @xml_questions[xml_index].children.xpath("qtimetadata").children.xpath("fieldentry").children.text
        # if the question type gets some wierd stuff if means that the assessment has outcomes so we need
        # to get the question data a little differently
        if type != "multiple_choice_question" && type != "multiple_answers_question" && type != "matching_question"
          type = @xml_questions[xml_index].children.xpath("qtimetadata").children.xpath("fieldentry").children.first.text
        end

        # grade the question based off of question type
        if type == "multiple_choice_question"
          total = grade_multiple_choice(xml_index, @answers[index])
        elsif type == "multiple_answers_question"
          total = grade_multiple_answers(xml_index, @answers[index])
        elsif type == "matching_question"
          total = grade_matching(@xml_questions[xml_index], @answers[index])
        end

        if 1
          @correct_list[index] = true
          @answered_correctly += total
        elsif 0
          @correct_list[index] = false
        elsif ! 1 || 0
          @correct_list[index] = "partial"
          @answered_correctly = (@answered_correctly.to_f) + total
        # binding.pry
        end

        question["score"] = total
        @confidence_level_list[index] = question["confidenceLevel"]
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

 def grade_multiple_choice(xml_index, answer)
   correct_answer_id = get_correct_mc_answer_id(xml_index)
   answer.first == correct_answer_id ? 1 : 0
 end

 def get_correct_mc_answer_id(xml_index)
   question = @xml_questions[xml_index]
   choices = question.children.xpath("respcondition")
   choices.each_with_index do |choice, index|
     # if the students response id matches the correct response id for the question the answer is correct
     if choice.xpath("setvar")[0].children.text == "100"
       return choice.xpath("conditionvar").xpath("varequal").children.text
     end
   end
 end

  def grade_multiple_answers(xml_index, answers)
    question = @xml_questions[xml_index]
    correct_choices = question.children.xpath("respcondition").children.xpath("and").xpath("varequal")
    all_possible = correct_choices.length + (question.children.xpath("respcondition").children.xpath("and").xpath("not").xpath("varequal")).length
    correct = 0
    correct_choices.each_with_index do |choice, index|
      if answers.include?(choice.text) then correct += 1 end
    end
    total =  answers.length - correct
    if total == answers.length
      0
    elsif total == 0
      1
    else
      (((answers.length - total)/correct_choices.length.to_f) - (total/all_possible.to_f)).round(3)
    end
  end

  # Not Currently in Use
  # def grade_matching(question, answers)
  #   total = 0
  #   choices = question.children.xpath("respcondition")
  #   total_correct = choices.length
  #   correct = 0
  #   choices.each_with_index do |choice, index|
  #     if answers[index] && choice.xpath("conditionvar").xpath("varequal").children.text == answers[index]["answerId"]
  #       correct_count += 1
  #     end
  #   end
  #   total = correct
  #   total
  # end
end
