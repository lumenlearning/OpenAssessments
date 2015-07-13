class AddSettingsToAssessmentSettings < ActiveRecord::Migration
  def change
    add_column :assessment_settings,  :style, :string
    add_column :assessment_settings,  :per_sec, :string
    add_column :assessment_settings,  :confidence_levels, :boolean
    add_column :assessment_settings,  :enable_start, :boolean
  end
end