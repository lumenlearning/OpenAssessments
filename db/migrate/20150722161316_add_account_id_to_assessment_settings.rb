class AddAccountIdToAssessmentSettings < ActiveRecord::Migration
  def change
    add_column :assessment_settings, :account_id, :integer
  end
end
