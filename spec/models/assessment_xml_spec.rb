require 'rails_helper'

describe AssessmentXml do
  before do
    @xml = open('./spec/fixtures/sections_assessment.xml').read
    @assessment_xml = AssessmentXml.new
    @assessment_xml.xml = @xml

    @post_processed_node = Nokogiri::XML(@assessment_xml.xml_with_limited_questions(1))
  end

  it "should lower the item count in the sections" do
    @post_processed_node.css('section section').each do |s|
      expect(s.css('item').count).to eq 1
    end
  end

  it "should store the selected item identifiers" do
    ids = @assessment_xml.last_selected_item_ids
    @post_processed_node.css('item').each_with_index do |item, i|
      expect(ids[i]).to eq item['ident']
    end
  end

end
