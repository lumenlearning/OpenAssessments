class AddAsmntResultLtiValues < ActiveRecord::Migration
  def change
    add_column :assessment_results, :lti_outcome_data, :jsonb, default: {}, null:false
    add_index :assessment_results, :session_status
  end
end
