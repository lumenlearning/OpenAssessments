class AddModeToAssessmentSettings < ActiveRecord::Migration
  def change
    add_column :assessment_settings, :mode, :string
  end
end
