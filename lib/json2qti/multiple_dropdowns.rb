module Json2Qti
  class MultipleDropdowns < Question

    def initialize(item)
      item["answers"] = item["dropdowns"]
      super(item)
    end

    def type
      "multiple_dropdowns_question"
    end

    def set_new_answer_ids
      @answers.each do |d_name, dropdowns|
        dropdowns.each do |ans|
          ans["material"] ||= ans["name"]
          ans["ident"] = generate_digest_ident(ans["material"])
        end
      end
    end

    def rcardinality
      "Single"
    end

    def response_lid_for_name(name)
      "response_#{name}"
    end

    def answer_choices
      out = ""
      @answers.each do |d_name, dropdowns|
        out += <<XML
           <response_lid ident="#{response_lid_for_name(d_name)}">
            <material>
              <mattext>#{d_name}</mattext>
            </material>
              <render_choice>
#{response_labels(dropdowns)}
              </render_choice>
            </response_lid>
XML
      end

      out
    end

    def answer_processing
      out = ""
      @answers.each do |d_name, dropdowns|
        respident = "#{response_lid_for_name(d_name)}"

        dropdowns.each do |ans|
          next unless ans["isCorrect"]
          score = (1.0/@answers.count).round(3)

          out += <<XML
            <respcondition continue="Yes">
              <conditionvar>
                <varequal respident="#{respident}">#{ans["ident"]}</varequal>
              </conditionvar>
              <setvar varname="SCORE" action="Add">#{score}</setvar>
            </respcondition>
XML
        end
      end

      out
    end

    # Iterate over the answers and create a `feedback_condition` for each one
    def feedback_processing
      out = ""
      @answers.each do |d_name, dropdowns|
        respident = response_lid_for_name(d_name)

        dropdowns.each do |ans|
          unless ans["feedback"].blank?
            out += feedback_condition(respident, ans["ident"], feedback_ident(ans["ident"], respident))
          end
        end
      end

      out
    end

    # Iterate over the answers and create a `feedback` for each one
    def feedbacks
      out = ""
      @answers.each do |d_name, dropdowns|
        respident = response_lid_for_name(d_name)

        dropdowns.each do |ans|
          unless ans["feedback"].blank?
            out += feedback(feedback_ident(ans["ident"], respident), ans["feedback"])
          end
        end
      end

      out
    end

  end
end