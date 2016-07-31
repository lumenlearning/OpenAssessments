require 'rails_helper'

describe AssessmentXml do
  before do
    @xml = open('./spec/fixtures/sections_assessment.xml').read
  end

  context "AssessmentXml instance" do
    before do
      @assessment_xml = AssessmentXml.new
      @assessment_xml.xml = @xml
      @assessment_xml.no_answer_xml = @xml
    end

    it "should reduce for xml" do
      post_processed_node = Nokogiri::XML(@assessment_xml.xml_with_limited_questions(1))
      post_processed_node.css('section section').each do |s|
        expect(s.css('item').count).to eq 1
      end
    end

    it "should reduce for no_anser_xml" do
      post_processed_node = Nokogiri::XML(@assessment_xml.no_answer_xml_with_limited_questions(1))
      post_processed_node.css('section section').each do |s|
        expect(s.css('item').count).to eq 1
      end
    end

  end


  context "AssessmentXml.xml_with_limited_questions" do
    before do
      @ids = []
      @post_processed_node = Nokogiri::XML(AssessmentXml.xml_with_limited_questions(@xml, 1, @ids))
    end

    it "should lower the item count in the sections" do
      @post_processed_node.css('section section').each do |s|
        expect(s.css('item').count).to eq 1
      end
    end

    it "should store the selected item identifiers" do
      @post_processed_node.css('item').each_with_index do |item, i|
        expect(@ids[i]).to eq item['ident']
      end
    end

    it "should limit without nested sections" do
      # has 8 items in 1 top-level section
      @xml = File.read(File.join(__dir__, '../fixtures/assessment.xml'))
      node = Nokogiri::XML(AssessmentXml.xml_with_limited_questions(@xml, 2))

      expect(node.css('item').count).to eq 2
    end

  end

end
