module QuestionGraders
  module MultipleAnswersGrader
    # - for each correct chosen, add 1/#correct
    # - for each incorrectly chosen, subtract 1/total#
    # - make sure #correct * (1/#correct) is 1
    def self.grade(question_node, answers)

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
  end
end