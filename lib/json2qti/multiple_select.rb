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

    def answer_choices
      <<XML
           <response_lid ident="response1" rcardinality="#{rcardinality}">
              <render_choice>
#{response_labels}
              </render_choice>
            </response_lid>
XML
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

     # Iterate over the answers and create a `feedback_condition` for each one
    def feedback_processing
      out = ""
      @answers.each do |ans|
        unless ans["feedback"].blank?
          out += feedback_condition(respident, ans["ident"], feedback_ident(ans["ident"]))
        end
      end

      out
    end

    # Iterate over the answers and create a `feedback` for each one
    def feedbacks
      out = ""
      @answers.each do |ans|
        unless ans["feedback"].blank?
          out += feedback(feedback_ident(ans["ident"]), ans["feedback"])
        end
      end

      out
    end



  end
end