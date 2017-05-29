module Json2Qti
  # takes the JSON from the OEA front-end and converts it to a QTI quiz
  # Expects JSON like:
  # {
  #   "title": "Show What You Know: Outcome Name",
  #   "ident": "ib7b957_swyk",
  #   "assessmentId": "152",
  #   "standard": "qti",
  #   "items": [
  #     {
  #       "id": "4965",
  #       "title": "",
  #       "question_type": "multiple_answers_question",
  #       "material": "Which of the following is/are an example(s) of a service?",
  #       "answers": [
  #         {
  #           "id": "9755",
  #           "material": "a flight from Los Angeles to Dallas",
  #           "isCorrect": true
  #         },
  #         {
  #           "id": "4501",
  #           "material": "a couch or sofa",
  #           "isCorrect": false
  #         },
  #         {
  #           "id": "6570",
  #           "material": "a computer",
  #           "isCorrect": false
  #         }
  #       ],
  #       "outcome": {
  #         "shortOutcome": "What Is Business?",
  #         "longOutcome": "Define the concept of business",
  #         "outcomeGuid": "f71c5ce2-46b7-4cce-9531-1680d42faf1b"
  #       }
  #     }
  #   ]
  # }
  class Converter
    attr_accessor :items, :title, :ident

    def initialize(json, opts={})
      @json = json
      @title = @json["title"] || ''
      @ident = @json["ident"] || ''
      @qti = ""
      @group_by_section = opts["group_by_section"]
      @per_section = opts["per_sec"].to_s || ''

      # Convert each item to a convert Question object and remove unknown types (`nil`s)
      @items = json["items"].map{|i| Question.new_from_item(i) }.compact

      if @group_by_section
        if @items.all? { |item| item.outcome }
          @sections = @items.group_by { |i| i.outcome["guid"] }
        else
          @group_by_section = false
        end

      end

    end

    # returns qti string for the whole assessment
    def convert_to_qti
      @qti = ""
      check_duplicate_question_idents
      write_quiz
    end

    def check_duplicate_question_idents
      dup_count = {}
      @items.each do |item|
        if dup_count[item.ident]
          dup_count[item.ident] += 1
          item.ident += "_#{dup_count[item.ident]}"
        else
          dup_count[item.ident] = 1
        end
      end
    end


    def write_quiz
      @qti += start_quiz

      if @group_by_section
        write_sections
      else
        @qti += start_section("selectionsection")
        write_items(@items)
        @qti += end_section
      end

      @qti += end_quiz
    end

    def write_sections
      @sections.each do |section, items|
        @qti += start_section(section)
        write_items(items)
        @qti += end_section
      end
    end

    def write_items(items)
      items.each_with_index do |item, i|
        @qti += item.to_qti
      end
    end


    def start_quiz
      <<XML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="#{@title.encode(:xml => :text)}" ident="#{@ident.encode(:xml => :text)}">
    <qtimetadata>
      <qtimetadatafield>
        <fieldlabel>qmd_timelimit</fieldlabel>
        <fieldentry/>
      </qtimetadatafield>
      <qtimetadatafield>
        <fieldlabel>cc_maxattempts</fieldlabel>
        <fieldentry/>
      </qtimetadatafield>
    </qtimetadata>
    <section ident="root_section">
XML
    end

    def end_quiz
      <<XML
    </section>
  </assessment>
</questestinterop>
XML
    end

    def start_section(guid)
      ident = ("i" + guid.gsub("-", "") + "_section").encode(:xml => :text)
      per_sec = @per_section.encode(:xml => :text)
      <<XML
      <section title="" ident="#{ident.encode(:xml => :text)}">
        <selection_ordering>
          <selection>
            <sourcebank_ref/>
            <selection_number>#{per_sec}</selection_number>
            <selection_extension>
              <points_per_item>1</points_per_item>
            </selection_extension>
          </selection>
        </selection_ordering>
XML
    end

    def end_section
      <<XML
    </section>
XML
    end


  end
end