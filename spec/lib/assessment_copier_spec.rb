require 'rails_helper'
require 'assessment_copier'

describe AssessmentCopier do
  before do
    file = File.join(__dir__, '../fixtures/swyk_quiz.xml')
    @original = Assessment.create!(title: 'Quiz', kind: 'summative', xml_file: open(file).read, description: "hi", recommended_height: 300, license: "cc-by")
    @settings = AssessmentSetting.create!(assessment_id: @original.id, per_sec: 2, allowed_attempts: 3, style: 'test', enable_start: true, confidence_levels: false)

    @copier = AssessmentCopier.new(@original, edit_id: 'oi', context_ids_to_update: ['haha', 'sad'])
  end

  context "#copy" do
    before do
      @copy = @copier.copy
    end

    it "creates a new assessment" do
      expect(@copy.id).to_not eq @original.id
    end

    it "copies the assessment properties" do
      AssessmentCopier::COPY_ATTRIBUTES.each do |att|
        expect(@copy.send(att)).to eq @original.send(att)
      end
    end

    it "has the same assessment_xml content" do
      expect(@copy.xml_with_answers).to eq @original.xml_with_answers
      expect(@copy.current_assessment_xml.id).to_not eq @original.current_assessment_xml.id
      expect(@copy.assessment_xmls.count).to eq 1
    end

    it "copies the assessment_settings" do
      new_as = @copy.default_settings

      expect(new_as.id).to_not eq @settings.id
      AssessmentCopier::SETTINGS_ATTRIBUTES.each do |att|
        expect(new_as.send(att)).to eq @settings.send(att)
      end
    end

    it "sets the external_edit_id" do
      expect(@copy.external_edit_id).to eq 'oi'
    end

    it "should set copied_from_assessment_id" do
      expect(@copy.copied_from_assessment_id).to eq @original.id
    end

  end


  context "Updating UserAssessments" do
    before do
      @user = build(:user)
      @user_assessments = []
      @user_assessments << UserAssessment.create!(lti_context_id: 'sad',  assessment_id: @original.id, user_id: @user.id)
      @user_assessments << UserAssessment.create!(lti_context_id: 'haha',  assessment_id: @original.id, user_id: @user.id)
    end

    it "updates all the user_assessments for given lti_context_ids" do
      copy = @copier.copy
      @copier.move_user_assessments!

      @user_assessments.each do |ua|
        ua.reload
        expect(ua.assessment_id).to eq copy.id
      end
    end

    it "doesn't update for different lti_context_ids" do
      other = UserAssessment.create!(lti_context_id: 'hahasad',  assessment_id: @original.id, user_id: @user.id)
      @copier.copy
      @copier.move_user_assessments!
      other.reload

      expect(other.assessment_id).to eq @original.id
    end

    it "is idempotent" do
      copy = @copier.copy

      @copier.move_user_assessments!
      @user_assessments.each do |ua|
        ua.reload
        expect(ua.assessment_id).to eq copy.id
      end

      @copier.move_user_assessments!
      @user_assessments.each do |ua|
        ua.reload
        expect(ua.assessment_id).to eq copy.id
      end
    end

    it "leaves old UA alone if a new one already exists" do
      copy = @copier.copy
      @copier.move_user_assessments!

      new_old = UserAssessment.create!(lti_context_id: 'sad',  assessment_id: @original.id, user_id: @user.id)
      @copier.move_user_assessments!
      new_old.reload

      expect(new_old.assessment_id).to eq @original.id
    end

    it "doesn't update empty context ids array" do
      @copier.context_ids = []
      copy = @copier.copy
      @copier.move_user_assessments!

      @user_assessments.each do |ua|
        ua.reload
        expect(ua.assessment_id).to eq @original.id
      end
    end

  end


end