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

  it "should only mark one answer as correct" do
    node = Nokogiri::XML(question.to_qti)

    node.css('respcondition').each do |cond|
      id = cond.at_css('varequal').text
      score = cond.at_css('setvar').text
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
end