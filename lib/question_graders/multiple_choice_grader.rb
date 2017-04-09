module QuestionGraders
  module MultipleChoiceGrader

    def self.grade(question_node, answer)
      correct_answer_id = get_correct_mc_answer_id(question_node)
      answer == correct_answer_id ? 1 : 0
    end

    def self.get_correct_mc_answer_id(question)
      choices = question.children.xpath("respcondition")
      choices.each_with_index do |choice, index|
        # if the students response id matches the correct response id for the question the answer is correct
        setvar = choice.xpath("setvar")[0]
        if setvar && setvar.children.text == "100"
          return choice.xpath("conditionvar").xpath("varequal").children.text
        end
      end
    end

  end
end