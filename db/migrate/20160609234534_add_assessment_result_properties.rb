class AddAssessmentResultProperties < ActiveRecord::Migration
  def change
    add_column :assessment_results, :assessment_xml_id, :integer
    add_column :assessment_results, :data, :jsonb, default: {}, null:false
  end
end
