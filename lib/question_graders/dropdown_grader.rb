module QuestionGraders
  module DropdownGrader


    # Expects the answers to be an array of maps like:
    # [
    #   {"dropdown_id": "dropdown1", "chosen_answer_id": "968"},
    #   {"dropdown_id": "dropdown2", "chosen_answer_id": "4960"},
    #   {"dropdown_id": "dropdown3", "chosen_answer_id": "2787"}
    # ]
    #
    # The total is a float ( count chosen correct / count of dropdowns )
    def self.grade(question_node, chosen_answers)
      correct_answers = find_correct_answers(question_node)
      correct_count = 0

      correct_answers.each_pair do |d_id, correct_id|
        if chosen_answers.any?{|ca| ca["dropdown_id"] == d_id && ca["chosen_answer_id"] == correct_id}
          correct_count += 1
        end
      end

      if correct_answers.count == correct_count
        1.0
      else
        (correct_count.to_f / correct_answers.count).round(3)
      end
    end

    # for all of the `respcondition` that `setvar` the score positively
    # save what the correct response is and get its `response_lid.material`
    # so that we can have a map from replacement token to correct answer like:
    # {
    #         "dropdown1" => "968",
    #         "dropdown2" => "4960"
    # }
    def self.find_correct_answers(question_node)
      answers = {}

      # find all the blocks like:
      # <respcondition>
      #   <conditionvar>
      #     <varequal respident="response_dropdown3">6259</varequal>
      #   </conditionvar>
      #   <setvar varname="SCORE" action="Add">33.33</setvar>
      # </respcondition>
      question_node.children.xpath("respcondition").each do |node|
        # skip unless it's setting the score and it's great than 0
        setvar = node.at_css('setvar')
        next unless setvar && setvar['action'] == 'Add' && setvar.text.strip.to_i > 0

        # Grab dropdown id and correct answer
        response_lid = node.at_css('varequal')['respident']
        correct_response = node.at_css('varequal').text

        # look for corresponding node like:
        # <response_lid ident="response_dropdown3">
        #   <material>
        #     <mattext>dropdown3</mattext> <!-- The replacement token text [dropdown3] -->
        #   </material>
        if replacement_token = question_node.at_css("response_lid[ident=#{response_lid}] > material mattext")
          answers[replacement_token.text] = correct_response
        end
      end

      answers
    end

  end
end
