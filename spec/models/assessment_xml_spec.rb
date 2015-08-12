require 'rails_helper'

describe AssessmentXml do
  before do
    @xml = open('./spec/fixtures/sections_assessment.xml').read
    @assessment_xml = AssessmentXml.new
    @assessment_xml.xml = @xml
  end

  it "should lower the item count in the sections" do
    node = Nokogiri::XML(@assessment_xml.xml_with_limited_questions(1))
    node.css('section section').each do |s|
      expect(s.css('item').count).to eq 1
    end
  end

end
