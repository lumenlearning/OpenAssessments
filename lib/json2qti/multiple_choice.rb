module Json2Qti
  class MultipleChoice < Question
    def type
      "multiple_choice_question"
    end

    def answer_processing
      out = ""
      @answers.each do |ans|
        score = ans["isCorrect"] ? "100" : "0"
        out += <<XML
            <respcondition continue="No">
              <conditionvar>
                <varequal respident="response1">#{ans["ident"]}</varequal>
              </conditionvar>
              <setvar varname="SCORE" action="Set">#{score}</setvar>
            </respcondition>
XML
      end

      out
    end
  end
end