class AssessmentCopier

  COPY_ATTRIBUTES = [:title, :kind, :description, :recommended_height, :license, :keywords, :account_id]
  SETTINGS_ATTRIBUTES = [:allowed_attempts, :style, :per_sec, :confidence_levels, :enable_start, :is_default, :account_id, :mode]

  attr_accessor :new_assessment, :new_settings, :old_assessment, :edit_id, :context_ids

  def initialize(assessment, opts={})
    @old_assessment = assessment
    @edit_id = opts[:edit_id]
    @context_ids = opts[:context_ids_to_update] || []
    @new_assessment = opts[:new_assessment]
  end

  def self.copy!(assessment, opts={})
    copier = AssessmentCopier.new(assessment, opts)
    new = copier.copy
    copier.move_user_assessments!

    new
  end

  def copy
    @new_assessment = Assessment.new
    COPY_ATTRIBUTES.each do |att|
      @new_assessment.send("#{att.to_s}=", @old_assessment.send(att))
    end
    @new_assessment.xml_file = @old_assessment.xml_with_answers
    @new_assessment.external_edit_id = @edit_id
    @new_assessment.copied_from_assessment_id = @old_assessment.id
    @new_assessment.save!

    if old_settings = @old_assessment.default_settings
      @new_settings = @new_assessment.assessment_settings.new
      SETTINGS_ATTRIBUTES.each do |att|
        @new_settings.send("#{att.to_s}=", old_settings.send(att))
      end
      @new_settings.save!
    end

    @new_assessment
  end


  def move_user_assessments!
    existing_ids = UserAssessment.where(assessment_id: @new_assessment.id, lti_context_id: @context_ids).pluck(:user_id)
    scope = UserAssessment.where(assessment_id: @old_assessment.id, lti_context_id: @context_ids).where.not(user_id: existing_ids)
    ActiveRecord::Base.transaction do
      AssessmentResult.where(user_assessment: scope).update_all(assessment_id: @new_assessment.id)
      scope.update_all(assessment_id: @new_assessment.id)
    end
  end


end