module Json2Qti
  class Question
    attr_accessor :outcome, :title, :id, :material, :answers, :ident

    def initialize(item)
      @title = item["title"] || ''
      @material = item["material"] || ''
      @answers = item["answers"] || []
      @id = item["id"]
      @key = [@material, @answers]
      @ident = generate_digest_ident(@key)

      if @outcome = item["outcome"]
        @outcome["guid"] ||= @outcome.delete("outcomeGuid")
        @outcome["long_title"] ||= @outcome.delete("longOutcome")
        @outcome["short_title"] ||= @outcome.delete("shortOutcome")
      end
    end

    def self.new_from_item(item)
      case item["question_type"]
        when 'multiple_answers_question'
          MultipleSelect.new(item)
        when 'multiple_choice_question'
          MultipleChoice.new(item)
        when 'mom_embed'
          OhmEmbed.new(item)
        when 'multiple_dropdowns_question'
          MultipleDropdowns.new(item)
        else
          nil
      end
    end

    def generate_digest_ident(key)
      "i" + Digest::MD5.hexdigest(Marshal::dump(key))
    end

    def type
      "unknown"
    end

    def set_new_answer_ids
      @answers.each do |ans|
        ans["ident"] = generate_digest_ident(ans["material"])
      end
    end

    def respident
      "response1"
    end

    def feedback_ident(id, local_respident=nil)
      local_respident ||= respident
      "#{id}_#{local_respident}_fb"
    end

    def rcardinality
      ""
    end

    def answer_choices
      ""
    end

    def material_ext
      ""
    end

    def response_labels(answers=nil)
      answers ||= @answers
      out = ''
      answers.each do |ans|
        out += <<XML
                <response_label ident="#{ans["ident"]}">
                  <material>
                    <mattext texttype="text/html">#{ans["material"].encode(:xml => :text)}</mattext>
                  </material>
                </response_label>
XML
      end

      out
    end

    def answer_processing
      ''
    end

    def to_qti
      set_new_answer_ids
      <<XML
        <item title="#{@title.encode(:xml => :text)}" ident="#{@ident.encode(:xml => :text)}">
          <itemmetadata>
            <qtimetadata>
              <qtimetadatafield>
                <fieldlabel>question_type</fieldlabel>
                <fieldentry>#{type.encode(:xml => :text)}</fieldentry>
              </qtimetadatafield>
#{outcome_meta}
            </qtimetadata>
          </itemmetadata>
          <presentation>
            <material>
              <mattext texttype="text/html">#{@material.encode(:xml => :text)}</mattext>
#{material_ext}
            </material>
#{answer_choices}
          </presentation>
          <resprocessing>
            <outcomes>
              <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
            </outcomes>
#{answer_processing}
#{feedback_processing}
          </resprocessing>
#{feedbacks}
        </item>
XML
    end

    def outcome_meta
      return '' unless @outcome
      <<XML
              <qtimetadatafield>
                <fieldlabel>outcome_guid</fieldlabel>
                <fieldentry>#{@outcome['guid'].encode(:xml => :text)}</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_short_title</fieldlabel>
                <fieldentry>#{@outcome['short_title'].encode(:xml => :text)}</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_long_title</fieldlabel>
                <fieldentry>#{@outcome['long_title'].encode(:xml => :text)}</fieldentry>
              </qtimetadatafield>
XML
    end

    # Iterate over the answers and create a `feedback_condition` for each one
    def feedback_processing
      ""
    end

    def feedback_condition(respident, answer_ident, feedback_ident)
      <<XML
            <respcondition continue="Yes">
              <conditionvar>
                <varequal respident="#{respident.encode(:xml => :text)}">#{answer_ident.encode(:xml => :text)}</varequal>
              </conditionvar>
              <displayfeedback feedbacktype="Response" linkrefid="#{feedback_ident.encode(:xml => :text)}"/>
            </respcondition>
XML
    end

    # Iterate over the answers and create a `feedback` for each one
    def feedbacks
      ""
    end

    def feedback(ident, mattext)
      <<XML
          <itemfeedback ident="#{ident.encode(:xml => :text)}">
            <flow_mat>
              <material>
                <mattext texttype="text/html">#{mattext.encode(:xml => :text)}</mattext>
              </material>
            </flow_mat>
          </itemfeedback>
XML
    end

  end
end