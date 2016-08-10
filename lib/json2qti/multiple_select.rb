module Json2Qti
  class MultipleSelect < Question
    def type
      "multiple_answers_question"
    end

    def rcardinality
      "Multiple"
    end

    def correct_responses
      out = ''
      @answers.select{|a| a["isCorrect"]}.each do |ans|
      out += <<XML
                  <varequal respident="response1">#{ans['ident']}</varequal>
XML
      end

      out
    end

    def wrong_responses
      out = ''
      @answers.select{|a| !a["isCorrect"]}.each do |ans|
      out += <<XML
                  <not>
                    <varequal respident="response1">#{ans['ident']}</varequal>
                  </not>
XML
      end

      out
    end

    def answer_processing
      <<XML
            <respcondition continue="No">
              <conditionvar>
                <and>
#{correct_responses}
#{wrong_responses}
                </and>
              </conditionvar>
              <setvar varname="SCORE" action="Set">100</setvar>
            </respcondition>
XML
    end
  end
end