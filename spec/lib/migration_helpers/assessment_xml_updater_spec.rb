require 'rails_helper'
require 'migration_helpers/assessment_xml_updater'

describe MigrationHelpers::AssessmentXmlUpdater do
  let(:assessment) {FactoryGirl.create(:assessment)}
  before do
    @formative = AssessmentXml.create!(kind: 'formative', assessment_id: assessment.id, xml: '<oi>hoyt</oi>')
    @summative = AssessmentXml.create!(kind: 'summative', assessment_id: assessment.id, xml: '<hoyt>oi</hoyt>')
  end

  context "#copy_no_answer_into_formative" do
    def run_copy
      MigrationHelpers::AssessmentXmlUpdater.copy_no_answer_into_formative
      @summative.reload if @summative
      @formative.reload if @formative
    end

    it "should leave #kind alone" do
      run_copy

      expect(@formative.kind).to eq 'formative'
      expect(@summative.kind).to eq 'summative'
    end

    it "should copy associated summative #xml into formative #no_answer_xml" do
      run_copy

      expect(@formative.xml).to eq '<oi>hoyt</oi>'
      expect(@formative.no_answer_xml).to eq '<hoyt>oi</hoyt>'

      expect(@summative.xml).to eq '<hoyt>oi</hoyt>'
      expect(@summative.no_answer_xml).to eq nil
    end

    it "should not change formative if no summative pair" do
      @summative.delete; @summative = nil
      run_copy

      expect(@formative.xml).to eq '<oi>hoyt</oi>'
      expect(@formative.no_answer_xml).to eq nil
    end
  end

  context "#assign_formative_xml_to_assessment" do
    def run_assigner
      MigrationHelpers::AssessmentXmlUpdater.assign_formative_xml_to_assessment
      assessment.reload
    end

    it "should assign the formative to the assessment" do
      @formative.no_answer_xml = "Hi"; @formative.save!
      run_assigner

      expect(assessment.current_assessment_xml_id).to eq @formative.id
    end

    it "should only assign formative if no_answer_xml is set" do
      run_assigner

      expect(assessment.current_assessment_xml_id).to eq nil
    end

    it "should not assign summative if no formative exists" do
      @formative.delete; @formative = nil
      run_assigner

      expect(assessment.current_assessment_xml_id).to eq nil
    end

    it "should not overwrite an existing `current_assessment_xml_id`" do
      @formative.no_answer_xml = "Hi"; @formative.save!
      assessment.current_assessment_xml_id = @summative.id; assessment.save!
      run_assigner

      expect(assessment.current_assessment_xml_id).to eq @summative.id
    end

  end

end