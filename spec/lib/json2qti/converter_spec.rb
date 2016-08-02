require 'rails_helper'
require 'json2qti'
require 'nokogiri'

describe Json2Qti::Converter do
  let(:json) {
      {
    "title" => "Show What You Know: Outcome Name",
    "ident" => "ib7b957_swyk",
    "assessmentId" => "152",
    "standard" => "qti",
    "items" => [
      {
        "id" => "4965",
        "title" => "",
        "question_type" => "multiple_answers_question",
        "material" => "Which of the following is/are an example(s) of a service?",
        "answers" => [
          {
            "id" => "9755",
            "material" => "a flight from Los Angeles to Dallas",
            "isCorrect" => true
          },
          {
            "id" => "4501",
            "material" => "a couch or sofa",
            "isCorrect" => false
          },
          {
            "id" => "6570",
            "material" => "a computer",
            "isCorrect" => false
          }
        ],
        "outcome" => {
          "shortOutcome" => "What Is Business?",
          "longOutcome" => "Define the concept of business",
          "outcomeGuid" => "f71c5ce2-46b7-4cce-9531-1680d42faf1b"
        }
      }
    ]
  }
  }
  let(:converter){Json2Qti::Converter.new(json)}

  it "should build the proper structure" do
    node = Nokogiri::XML(converter.convert_to_qti)

    expect(node.at_css('assessment > section > item')).not_to eq nil
    expect(node.at_css('assessment > qtimetadata > qtimetadatafield')).not_to eq nil
  end

  it "should use sections" do
    converter = Json2Qti::Converter.new(json, {"group_by_section" => true, "per_sec" => 1})
    node = Nokogiri::XML(converter.convert_to_qti)

    expect(node.css('assessment > section > item').count).to eq 0
    expect(node.css('assessment > section > section').count).to eq 1
    expect(node.css('assessment > section > section > item').count).to eq 1
    expect(node.css('selection_number').text).to eq '1'
  end
end