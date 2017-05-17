require 'rails_helper'
require 'json2qti'
require 'nokogiri'

describe Json2Qti::MultipleDropdowns do
  let(:json) {
    {
            "id" => "ief70c36553c83d698048ffabb51b5745",
            "title" => "",
            "question_type" => "multiple_dropdowns_question",
            "material" => "Mutations in organisms [dropdown1] increase fitness. Mutations also [dropdown2] decrease fitness.",
            "dropdowns" => {
                    "dropdown1" => [
                            {"name" => "name of first value",
                             "value" => 'i63f56b344d2bec49b64c0da7c428c0a5',
                             "feedback" => "some feedback",
                             "isCorrect" => false},
                            {"name" => "name of second value",
                             "value" => 'if895fe8c431e4550794b0793348d0de6',
                             "feedback" => "more feedback",
                             "isCorrect" => true},
                            {"name" => "name of third value",
                             "value" => 'i00881b5a9dc037b7e1e5b191ef55b80e',
                             "feedback" => "another feedback",
                             "isCorrect" => false}
                    ],
                    "dropdown2" => [
                            {"name" => "name of first value", "value" => 'i63f56b344d2bec49b64c0da7c428c0a5', "feedback" => "some feedback", "isCorrect" => false},
                            {"name" => "name of second value", "value" => 'if895fe8c431e4550794b0793348d0de6', "feedback" => "more feedback", "isCorrect" => false},
                            {"name" => "name of third value", "value" => 'i00881b5a9dc037b7e1e5b191ef55b80e', "feedback" => "another feedback", "isCorrect" => true}
                    ]
            },
            "outcome" => {
                    "shortOutcome" => "Short Name",
                    "longOutcome" => "Long Name",
                    "outcomeGuid" => "f71c5ce2"
            }
    }
  }
  let(:question) { Json2Qti::MultipleDropdowns.new(json) }

  it "should mark all the correct answers" do
    node = Nokogiri::XML(question.to_qti)

    # <varequal respident="response_dropdown1">if895fe8c431e4550794b0793348d0de6</varequal>
    expect(node.at_css("varequal[respident=response_dropdown1]").text).to eq 'if895fe8c431e4550794b0793348d0de6'
    expect(node.at_css("varequal[respident=response_dropdown2]").text).to eq 'i00881b5a9dc037b7e1e5b191ef55b80e'
    # <setvar varname="SCORE" action="Add">0.5</setvar>
    expect(node.at_css("setvar[action=Add]").text).to eq "0.5"
  end

  it "should have the response_lid for each dropdown" do
    node = Nokogiri::XML(question.to_qti)

    json["dropdowns"].each do |name, options|
      response_lid = node.at_css("presentation response_lid[ident=response_#{name}]")

      expect(response_lid).to_not be_nil
      expect(response_lid.at_css("material mattext").text).to eq name

      options.each do |ans|
        response_label = response_lid.at_css("render_choice response_label[ident=#{ans["value"]}]")

        expect(response_label).to_not be_nil
        expect(response_label.at_css("material mattext").text).to eq ans["name"]
      end
    end
  end

  it "should have the material" do
    node = Nokogiri::XML(question.to_qti)

    expect(node.at_css("presentation material mattext").text).to eq json["material"]
  end

  it "should set the question type" do
    expect(question.to_qti).to include("<fieldentry>multiple_dropdowns_question</fieldentry>")
  end

  it "should add the feedback respconditions and itemfeedbacks" do
    node = Nokogiri::XML(question.to_qti)

    json["dropdowns"].each do |name, options|
      respident = question.response_lid_for_name(name)

      options.each do |ans|
        answer_ident = question.generate_digest_ident(ans["material"])
        feedback_ident = question.feedback_ident(answer_ident, respident)
        displayfeedback = node.at_css("displayfeedback[linkrefid=#{feedback_ident}]")
        resp = displayfeedback.parent
        varequal = resp.at_css('varequal')
        itemfeedback = node.at_css("itemfeedback[ident=#{feedback_ident}] mattext").text

        expect(varequal.text).to eq answer_ident
        expect(varequal["respident"]).to eq respident
        expect(itemfeedback).to eq ans["feedback"]
      end
    end
  end

end
