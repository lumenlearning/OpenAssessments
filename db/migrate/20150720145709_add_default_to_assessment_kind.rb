class AddDefaultToAssessmentKind < ActiveRecord::Migration
  def change
    change_column :assessments, :kind, :string, :default => "sumative"
  end
end
