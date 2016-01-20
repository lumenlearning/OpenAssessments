require 'rails_helper'

describe AssessmentXml do
  before do
    @xml = open('./spec/fixtures/swyk_quiz.xml').read
    @assessment_xml = AssessmentXml.new
    @assessment_xml.xml = @xml
    @assessment = Assessment.create!(title: 'testing', xml_file: @xml )
    @assessment_result = AssessmentResult.create!(assessment_id: @assessment.id)
    @assessment_result = double("@assessment_result", :answered_question_ids => ["4965", "3790"])
  end

  it "should lower the item count in the sections" do
    node = Nokogiri::XML(@assessment_xml.xml_with_limited_questions(1))
    node.css('section section').each do |s|
      expect(s.css('item').count).to eq 1
    end
  end

  it "should return xml with only the questions from the assessment result" do
    node = Nokogiri::XML(@assessment_xml.xml_with_specific_items(@assessment_result))
    node.css('item').each do |s|
      expect(s['ident']).to_not eq "5555"
    end
  end

  it "should return xml with only the questions from the assessment result" do
    node = Nokogiri::XML(@assessment_xml.xml_with_specific_items(@assessment_result))
    expect(node.css('item').map{|i|i['ident']}.sort).to eq ["3790", "4965"]
  end
end
