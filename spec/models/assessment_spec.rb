require 'rails_helper'

describe Assessment do

  before do
    @assessment = create_assessment
  end

  context "finding assessment xml" do
    before do
      @formative = AssessmentXml.create!(kind: 'formative', assessment_id: @assessment.id, xml: '<oi>hoyt</oi>')
      @summative = AssessmentXml.create!(kind: 'summative', assessment_id: @assessment.id, xml: '<hoyt>oi</hoyt>')
    end

    context "#xml_with_answers" do
      it "should find when no current xml set" do
        @assessment.current_assessment_xml = nil

        expect(@assessment.xml_with_answers).to eq @formative.xml
      end

      it "should find when current xml set" do
        expect(@assessment.xml_with_answers).to eq @assessment.current_assessment_xml.xml
      end

      it "should limit question count" do
        node = Nokogiri::XML(@assessment.xml_with_answers(7))
        expect(node.css('item').count).to eq 7
      end
    end

    context "#xml_without_answers" do
      it "should find when no current xml set" do
        @assessment.current_assessment_xml = nil

        expect(@assessment.xml_without_answers).to eq @summative.xml
      end

      it "should find when current xml set" do
        expect(@assessment.xml_without_answers).to eq @assessment.current_assessment_xml.no_answer_xml
      end

      it "should limit question count" do
        node = Nokogiri::XML(@assessment.xml_without_answers(5))
        expect(node.css('item').count).to eq 5
      end
    end
  end


  describe "save_xml" do

    it 'should extract the identifier' do
      assessment = build_assessment(identifier: nil)
      assessment.save!
      expect(assessment.identifier).to eq('A1001')
    end

    it 'should extract the title' do
      assessment = build_assessment(title: 'XQuestionSample')
      assessment.save!
      expect(assessment.title).to eq('XQuestionSample')
    end

    it 'should extract the section' do
      expect(@assessment.sections.count).to eq(1)
    end

    it "should create 1 file" do
      expect(@assessment.assessment_xmls.count).to eq(1)
    end

    it "should creative a formative xml file" do
      formative = @assessment.assessment_xmls.by_kind("qti")
      expect(formative).to exist
    end

    it "should not creative summative or formative xml files" do
      expect(@assessment.assessment_xmls.by_kind("summative").count).to eq 0
      expect(@assessment.assessment_xmls.by_kind("formative").count).to eq 0
    end

    it "should assign the #current_assessment_xml" do
      expect(@assessment.current_assessment_xml).to eq @assessment.assessment_xmls.first
    end

    # This is making sure the #after_save still sets the id on a new assessment
    it "should create and assign current xml" do
      assessment = Assessment.create!(title: 'testing', xml_file: File.read(File.join(__dir__, '../fixtures/swyk_quiz.xml')) )
      assessment.reload

      expect(assessment.current_assessment_xml).to_not eq nil
      assessment.xml_with_answers
    end

    context "clearing answer info for summative" do
      it "should not clear answers for xml_with_answers" do
        expect(@assessment.xml_with_answers).to match('respcondition')
      end

      it "should clear out the answer processing for no_answer_xml" do
        expect(@assessment.xml_without_answers).to_not match('respcondition')
      end

      it "should clear the feedback" do
        expect(@assessment.xml_without_answers).to_not match('itemfeedback')
      end

      # it "should clear the hints?"

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
