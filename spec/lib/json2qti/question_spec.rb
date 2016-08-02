require 'rails_helper'
require 'json2qti'
require 'nokogiri'

describe Json2Qti::Question do
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
                            "isCorrect" => true
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

  it "should add outcome" do
    expect(question.to_qti).to include("<fieldentry>Short Name</fieldentry>")
    expect(question.to_qti).to include("<fieldentry>Long Name</fieldentry>")
    expect(question.to_qti).to include("<fieldentry>f71c5ce2</fieldentry>")
  end

  it "should escape question material" do
    expect(question.to_qti).to include(%{<mattext texttype="text/html">Which of the following? &amp;</mattext>})
  end

  it "should generate a new id" do
    node = Nokogiri::XML(question.to_qti)
    expect(node.at_css('item @ident').text).not_to eq '4965'
  end

  it "should set the question type" do
    expect(question.to_qti).to include("<fieldentry>multiple_choice_question</fieldentry>")
  end
end