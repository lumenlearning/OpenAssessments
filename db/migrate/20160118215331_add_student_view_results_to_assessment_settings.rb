class AddStudentViewResultsToAssessmentSettings < ActiveRecord::Migration
  def change
    add_column :assessment_settings, :show_recent_results, :boolean 
  end
end
