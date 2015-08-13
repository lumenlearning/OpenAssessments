class AddTrackingColumns < ActiveRecord::Migration
  def change
    add_column :user_assessments, :lti_context_id, :string
    add_column :item_results, :outcome_guid, :string
    add_column :item_results, :answers_chosen, :string
    add_column :assessment_results, :attempt, :integer
  end
end
