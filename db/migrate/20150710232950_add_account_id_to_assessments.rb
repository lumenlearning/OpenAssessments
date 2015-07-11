class AddAccountIdToAssessments < ActiveRecord::Migration
  def change
    add_column :assessments, :account_id, :integer
    add_index :assessments, :account_id
  end
end
