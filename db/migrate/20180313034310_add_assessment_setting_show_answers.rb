class AddAssessmentSettingShowAnswers < ActiveRecord::Migration
  def change
    add_column :assessment_settings, :show_answers, :boolean, default: false
  end
end
