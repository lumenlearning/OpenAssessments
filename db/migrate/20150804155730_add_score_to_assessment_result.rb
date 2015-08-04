class AddScoreToAssessmentResult < ActiveRecord::Migration
  def change
    add_column :assessment_results, :score, :float
  end
end
