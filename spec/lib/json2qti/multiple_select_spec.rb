require 'rails_helper'
require 'json2qti'
require 'nokogiri'

describe Json2Qti::MultipleSelect do
  let(:json) {
    {
            "id" => "4965",
            "title" => "",
            "question_type" => "multiple_answers_question",
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
                    },
                    {
                            "id" => "4501",
                            "material" => "Or this FRD?",
                            "isCorrect" => true
                    }
            ],
            "outcome" => {
                    "shortOutcome" => "Short Name",
                    "longOutcome" => "Long Name",
                    "outcomeGuid" => "f71c5ce2"
            }
    }
  }
  let(:question){Json2Qti::MultipleSelect.new(json)}

  it "should mark all the correct answers" do
    node = Nokogiri::XML(question.to_qti)

    marked_correct = node.css('and > varequal').map{|var| var.text}.sort
    expect(marked_correct).to eq question.answers.select{|a| a["isCorrect"]}.map{|a| a["ident"]}.sort
  end

  it "should mark all the wrong answers" do
    node = Nokogiri::XML(question.to_qti)

    marked_correct = node.css('and > not varequal').map{|var| var.text}.sort
    expect(marked_correct).to eq question.answers.select{|a| !a["isCorrect"]}.map{|a| a["ident"]}.sort
  end

  it "should set the question type" do
    expect(question.to_qti).to include("<fieldentry>multiple_answers_question</fieldentry>")
  end
end