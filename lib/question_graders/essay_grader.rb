module QuestionGraders
  module EssayGrader
    def self.grade(question_node, answer)
      answer = answer.is_a?(Array) ? answer[0] : answer

      answer.present? ? 1 : 0
    end
  end
end
