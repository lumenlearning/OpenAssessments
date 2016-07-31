class UpdateAssessmentXmls < ActiveRecord::Migration
  def change
    add_column :assessment_xmls, :no_answer_xml, :text
    add_column :assessment_xmls, :data, :jsonb, default: {}, null:false

    add_column :assessments, :current_assessment_xml_id, :integer

    add_index :assessment_xmls, :assessment_id
  end
end
