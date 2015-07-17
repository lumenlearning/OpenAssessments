require 'rails_helper'

describe Assessment do

  before do
    @assessment = create_assessment
  end

  describe "save_xml" do

 # TODO
    it "creates a formative assessment_xml" do
      #@assessment.save_xml()
    end

    it "creates a summative assessment_xml" do
      #@assessment.save_xml()
    end

  end

  describe "from_xml" do
  
    it 'should extract the identifier' do
      assessment = build_assessment(identifier: nil)
      assessment.save!
      expect(assessment.identifier).to eq('A1001')
    end

    it 'should extract the title' do
      assessment = build_assessment(title: nil)
      assessment.save!
      expect(assessment.title).to eq('XQuestionSample')
    end

    it 'should extract the section' do
      expect(@assessment.sections.count).to eq(1)
    end

    it "should create two files" do
      expect(@assessment.assessment_xmls.count).to eq(2)
    end

    it "should creative a formative xml file" do
      formative = @assessment.assessment_xmls.by_kind("formative")
      expect(formative).to exist
    end

    it "should creative a summative xml file" do
      summative = @assessment.assessment_xmls.by_kind("summative")
      expect(summative).to exist
    end

  end

  describe 'acts as taggable' do
    it 'should add keywords to assessment' do
      keyword = FactoryGirl.generate(:name)
      @assessment.keyword_list.add(keyword, parse: true)
      @assessment.save!
      expect(Assessment.tagged_with(keyword).first).to eq(@assessment)
    end
  end

end
