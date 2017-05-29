require 'rails_helper'
require 'json2qti'
require 'nokogiri'

describe Json2Qti::Question do
  let(:json) {
    {
            "id" => "4965",
            "title" => "This & That",
            "question_type" => "multiple_choice_question",
            "material" => "Which of the following? &",
            "feedback" => {"general_fb" => "You <b>answered</b> it!"},
            "answers" => [
                    {
                            "id" => "9755",
                            "material" => "This?",
                            "isCorrect" => true,
                            "feedback" => "<strong>Good job!</strong>"
                    },
                    {
                            "id" => "4501",
                            "material" => "& Or this?",
                            "isCorrect" => false,
                            "feedback" => "<em>Maybe next time.</em>"
                    }
            ],
            "outcome" => {
                    "shortOutcome" => "Short & Name",
                    "longOutcome" => "Long & Name",
                    "outcomeGuid" => "&f71c5ce2"
            }
    }
  }
  let(:question){Json2Qti::MultipleChoice.new(json)}

  it "should add outcome" do
    expect(question.to_qti).to include("<fieldentry>Short &amp; Name</fieldentry>")
    expect(question.to_qti).to include("<fieldentry>Long &amp; Name</fieldentry>")
    expect(question.to_qti).to include("<fieldentry>&amp;f71c5ce2</fieldentry>")
  end

  it "should escape question material" do
    expect(question.to_qti).to include(%{<mattext texttype="text/html">Which of the following? &amp;</mattext>})
    expect(question.to_qti).to include(%{<mattext texttype="text/html">&amp; Or this?</mattext>})
    expect(question.to_qti).to include(%{<item title="This &amp; That"})
  end

  it "should generate a new id" do
    node = Nokogiri::XML(question.to_qti)
    expect(node.at_css('item @ident').text).not_to eq '4965'
  end

  it "should set the question type" do
    expect(question.to_qti).to include("<fieldentry>multiple_choice_question</fieldentry>")
  end

  it "should declare the SCORE variable" do
    node = Nokogiri::XML(question.to_qti)

    expect(node.at_css('resprocessing outcomes decvar')['varname']).to eq 'SCORE'
  end

  context "general feedback" do

    it "should show the general_fb feedback" do
      node = Nokogiri::XML(question.to_qti)
      displayfeedback = node.at_css('resprocessing respcondition displayfeedback')
      resp = displayfeedback.parent

      expect(resp["continue"]).to eq 'Yes'
      expect(displayfeedback['linkrefid']).to eq 'general_fb'
    end

    # <itemfeedback ident="general_fb">
    #   <flow_mat>
    #     <material>
    #       <mattext texttype="text/html">&lt;strong&gt;Good job!&lt;/strong&gt;</mattext>
    #     </material>
    #   </flow_mat>
    # </itemfeedback>
    it "should create an itemfeedback" do
      node = Nokogiri::XML(question.to_qti)
      feedback = node.at_css("itemfeedback[ident=general_fb] mattext").text

      expect(feedback).to eq json["feedback"]["general_fb"]
    end
  end

end