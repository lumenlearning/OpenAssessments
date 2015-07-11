class AddEidIndexForUserAssessments < ActiveRecord::Migration
  def change
    add_index :user_assessments, :eid
  end
end
