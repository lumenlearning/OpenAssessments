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
                            "isCorrect" => true,
                            "feedback" => 'Yay, you did it!'
                    },
                    {
                            "id" => "4501",
                            "material" => "Or this?",
                            "isCorrect" => false,
                            "feedback" => "try again"
                    },
                    {
                            "id" => "4501",
                            "material" => "Or this FRD?",
                            "isCorrect" => true,
                            "feedback" => "also <em>yay!</em>"
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

  it "should add the feedback respconditions and itemfeedbacks" do
    node = Nokogiri::XML(question.to_qti)

    json["answers"].each do |answer|
      answer_ident = question.generate_digest_ident(answer["material"])
      feedback_ident = question.feedback_ident(answer_ident)
      displayfeedback = node.at_css("displayfeedback[linkrefid=#{feedback_ident}]")
      resp = displayfeedback.parent
      varequal = resp.at_css('varequal')
      itemfeedback = node.at_css("itemfeedback[ident=#{feedback_ident}] mattext").text

      expect(varequal.text).to eq answer_ident
      expect(varequal["respident"]).to eq question.respident
      expect(itemfeedback).to eq answer["feedback"]
    end
  end

end