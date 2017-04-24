module Json2Qti
  class MultipleChoice < Question

    def type
      "multiple_choice_question"
    end

    def rcardinality
      "Single"
    end

    def answer_choices
      <<XML
           <response_lid ident="#{respident}" rcardinality="#{rcardinality}">
              <render_choice>
#{response_labels}
              </render_choice>
            </response_lid>
XML
    end

    def answer_processing
      out = ""
      @answers.each do |ans|
        score = ans["isCorrect"] ? "100" : "0"
        out += <<XML
            <respcondition continue="Yes">
              <conditionvar>
                <varequal respident="#{respident}">#{ans["ident"]}</varequal>
              </conditionvar>
              <setvar varname="SCORE" action="Set">#{score}</setvar>
            </respcondition>
XML
      end

      out
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