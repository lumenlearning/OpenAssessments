class AddAssessmentTypeToAssessment < ActiveRecord::Migration
  def change
    add_column :assessments, :kind, :string
  end
end
