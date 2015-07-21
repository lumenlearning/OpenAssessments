class AddIsDefaultToAssessmentSetting < ActiveRecord::Migration
  def change
    add_column :assessment_settings, :is_default, :boolean
  end
end
