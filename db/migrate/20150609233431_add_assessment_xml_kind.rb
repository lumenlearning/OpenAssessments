class AddAssessmentXmlKind < ActiveRecord::Migration
  def change
    add_column :assessment_xmls, :kind, :string
  end
end
