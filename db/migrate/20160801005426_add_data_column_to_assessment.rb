class AddDataColumnToAssessment < ActiveRecord::Migration
  def change
    add_column :assessments, :data, :jsonb, default: {}, null:false
  end
end
