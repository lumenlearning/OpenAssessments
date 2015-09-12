class AddUaIndexes < ActiveRecord::Migration
  def change
    add_index :user_assessments, :lti_context_id
    add_index :user_assessments, :assessment_id
  end
end
