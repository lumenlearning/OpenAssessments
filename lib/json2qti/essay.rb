module Json2Qti
  class Essay < Question

    def type
      "essay_question"
    end

    def rcardinality
      "Single"
    end

    def answer_choices
      <<XML
          <response_str ident="#{respident}" rcardinality="#{rcardinality}">
            <render_fib>
              <response_label ident="answer1" rshuffle="No"/>
            </render_fib>
          </response_str>
XML
    end

        def answer_processing
        <<XML
            <respcondition continue="No">
              <conditionvar>
                <other/>
              </conditionvar>
            </respcondition>
XML
    end

  end
end