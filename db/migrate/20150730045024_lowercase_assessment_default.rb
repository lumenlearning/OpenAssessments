class LowercaseAssessmentDefault < ActiveRecord::Migration
  def change
    change_column :assessments, :kind, :string, default: "formative"
  end
end
