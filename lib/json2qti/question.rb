module Json2Qti
  class Question
    attr_accessor :outcome, :title, :id, :material, :answers, :ident

    def initialize(item)
      @title = item["title"] || ''
      # @material = item["material"] || ''
      # @answers = item["answers"]

      @material = Json2Qti::white_list_sanitize_html(item["material"]) # still need the || ''  ?
      @answers = item["answers"].map{|a| a["material"] = Json2Qti::white_list_sanitize_html(a["material"]); a }

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
          nil
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

    def rcardinality
      ""
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

    def response_labels
      out = ''
      @answers.each do |ans|
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
            </material>
#{answer_choices}
          </presentation>
          <resprocessing>
            <outcomes>
              <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
            </outcomes>
#{answer_processing}
          </resprocessing>
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

  end
end
