require 'rails_helper'
require 'json2qti'
require 'nokogiri'

describe Json2Qti::MultipleChoice do
  let(:json) {
    {
            "id" => "4965",
            "title" => "",
            "question_type" => "multiple_choice_question",
            "material" => "Which of the following? &",
            "answers" => [
                    {
                            "id" => "9755",
                            "material" => "This?",
                            "isCorrect" => true,
                            "feedback" => "<strong>Good job!</strong>"
                    },
                    {
                            "id" => "4501",
                            "material" => "Or this?",
                            "isCorrect" => false
                    }
            ],
            "outcome" => {
                    "shortOutcome" => "Short Name",
                    "longOutcome" => "Long Name",
                    "outcomeGuid" => "f71c5ce2"
            }
    }
  }
  let(:question){Json2Qti::MultipleChoice.new(json)}

  it "should only mark one answer as correct" do
    node = Nokogiri::XML(question.to_qti)

    node.css('respcondition').each do |cond|
      setvar = cond.at_css('setvar')
      next unless setvar

      id = cond.at_css('varequal').text
      score = setvar.text
      item = question.answers.find{|a| a["ident"] == id}

      expect(score).to eq item["isCorrect"] ? "100" : "0"
    end
  end

  it "should have all the answer choices" do
    node = Nokogiri::XML(question.to_qti)

    question.answers.each do |ans|
      label = node.at_css("response_label[ident=#{ans["ident"]}]")
      expect(label.at_css('mattext').text).to eq ans["material"]
    end
  end

  it "should set the question type" do
    expect(question.to_qti).to include("<fieldentry>multiple_choice_question</fieldentry>")
  end

  context "feedback" do
    before do
      @answer = json["answers"][0]
      @answer_ident = question.generate_digest_ident(@answer["material"])
      @feedback_ident = question.feedback_ident(@answer_ident)
      @node = Nokogiri::XML(question.to_qti)
    end

    # <respcondition continue="Yes">
    #   <conditionvar>
    #     <varequal respident="response1">i4358c9f7de1996591ed4140139ac8941</varequal>
    #   </conditionvar>
    #   <displayfeedback feedbacktype="Response" linkrefid="i4358c9f7de1996591ed4140139ac8941_response1"/>
    # </respcondition>
    it "should create a feedback respcondition" do
      displayfeedback = @node.at_css("displayfeedback[linkrefid=#{@feedback_ident}]")
      resp = displayfeedback.parent
      varequal = resp.at_css('varequal')

      expect(varequal.text).to eq @answer_ident
      expect(varequal["respident"]).to eq question.respident
    end

    # <itemfeedback ident="i4358c9f7de1996591ed4140139ac8941_response1">
    #   <flow_mat>
    #     <material>
    #       <mattext texttype="text/html">&lt;strong&gt;Good job!&lt;/strong&gt;</mattext>
    #     </material>
    #   </flow_mat>
    # </itemfeedback>
    it "should create an itemfeedback" do
      feedback = @node.at_css("itemfeedback[ident=#{@feedback_ident}] mattext").text

      expect(feedback).to eq @answer["feedback"]
    end

    it "shouldn't create respcondition/itemfeedback if none for an answer" do
      answer = json["answers"][1]
      answer_ident = question.generate_digest_ident(answer["material"])
      feedback_ident = question.feedback_ident(answer_ident)

      expect(@node.at_css("displayfeedback[linkrefid=#{feedback_ident}]")).to be_nil
      expect(@node.at_css("itemfeedback[ident=#{feedback_ident}]")).to be_nil
    end

  end

end